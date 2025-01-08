import express, { Request, Response, NextFunction } from 'express'



//create router
const router = express.Router();



router.get('/', (req: Request, res: Response, next: NextFunction) =>{

res.status(200).json({
        error: false,
        errors: [],
         data: { 
             name: 'LevCom API - V1 Default',
         },
         message: 'levcom api v1.0.0',
         status: 200
     })
 })

export default router;