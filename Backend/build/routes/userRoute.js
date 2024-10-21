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
const userController_1 = __importDefault(require("../controllers/userController"));
const catchAsync_1 = __importDefault(require("../services/catchAsync"));
const authMiddleware_1 = __importStar(require("../middleware/authMiddleware"));
const router = express_1.default.Router();
router.route("/register").post((0, catchAsync_1.default)(userController_1.default.registerUser));
router.route("/login").post((0, catchAsync_1.default)(userController_1.default.loginUser));
router
    .route("/users")
    .get(authMiddleware_1.default.isAuthenticated, authMiddleware_1.default.restrictTo(authMiddleware_1.Role.Admin), (0, catchAsync_1.default)(userController_1.default.fetchUsers));
router
    .route("/users/:id")
    .delete(authMiddleware_1.default.isAuthenticated, authMiddleware_1.default.restrictTo(authMiddleware_1.Role.Admin), (0, catchAsync_1.default)(userController_1.default.deleteUser));
exports.default = router;
