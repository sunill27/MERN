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
const Cart_1 = __importDefault(require("../database/models/Cart"));
const Product_1 = __importDefault(require("../database/models/Product"));
const Category_1 = __importDefault(require("../database/models/Category"));
class CartController {
    addToCart(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            const { quantity, productId } = req.body;
            if (!quantity || !productId) {
                res.status(400).json({
                    message: "Please provide quantity, productId",
                });
                return;
            }
            //Check if product already exist in the cart
            let cartItem = yield Cart_1.default.findOne({
                where: {
                    productId,
                    userId,
                },
            });
            if (cartItem) {
                cartItem.quantity += quantity;
                yield cartItem.save();
            }
            else {
                //Insert to cart table
                cartItem = yield Cart_1.default.create({
                    quantity,
                    userId,
                    productId,
                });
            }
            const data = yield Cart_1.default.findAll({
                where: {
                    userId,
                },
            });
            res.status(200).json({
                message: "Product added to cart",
                data,
            });
        });
    }
    //Fetch Cart Item:
    getMyCarts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            const cartItems = yield Cart_1.default.findAll({
                where: {
                    userId,
                },
                include: [
                    {
                        model: Product_1.default,
                        attributes: [
                            "productName",
                            "productDescription",
                            "productImage",
                            "productPrice",
                        ],
                        include: [
                            {
                                model: Category_1.default,
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
            }
            else {
                res.status(200).json({
                    message: "Cart items fetched Successfully",
                    data: cartItems,
                });
            }
        });
    }
    //Delte Cart Item:
    deleteMyCartItem(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            const { productId } = req.params;
            //Check whether above productId product exist or not
            const product = yield Product_1.default.findByPk(productId);
            if (!product) {
                res.status(404).json({
                    message: "No product with that id",
                });
                return;
            }
            //Delete that productId from userCart
            yield Cart_1.default.destroy({
                where: {
                    userId,
                    productId,
                },
            });
            res.status(200).json({
                message: "Product removed from cart Successfully",
            });
        });
    }
    //Update Cart Item:
    updateCartItem(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { productId } = req.params;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            const { quantity } = req.body;
            if (!quantity) {
                res.status(400).json({
                    message: "Please provide product quantity",
                });
                return;
            }
            const cartData = yield Cart_1.default.findOne({
                where: {
                    userId,
                    productId,
                },
            });
            if (cartData) {
                cartData.quantity = quantity;
                yield (cartData === null || cartData === void 0 ? void 0 : cartData.save());
                res.status(200).json({
                    message: "Product of cart updated Successfully",
                    data: cartData,
                });
            }
            else {
                res.status(404).json({
                    message: "No productId of that userId",
                });
            }
        });
    }
}
exports.default = new CartController();
