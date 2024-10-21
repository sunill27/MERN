import { Response, Request } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import {
  KhaltiResponse,
  OrderData,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
  TransactionStatus,
  TransactionVerificationResponse,
} from "../types/orderTypes";
import Order from "../database/models/Order";
import Payment from "../database/models/Payment";
import OrderDetails from "../database/models/OrderDetail";
import axios from "axios";
import Product from "../database/models/Product";
import Cart from "../database/models/Cart";
import User from "../database/models/User";
import Category from "../database/models/Category";

class ExtendedOrder extends Order {
  declare paymentId: string | null;
}

class OrderController {
  async createOrder(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const {
        phoneNumber,
        shippingAddress,
        totalAmount,
        paymentDetails,
        items,
      }: OrderData = req.body;

      if (
        !phoneNumber ||
        !shippingAddress ||
        !totalAmount ||
        !paymentDetails ||
        !paymentDetails.paymentMethod ||
        items.length == 0
      ) {
        res.status(400).json({
          message:
            "Please provide phoneNumber, shippingAddress, totalAmount, paymentDetails, items",
        });
        return;
      }

      const paymentData = await Payment.create({
        paymentMethod: paymentDetails.paymentMethod,
      });

      const orderData = await Order.create({
        phoneNumber,
        shippingAddress,
        totalAmount,
        userId,
        paymentId: paymentData.id,
      });

      let responseOrderData;
      for (var i = 0; i < items.length; i++) {
        responseOrderData = await OrderDetails.create({
          quantity: items[i].quantity,
          productId: items[i].productId,
          orderId: orderData.id,
        });
        await Cart.destroy({
          where: {
            productId: items[i].productId,
            userId: userId,
          },
        });
      }

      if (paymentDetails.paymentMethod.toLowerCase() === PaymentMethod.KHALTI) {
        // Khalti Integration
        const data = {
          return_url: "http://localhost:5173/success/",
          purchase_order_id: orderData.id,
          amount: totalAmount * 100, // 'paisa' ma hunxa so * 100
          website_url: "http://localhost:5173/",
          purchase_order_name: "orderName_" + orderData.id,
        };
        const response = await axios.post(
          "https://a.khalti.com/api/v2/epayment/initiate/",
          data,
          {
            headers: {
              Authorization: "key " + process.env.KHALTI_KEY,
            },
          }
        );
        const khaltiResponse: KhaltiResponse = response.data as KhaltiResponse;
        paymentData.pidx = khaltiResponse.pidx;
        await paymentData.save(); // Ensure this is awaited
        res.status(200).json({
          message: "Order placed successfully",
          url: khaltiResponse.payment_url,
          data: responseOrderData,
        });
      } else {
        res.status(200).json({
          message: "Order placed successfully.",
        });
      }
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async verifyTransaction(req: AuthRequest, res: Response): Promise<void> {
    const { pidx } = req.body;
    if (!pidx) {
      res.status(400).json({
        message: "Please provide pidx",
      });
      return;
    }
    const response = await axios.post(
      "https://a.khalti.com/api/v2/epayment/lookup/",
      { pidx },
      {
        headers: {
          Authorization: "key " + process.env.KHALTI_KEY,
        },
      }
    );
    const data: TransactionVerificationResponse =
      response.data as TransactionVerificationResponse;
    // console.log(data);
    if (data.status === TransactionStatus.COMPLETED) {
      await Payment.update(
        { paymentStatus: "paid" },
        {
          where: {
            pidx: pidx,
          },
        }
      );
      res.status(200).json({
        message: "Paymnet verified successfully",
      });
    } else {
      res.status(200).json({
        message: "Payment not verified",
      });
    }
  }

  //CUSTOMER SIDE STARTS:
  async fetchMyOrders(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user?.id;
    const orders = await Order.findAll({
      where: {
        userId,
      },
      // To join payment table also
      include: [
        {
          model: Payment,
          attributes: ["paymentMethod", "paymentStatus"],
        },
      ],
    });
    if (orders.length > 0) {
      res.status(200).json({
        message: "Order fetched successfully",
        data: orders,
      });
    } else {
      res.status(404).json({
        message: "No order placed yet",
        data: [],
      });
    }
  }

  async fetchedOrderDetails(req: AuthRequest, res: Response): Promise<void> {
    const orderId = req.params.id;
    const orderDetails = await OrderDetails.findAll({
      where: {
        orderId,
      },
      include: [
        {
          model: Product,
          include: [
            {
              model: Category,
              attributes: ["categoryName"],
            },
          ],
        },
        {
          model: Order,
          include: [
            {
              model: Payment,
              attributes: ["paymentMethod", "paymentStatus"],
            },
            {
              model: User,
              attributes: ["username", "email"],
            },
          ],
        },
      ],
    });
    if (orderDetails.length > 0) {
      res.status(200).json({
        message: "Order details fetched successfully",
        data: orderDetails,
      });
    } else {
      res.status(404).json({
        message: "No any order details available",
        data: [],
      });
    }
  }

  async cancelMyOrder(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user?.id;
    const orderId = req.params.id;
    const order: any = await Order.findAll({
      where: {
        userId,
        id: orderId,
      },
    });
    if (
      order?.orderStatus === OrderStatus.ONTHEWAY ||
      order?.orderStatus === OrderStatus.PREPARATION
    ) {
      res.status(200).json({
        message:
          "You can't cancel your order when it is on the way or prepared",
      });
      return;
    }
    await Order.update(
      { orderStatus: OrderStatus.CANCELLED },
      {
        where: {
          id: orderId,
        },
      }
    );
    res.status(200).json({
      message: "Order cancelled successfully",
    });
  }

  //ADMIN SIDE STARTS:
  //Order status change
  async changeOrderStatus(req: Request, res: Response): Promise<void> {
    const orderId = req.params.id;
    const orderStatus: OrderStatus = req.body.orderStatus;
    await Order.update(
      {
        orderStatus: orderStatus,
      },
      {
        where: {
          id: orderId,
        },
      }
    );
    res.status(200).json({
      message: "Order status updated successfully",
    });
  }

  //Payment status change
  async changePaymentStatus(req: AuthRequest, res: Response): Promise<void> {
    const orderId = req.params.id;
    const paymentStatus: PaymentStatus = req.body.paymentStatus;
    const order = await Order.findByPk(orderId); // If 'order:any' is used we don't need to create extended class
    const extendedOrder: ExtendedOrder = order as ExtendedOrder;
    await Payment.update(
      {
        paymentStatus: paymentStatus,
      },
      {
        where: {
          id: extendedOrder.paymentId,
        },
      }
    );
    res.status(200).json({
      message: `Payment status  of order Id ${orderId} updated successfully to ${paymentStatus}`,
    });
  }

  //Delete order
  async deleteOrder(req: Request, res: Response): Promise<void> {
    const orderId = req.params.id;
    const order = await Order.findByPk(orderId);
    const extendedOrder: ExtendedOrder = order as ExtendedOrder;
    if (Order) {
      await OrderDetails.destroy({
        where: {
          orderId: orderId,
        },
      });
      await Payment.destroy({
        where: {
          id: extendedOrder.paymentId,
        },
      });
      await Order.destroy({
        where: {
          id: orderId,
        },
      });
      res.status(200).json({
        message: "Order deleted successfully",
      });
    } else
      res.status(404).json({
        message: " No order with that order Id",
      });
  }

  //To fetch all orders:
  async fetchOrders(req: AuthRequest, res: Response): Promise<void> {
    const orders = await Order.findAll({
      // To join payment table also
      include: [
        {
          model: Payment,
        },
      ],
    });
    if (orders.length > 0) {
      res.status(200).json({
        message: "Order fetched successfully",
        data: orders,
      });
    } else {
      res.status(404).json({
        message: "No order placed yet",
        data: [],
      });
    }
  }
}
export default new OrderController();
