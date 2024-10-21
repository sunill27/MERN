"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const orderTypes_1 = require("../types/orderTypes");
const Order_1 = __importDefault(require("../database/models/Order"));
const Payment_1 = __importDefault(require("../database/models/Payment"));
const OrderDetail_1 = __importDefault(require("../database/models/OrderDetail"));
const axios_1 = __importDefault(require("axios"));
const Product_1 = __importDefault(require("../database/models/Product"));
const Cart_1 = __importDefault(require("../database/models/Cart"));
const User_1 = __importDefault(require("../database/models/User"));
const Category_1 = __importDefault(require("../database/models/Category"));
class ExtendedOrder extends Order_1.default {
}
class OrderController {
    createOrder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                const { phoneNumber, shippingAddress, totalAmount, paymentDetails, items, } = req.body;
                if (!phoneNumber ||
                    !shippingAddress ||
                    !totalAmount ||
                    !paymentDetails ||
                    !paymentDetails.paymentMethod ||
                    items.length == 0) {
                    res.status(400).json({
                        message: "Please provide phoneNumber, shippingAddress, totalAmount, paymentDetails, items",
                    });
                    return;
                }
                const paymentData = yield Payment_1.default.create({
                    paymentMethod: paymentDetails.paymentMethod,
                });
                const orderData = yield Order_1.default.create({
                    phoneNumber,
                    shippingAddress,
                    totalAmount,
                    userId,
                    paymentId: paymentData.id,
                });
                let responseOrderData;
                for (var i = 0; i < items.length; i++) {
                    responseOrderData = yield OrderDetail_1.default.create({
                        quantity: items[i].quantity,
                        productId: items[i].productId,
                        orderId: orderData.id,
                    });
                    yield Cart_1.default.destroy({
                        where: {
                            productId: items[i].productId,
                            userId: userId,
                        },
                    });
                }
                if (paymentDetails.paymentMethod.toLowerCase() === orderTypes_1.PaymentMethod.KHALTI) {
                    // Khalti Integration
                    const data = {
                        return_url: "http://localhost:5173/success/",
                        purchase_order_id: orderData.id,
                        amount: totalAmount * 100, // 'paisa' ma hunxa so * 100
                        website_url: "http://localhost:5173/",
                        purchase_order_name: "orderName_" + orderData.id,
                    };
                    const response = yield axios_1.default.post("https://a.khalti.com/api/v2/epayment/initiate/", data, {
                        headers: {
                            Authorization: "key " + process.env.KHALTI_KEY,
                        },
                    });
                    const khaltiResponse = response.data;
                    paymentData.pidx = khaltiResponse.pidx;
                    yield paymentData.save(); // Ensure this is awaited
                    res.status(200).json({
                        message: "Order placed successfully",
                        url: khaltiResponse.payment_url,
                        data: responseOrderData,
                    });
                }
                else {
                    res.status(200).json({
                        message: "Order placed successfully.",
                    });
                }
            }
            catch (error) {
                console.error("Error creating order:", error);
                res.status(500).json({ message: "Internal server error" });
            }
        });
    }
    verifyTransaction(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { pidx } = req.body;
            if (!pidx) {
                res.status(400).json({
                    message: "Please provide pidx",
                });
                return;
            }
            const response = yield axios_1.default.post("https://a.khalti.com/api/v2/epayment/lookup/", { pidx }, {
                headers: {
                    Authorization: "key " + process.env.KHALTI_KEY,
                },
            });
            const data = response.data;
            // console.log(data);
            if (data.status === orderTypes_1.TransactionStatus.COMPLETED) {
                yield Payment_1.default.update({ paymentStatus: "paid" }, {
                    where: {
                        pidx: pidx,
                    },
                });
                res.status(200).json({
                    message: "Paymnet verified successfully",
                });
            }
            else {
                res.status(200).json({
                    message: "Payment not verified",
                });
            }
        });
    }
    //CUSTOMER SIDE STARTS:
    fetchMyOrders(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            const orders = yield Order_1.default.findAll({
                where: {
                    userId,
                },
                // To join payment table also
                include: [
                    {
                        model: Payment_1.default,
                        attributes: ["paymentMethod", "paymentStatus"],
                    },
                ],
            });
            if (orders.length > 0) {
                res.status(200).json({
                    message: "Order fetched successfully",
                    data: orders,
                });
            }
            else {
                res.status(404).json({
                    message: "No order placed yet",
                    data: [],
                });
            }
        });
    }
    fetchedOrderDetails(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const orderId = req.params.id;
            const orderDetails = yield OrderDetail_1.default.findAll({
                where: {
                    orderId,
                },
                include: [
                    {
                        model: Product_1.default,
                        include: [
                            {
                                model: Category_1.default,
                                attributes: ["categoryName"],
                            },
                        ],
                    },
                    {
                        model: Order_1.default,
                        include: [
                            {
                                model: Payment_1.default,
                                attributes: ["paymentMethod", "paymentStatus"],
                            },
                            {
                                model: User_1.default,
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
            }
            else {
                res.status(404).json({
                    message: "No any order details available",
                    data: [],
                });
            }
        });
    }
    cancelMyOrder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            const orderId = req.params.id;
            const order = yield Order_1.default.findAll({
                where: {
                    userId,
                    id: orderId,
                },
            });
            if ((order === null || order === void 0 ? void 0 : order.orderStatus) === orderTypes_1.OrderStatus.ONTHEWAY ||
                (order === null || order === void 0 ? void 0 : order.orderStatus) === orderTypes_1.OrderStatus.PREPARATION) {
                res.status(200).json({
                    message: "You can't cancel your order when it is on the way or prepared",
                });
                return;
            }
            yield Order_1.default.update({ orderStatus: orderTypes_1.OrderStatus.CANCELLED }, {
                where: {
                    id: orderId,
                },
            });
            res.status(200).json({
                message: "Order cancelled successfully",
            });
        });
    }
    //ADMIN SIDE STARTS:
    //Order status change
    changeOrderStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const orderId = req.params.id;
            const orderStatus = req.body.orderStatus;
            yield Order_1.default.update({
                orderStatus: orderStatus,
            }, {
                where: {
                    id: orderId,
                },
            });
            res.status(200).json({
                message: "Order status updated successfully",
            });
        });
    }
    //Payment status change
    changePaymentStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const orderId = req.params.id;
            const paymentStatus = req.body.paymentStatus;
            const order = yield Order_1.default.findByPk(orderId); // If 'order:any' is used we don't need to create extended class
            const extendedOrder = order;
            yield Payment_1.default.update({
                paymentStatus: paymentStatus,
            }, {
                where: {
                    id: extendedOrder.paymentId,
                },
            });
            res.status(200).json({
                message: `Payment status  of order Id ${orderId} updated successfully to ${paymentStatus}`,
            });
        });
    }
    //Delete order
    deleteOrder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const orderId = req.params.id;
            const order = yield Order_1.default.findByPk(orderId);
            const extendedOrder = order;
            if (Order_1.default) {
                yield OrderDetail_1.default.destroy({
                    where: {
                        orderId: orderId,
                    },
                });
                yield Payment_1.default.destroy({
                    where: {
                        id: extendedOrder.paymentId,
                    },
                });
                yield Order_1.default.destroy({
                    where: {
                        id: orderId,
                    },
                });
                res.status(200).json({
                    message: "Order deleted successfully",
                });
            }
            else
                res.status(404).json({
                    message: " No order with that order Id",
                });
        });
    }
    //To fetch all orders:
    fetchOrders(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const orders = yield Order_1.default.findAll({
                // To join payment table also
                include: [
                    {
                        model: Payment_1.default,
                    },
                ],
            });
            if (orders.length > 0) {
                res.status(200).json({
                    message: "Order fetched successfully",
                    data: orders,
                });
            }
            else {
                res.status(404).json({
                    message: "No order placed yet",
                    data: [],
                });
            }
        });
    }
}
exports.default = new OrderController();
