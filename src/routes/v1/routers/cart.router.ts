import express from "express";
import { cartController } from "../../../controllers/cart.controllers";
import {protect} from "../../../middleware/auth.mw";


const router = express.Router();

router.get("/:userId", protect, cartController.getCart);
router.post("/:userId/add", cartController.addToCart);
router.put("/update-cart-product", cartController.updateCartProduct);
router.get("/countAddToCartProduct", cartController.countCartProducts);
router.put("/:userId/update", cartController.updateCartItem);
router.delete("/:userId/remove/:productId", cartController.removeCartItem);
router.post("/:userId/clear", cartController.clearCart);
router.get("/:userId/totals", cartController.calculateTotals);

export default router;
