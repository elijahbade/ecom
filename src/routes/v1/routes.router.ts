import express, { Request, Response, NextFunction } from 'express'
import authRoutes from './routers/auth.router'
import productRoutes from './routers/product.router'
import cartRoutes from './routers/cart.router'
import orderRoutes from './routers/order.router'
import checkoutRoutes from './routers/checkout.router'
import webhookRoute from './routers/webhooks.router'
import adminRoutes from './routers/admin.router'
import { protect, rbac } from '../../middleware/auth.mw'


//create router
const router = express.Router();

router.use('/auth', authRoutes)
router.use('/product', productRoutes)
router.use('/cart',  cartRoutes)
router.use('/order',  orderRoutes)
router.use('/checkout',  checkoutRoutes)
router.use('/', webhookRoute);
router.use('/admin', protect,  rbac("admin"), adminRoutes)


router.get('/', (req: Request, res: Response, next: NextFunction) =>{

res.status(200).json({
        error: false,
        errors: [],
         data: { 
             name: 'eCom Project - V1 Default',
         },
         message: 'ecom-project api v1.0.0',
         status: 200
     })
 })

export default router;