import { Request, Response } from "express";
import Product from "../database/models/Product";
import { AuthRequest } from "../middleware/authMiddleware";
import User from "../database/models/User";
import Category from "../database/models/Category";

class ProductController {
  async addProduct(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user?.id;
    const {
      productName,
      productDescription,
      productPrice,
      productStock,
      categoryId,
    } = req.body;
    let fileName;

    // Check if there's an uploaded file
    if (req.file) {
      fileName = process.env.Local_Url + req.file.filename;
    } else {
      fileName =
        "https://products.shureweb.eu/shure_product_db/product_main_images/files/c25/16a/40-/original/ce632827adec4e1842caa762f10e643d.webp";
    }

    // Check if all required fields are present
    if (
      !productName ||
      !productDescription ||
      !productPrice ||
      !productStock ||
      !categoryId
    ) {
      res.status(400).json({
        message: "Please provide product details.",
      });
      return;
    }

    // Additional validation for price (assuming it should be a number)
    if (isNaN(Number(productPrice))) {
      res.status(400).json({
        message: "Price should be a valid number.",
      });
      return;
    }

    try {
      // Create a new product in the database
      await Product.create({
        productName,
        productDescription,
        productPrice: Number(productPrice), // Convert price to number if needed
        productStock,
        productImage: fileName,
        userId: userId,
        categoryId: categoryId,
      });
      res.status(200).json({
        message: "Product Added successfully",
      });
    } catch (err) {
      // Handle database errors
      console.error("Error adding product:", err);
      res.status(500).json({
        message: "Failed to add product. Please try again later.",
      });
    }
  }

  async getAllProducts(req: Request, res: Response): Promise<void> {
    const data = await Product.findAll({
      include: [
        { model: User, attributes: ["id", "email", "username"] },
        { model: Category, attributes: ["categoryName"] },
      ],
    });
    res.status(200).json({
      message: "Products fetched successfully",
      data,
    });
  }

  async getSingleProduct(req: Request, res: Response): Promise<void> {
    const id = req.params.id;
    // console.log("Requested Id:", id);
    const data = await Product.findOne({
      where: {
        id: id,
      },
      include: [
        {
          model: User,
          attributes: ["id", "email", "username"],
        },
        {
          model: Category,
          attributes: ["id", "categoryName"],
        },
      ],
    });
    if (!data) {
      res.status(404).json({
        message: "No product with that id",
      });
    } else {
      res.status(200).json({
        message: "Product fetched successfully",
        data,
      });
    }
  }

  async updateProduct(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { productName } = req.body;
    const data = await Product.findOne({
      where: {
        id: id,
      },
    });
    await Product.update(
      { productName },
      {
        where: {
          id: id,
        },
      }
    );
    res.status(200).json({
      message: "Product updated successfully",
    });
  }

  async deleteProduct(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const data = await Product.findAll({
      where: {
        id: id,
      },
    });
    if (data.length > 0) {
      await Product.destroy({
        where: {
          id: id,
        },
      });
      res.status(200).json({
        message: "Product deleted successfully.",
      });
    } else {
      res.status(400).json({
        message: "No product found",
      });
    }
  }
}
export default new ProductController();
