import { Response, Request, NextFunction } from "express"
import { HttpError } from "../errors/HttpError.js"
import { ZodSchema } from "zod"

type RequestPart = "body" | "params" | "query" | "headers" | "user"

type Schemas = Partial<Record<RequestPart, ZodSchema<any>>>

export const validateSchema = (schemas: Schemas) => {
    return (req: Request, _res: Response, next: NextFunction) => {
        try {
            for (const key of Object.keys(schemas) as RequestPart[]) {
                const schema = schemas[key];
                if (schema) {
                    const result = schema.safeParse(req[key]);
                    if (!result.success) {
                        const errorMessages = result.error.errors.map(e => e.message).join(", ");
                        throw new HttpError(`Invalid ${key}: ${errorMessages}`, 400);
                    }

                    req[key] = result.data;
                }
            }
            next()
        } catch (error) {
            next(error)
        }
    }
}