"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const cartController_1 = __importDefault(require("../controllers/cartController"));
const catchAsync_1 = __importDefault(require("../services/catchAsync"));
const router = express_1.default.Router();
router
    .route("/")
    .post(authMiddleware_1.default.isAuthenticated, (0, catchAsync_1.default)(cartController_1.default.addToCart))
    .get(authMiddleware_1.default.isAuthenticated, (0, catchAsync_1.default)(cartController_1.default.getMyCarts));
router
    .route("/:productId")
    .patch(authMiddleware_1.default.isAuthenticated, (0, catchAsync_1.default)(cartController_1.default.updateCartItem))
    .delete(authMiddleware_1.default.isAuthenticated, (0, catchAsync_1.default)(cartController_1.default.deleteMyCartItem));
exports.default = router;
