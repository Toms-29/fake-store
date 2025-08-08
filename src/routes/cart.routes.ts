import { Router } from 'express';

import { authRequired } from '../middlewares/validateToken.js';
import { addToCart, updateCart, deleteCartItem, deleteCart, getCart, clearCart } from '../controllers/cart.controller.js';
import { isOwnerOrAdminFactory } from '../middlewares/adminOrOwner.js';
import { validateSchema } from '../middlewares/validateSchema.js';
import { IdParamSchema, QuantitySchema } from '../schema';
import { sanitizeQuery } from '../middlewares/sanitizeQuery.js';

const router = Router()

router.get('/cart',
    authRequired,
    validateSchema({ user: IdParamSchema }),
    getCart)

router.post('/cart/:productId',
    authRequired,
    isOwnerOrAdminFactory("owner", (req) => req.user.id),
    sanitizeQuery,
    validateSchema({ body: QuantitySchema, params: IdParamSchema }),
    addToCart)

router.put('/cart/:productId',
    authRequired,
    isOwnerOrAdminFactory("owner", (req) => req.user.id),
    sanitizeQuery,
    validateSchema({ body: QuantitySchema, params: IdParamSchema }),
    updateCart)

router.delete('/cart/:productId',
    authRequired,
    isOwnerOrAdminFactory("owner", (req) => req.user.id),
    validateSchema({ params: IdParamSchema, user: IdParamSchema }),
    deleteCartItem)

router.delete('/cart/clear',
    authRequired,
    isOwnerOrAdminFactory("ownerOrAdmin", (req) => req.user.id),
    validateSchema({ user: IdParamSchema }),
    clearCart)

router.delete('/cart/:cartId',
    authRequired,
    isOwnerOrAdminFactory("owner", (req) => req.user.id),
    validateSchema({ params: IdParamSchema }),
    deleteCart)

export default router