import express, { Router } from "express";
import authMiddleware from "../middleware/authMiddleware";
import cartController from "../controllers/cartController";
import errorHandler from "../services/catchAsync";
const router: Router = express.Router();

router
  .route("/")
  .post(authMiddleware.isAuthenticated, errorHandler(cartController.addToCart))
  .get(authMiddleware.isAuthenticated, errorHandler(cartController.getMyCarts));

router
  .route("/:productId")
  .patch(
    authMiddleware.isAuthenticated,
    errorHandler(cartController.updateCartItem)
  )
  .delete(
    authMiddleware.isAuthenticated,
    errorHandler(cartController.deleteMyCartItem)
  );
export default router;
