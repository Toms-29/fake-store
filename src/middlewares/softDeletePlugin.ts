import { Query } from "mongoose";

export function softDeletePlugin(schema: any) {
    const excludeDeletedMiddleware = function (this: Query<any, any>, next: () => void) {
        const queryFilter = this.getFilter()

        if (!(queryFilter as any).withDeleted) { this.setQuery({ ...queryFilter, isDeleted: false }) }
        else { delete (queryFilter as any).withDeleted }

        next()
    }

    schema.pre("find", excludeDeletedMiddleware)
    schema.pre("findOne", excludeDeletedMiddleware)
    schema.pre("countDocuments", excludeDeletedMiddleware)
    schema.pre("findOneAndUpdate", excludeDeletedMiddleware)
}