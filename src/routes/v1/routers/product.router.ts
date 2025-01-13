import express from 'express'
import { validateChannels as vcd } from '../../../middleware/header.mw'
import { uploadProduct } from '../../../controllers/product/uploadProduct.controllers';
import { getProducts} from '../../../controllers/product/getProduct.controllers';
import { updateProduct } from '../../../controllers/product/updateProduct.controllers';
import getCategoryProduct from '../../../controllers/product/getCategoryProduct.controllers';
import getProductsByCategory from '../../../controllers/product/geProductBycategory.controllers';


const router = express.Router({ mergeParams: true });


router.post('/upload-product', uploadProduct)
router.get('/get-product', vcd, getProducts)
router.patch('/update-product',updateProduct)
router.get('/get-categoryProduct', getCategoryProduct)
router.get('/category-product', getProductsByCategory)



export default router;