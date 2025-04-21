import { Router } from 'express';
import { authRequired } from '../middlewares/validateToken.js';
import { addOrUpdateCart, deletCartItem, deleteCart, getCart } from '../controllers/cart.controller.js';

const router = Router()

router.get('/cart', authRequired, getCart)

router.post('/cart/product/id/:id', authRequired, addOrUpdateCart)

router.delete('/cart/delete/product/id/:id', authRequired, deletCartItem)

router.delete('/cart/delete/cart/:id', authRequired, deleteCart)


export default router