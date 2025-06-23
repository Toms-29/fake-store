import { Router } from 'express';
import { authRequired } from '../middlewares/validateToken.js';
import { addToCart, updateCart, deleteCartItem, deleteCart, getCart } from '../controllers/cart.controller.js';

const router = Router()

router.get('/cart', authRequired, getCart)

router.post('/cart/:productId', authRequired, addToCart)

router.put('/cart/:productId', authRequired, updateCart)

router.delete('/cart/:productId', authRequired, deleteCartItem)

router.delete('/cart', authRequired, deleteCart)

export default router