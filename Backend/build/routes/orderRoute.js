"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = __importStar(require("../middleware/authMiddleware"));
const catchAsync_1 = __importDefault(require("../services/catchAsync"));
const orderController_1 = __importDefault(require("../controllers/orderController"));
const router = express_1.default.Router();
router
    .route("/")
    .post(authMiddleware_1.default.isAuthenticated, (0, catchAsync_1.default)(orderController_1.default.createOrder))
    .get(authMiddleware_1.default.isAuthenticated, authMiddleware_1.default.restrictTo(authMiddleware_1.Role.Admin), (0, catchAsync_1.default)(orderController_1.default.fetchOrders));
router
    .route("/verify")
    .post(authMiddleware_1.default.isAuthenticated, (0, catchAsync_1.default)(orderController_1.default.verifyTransaction));
router
    .route("/customer/")
    .get(authMiddleware_1.default.isAuthenticated, (0, catchAsync_1.default)(orderController_1.default.fetchMyOrders));
router
    .route("/customer/:id")
    .patch(authMiddleware_1.default.isAuthenticated, authMiddleware_1.default.restrictTo(authMiddleware_1.Role.Customer), (0, catchAsync_1.default)(orderController_1.default.cancelMyOrder))
    .get(authMiddleware_1.default.isAuthenticated, (0, catchAsync_1.default)(orderController_1.default.fetchedOrderDetails));
router
    //Admin Control Routes
    .route("/admin/payment/:id")
    .patch(authMiddleware_1.default.isAuthenticated, authMiddleware_1.default.restrictTo(authMiddleware_1.Role.Admin), (0, catchAsync_1.default)(orderController_1.default.changePaymentStatus));
router
    .route("/admin/:id")
    .patch(authMiddleware_1.default.isAuthenticated, authMiddleware_1.default.restrictTo(authMiddleware_1.Role.Admin), (0, catchAsync_1.default)(orderController_1.default.changeOrderStatus))
    .delete(authMiddleware_1.default.isAuthenticated, authMiddleware_1.default.restrictTo(authMiddleware_1.Role.Admin), (0, catchAsync_1.default)(orderController_1.default.deleteOrder));
exports.default = router;
