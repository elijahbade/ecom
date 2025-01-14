import express from "express";
import { cartController } from "../../../controllers/cart.controllers";


const router = express.Router();

router.get("/:userId", cartController.getCart);
router.post("/:userId/add", cartController.addToCart);
router.put("/:userId/update", cartController.updateCartItem);
router.delete("/:userId/remove/:productId", cartController.removeCartItem);
router.post("/:userId/clear", cartController.clearCart);
router.get("/:userId/totals", cartController.calculateTotals);

export default router;
