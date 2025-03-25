import { Request, Response } from 'express'

export const register = (_req: Request, res: Response) => {
    console.log("register route ok")
    res.send("register route")
}

export const login = (_req: Request, res: Response) => {
    console.log("login route ok")
    res.send("login route")
}