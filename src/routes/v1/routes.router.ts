import express, { Request, Response, NextFunction } from 'express'


//import all routes
import authRoutes from './routers/auth.router'
import productRoutes from './routers/product.router'

//create router
const router = express.Router();

router.use('/auth', authRoutes)
router.use('/product', productRoutes)

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