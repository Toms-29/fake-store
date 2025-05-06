import { Request, Response, NextFunction } from "express";
import { UserRole } from "../types/user.types.js";

export const roleVerify = (req: Request, res: Response, next: NextFunction) => {
    const { role } = req.user

    if (role === UserRole.ADMIN) { return next() }

    return res.status(403).json({ message: "Access denied: admin role required" })
}