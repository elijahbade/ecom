import express from 'express'
import { validateChannels as vcd } from '../../../middleware/header.mw'
import { uploadProduct } from '../../../controllers/product/uploadProduct.controllers';
import { getProducts} from '../../../controllers/product/getProduct.controllers';
import { updateProduct } from '../../../controllers/product/updateProduct.controllers';
import getCategoryProduct from '../../../controllers/product/getCategoryProduct.controllers';
import getProductsByCategory from '../../../controllers/product/geProductBycategory.controllers';
import { getProductById } from '../../../controllers/product/getProductById.controllers';
import { searchProducts } from '../../../controllers/product/searchProduct.controllers';
import { filterByCategories } from '../../../controllers/product/filterByCategories.controllers';
import {protect} from '../../../middleware/auth.mw';
import { deleteProduct } from '../../../controllers/product/detletePrdouct';


const router = express.Router({ mergeParams: true });


router.post('/upload-product', protect, uploadProduct)
router.get('/get-product',  getProducts)
router.patch('/update-product', protect, updateProduct)
router.get('/get-categoryProduct', getCategoryProduct)
router.get('/category-product', getProductsByCategory)
router.get('/product-details/:productId', getProductById)
router.get('/search', searchProducts )
router.get("/filter-product", filterByCategories)
router.delete('/delete-product/:productId', protect, deleteProduct)



export default router;