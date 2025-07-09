import { Router } from 'express';
import { authRequired } from '../middlewares/validateToken.js';
import { addToCart, updateCart, deleteCartItem, deleteCart, getCart, clearCart } from '../controllers/cart.controller.js';
import { isOwnerOrAdminFactory } from '../middlewares/adminOrOwner.js';

const router = Router()

router.get('/cart', authRequired, getCart)

router.post('/cart/:productId', authRequired, isOwnerOrAdminFactory("owner", (req) => req.user.id), addToCart)

router.put('/cart/:productId', authRequired, isOwnerOrAdminFactory("owner", (req) => req.user.id), updateCart)

router.delete('/cart/:productId', authRequired, isOwnerOrAdminFactory("owner", (req) => req.user.id), deleteCartItem)

router.delete('/cart/clear', authRequired, isOwnerOrAdminFactory("ownerOrAdmin", (req) => req.user.id), clearCart)

router.delete('/cart', authRequired, isOwnerOrAdminFactory("owner", (req) => req.user.id), deleteCart)

export default router