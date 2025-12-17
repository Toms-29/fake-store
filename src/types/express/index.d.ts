import { UserRole } from "../user.types.js"

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                role: UserRole;
            },
            pagination?: {
                page: number,
                limit: number,
                skip: number,
                sortField: string,
                sortOrder: number
            }
        }
    }
}

export { };