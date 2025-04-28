import { Router } from 'express';
import { authRequired } from '../middlewares/validateToken.js';
import { addToCart, updateCart, deletCartItem, deleteCart, getCart } from '../controllers/cart.controller.js';

const router = Router()

router.get('/cart', authRequired, getCart)

router.post('/cart/product/id/:id', authRequired, addToCart)

router.put('/cart/product/id/:id', authRequired, updateCart)

router.delete('/cart/delete/product/id/:id', authRequired, deletCartItem)

router.delete('/cart/delete/cart/:id', authRequired, deleteCart)


export default router