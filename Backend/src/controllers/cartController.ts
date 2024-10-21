import { Request, Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import Cart from "../database/models/Cart";
import Product from "../database/models/Product";
import Category from "../database/models/Category";

class CartController {
  async addToCart(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user?.id;
    const { quantity, productId } = req.body;
    if (!quantity || !productId) {
      res.status(400).json({
        message: "Please provide quantity, productId",
      });
      return;
    }

    //Check if product already exist in the cart
    let cartItem = await Cart.findOne({
      where: {
        productId,
        userId,
      },
    });
    if (cartItem) {
      cartItem.quantity += quantity;
      await cartItem.save();
    } else {
      //Insert to cart table
      cartItem = await Cart.create({
        quantity,
        userId,
        productId,
      });
    }
    const data = await Cart.findAll({
      where: {
        userId,
      },
    });
    res.status(200).json({
      message: "Product added to cart",
      data,
    });
  }

  //Fetch Cart Item:
  async getMyCarts(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user?.id;
    const cartItems = await Cart.findAll({
      where: {
        userId,
      },
      include: [
        {
          model: Product,
          attributes: [
            "productName",
            "productDescription",
            "productImage",
            "productPrice",
          ],
          include: [
            {
              model: Category,
              attributes: ["id", "categoryName"],
            },
          ],
        },
      ],
      attributes: ["productId", "quantity"],
    });
    if (cartItems.length === 0) {
      res.status(400).json({
        message: "No items in cart",
      });
    } else {
      res.status(200).json({
        message: "Cart items fetched Successfully",
        data: cartItems,
      });
    }
  }

  //Delte Cart Item:
  async deleteMyCartItem(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user?.id;
    const { productId } = req.params;

    //Check whether above productId product exist or not
    const product = await Product.findByPk(productId);
    if (!product) {
      res.status(404).json({
        message: "No product with that id",
      });
      return;
    }

    //Delete that productId from userCart
    await Cart.destroy({
      where: {
        userId,
        productId,
      },
    });
    res.status(200).json({
      message: "Product removed from cart Successfully",
    });
  }

  //Update Cart Item:
  async updateCartItem(req: AuthRequest, res: Response): Promise<void> {
    const { productId } = req.params;
    const userId = req.user?.id;
    const { quantity } = req.body;
    if (!quantity) {
      res.status(400).json({
        message: "Please provide product quantity",
      });
      return;
    }
    const cartData = await Cart.findOne({
      where: {
        userId,
        productId,
      },
    });
    if (cartData) {
      cartData.quantity = quantity;
      await cartData?.save();
      res.status(200).json({
        message: "Product of cart updated Successfully",
        data: cartData,
      });
    } else {
      res.status(404).json({
        message: "No productId of that userId",
      });
    }
  }
}

export default new CartController();
