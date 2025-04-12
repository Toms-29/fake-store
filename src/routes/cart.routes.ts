import { Router } from 'express';
import { authRequired } from '../middlewares/validateToken.js';
import { addToCart } from '../controllers/cart.controller.js';


const router = Router()


router.post('/cart/product/id/:id', authRequired, addToCart)


export default router