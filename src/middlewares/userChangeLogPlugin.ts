import User from "../models/User.model.js"
import UserChangeLog from "../models/UserChangeLog.model.js"
import { TRACKED_USER_FIELDS } from "../types/user.types.js"

interface UpdateContext {
    context?: {
        updatedBy?: string
    }
}

export function userChangeLogPlugin() {
    User.schema.post("findOneAndUpdate", async function (doc: any) {
        if (!doc) return

        const update = this.getUpdate() as Record<string, any>
        const options = this.getOptions() as UpdateContext
        const fieldsToTrack = TRACKED_USER_FIELDS

        for (const field of fieldsToTrack) {
            if (update.$set && update.$set[field] !== undefined) {
                const oldValue = doc[field]
                const newValue = update.$set[field]

                if (oldValue !== newValue) {
                    await UserChangeLog.create({
                        userId: doc._id,
                        changedBy: options.context?.updatedBy || null,
                        field,
                        oldValue,
                        newValue
                    })
                }
            }
        }
    })
}