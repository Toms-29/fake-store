import { Router } from 'express';
import { authRequired } from '../middlewares/validateToken.js';
import { addOrUpdateCart, deletCartItem } from '../controllers/cart.controller.js';


const router = Router()


router.post('/cart/product/id/:id', authRequired, addOrUpdateCart)

router.delete('/cart/delete/product/id/:id', authRequired, deletCartItem)


export default router