import express, { Router } from "express";
import authMiddleware, { Role } from "../middleware/authMiddleware";
import categoryController from "../controllers/categoryController";
import errorHandler from "../services/catchAsync";

const router: Router = express.Router();

router
  .route("/")
  .get(errorHandler(categoryController.getCategories))
  .post(
    authMiddleware.isAuthenticated,
    authMiddleware.restrictTo(Role.Admin),
    errorHandler(categoryController.addCategory)
  );

router
  .route("/:id")
  .delete(
    authMiddleware.isAuthenticated,
    authMiddleware.restrictTo(Role.Admin),
    errorHandler(categoryController.deleteCategory)
  )
  .patch(
    authMiddleware.isAuthenticated,
    authMiddleware.restrictTo(Role.Admin),
errorHandler(    categoryController.updateCategory
)  );
export default router;
