import { Router } from "express";

import { authRequired } from "../middlewares/validateToken.js";
import { deleteUser, getUser, getUsers, updateUser, userRestore } from "../controllers/user.controller.js";
import { roleVerify } from "../middlewares/roleVerify.js";
import { isOwnerOrAdminFactory } from "../middlewares/adminOrOwner.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import { IdParamSchema, updatedUserSchema, UserNameQuerySchema } from "../schema";
import { sanitizeQuery } from "../middlewares/sanitizeQuery.js";

const router = Router()

router.get("/users/:userId",
    authRequired,
    roleVerify,
    validateSchema({ params: IdParamSchema }),
    getUser)

router.get("/users",
    authRequired,
    roleVerify,
    sanitizeQuery,
    validateSchema({ query: UserNameQuerySchema.partial() }),
    getUsers)

router.put("/users/:userId",
    authRequired,
    isOwnerOrAdminFactory("ownerOrAdmin", (req) => req.params.userId),
    sanitizeQuery,
    validateSchema({ params: IdParamSchema, body: updatedUserSchema }),
    updateUser)

router.post("/users/:userId",
    authRequired,
    isOwnerOrAdminFactory("admin", (req) => req.params.userId),
    validateSchema({ params: IdParamSchema }),
    userRestore)

router.delete("/users/:userId",
    authRequired,
    isOwnerOrAdminFactory("ownerOrAdmin", (req) => req.params.userId),
    validateSchema({ params: IdParamSchema }),
    deleteUser)

export default router