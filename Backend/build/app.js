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
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const PORT = 4000;
// require("./model/index");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
// Database Invoked:
require("./database/connection");
//Cors to allow all protocols to access the database and backend
const cors_1 = __importDefault(require("cors"));
app.use((0, cors_1.default)({
    origin: "*",
    credentials: true,
}));
const adminSeeder_1 = __importDefault(require("./adminSeeder"));
const userRoute_1 = __importDefault(require("./routes/userRoute"));
const productRoute_1 = __importDefault(require("./routes/productRoute"));
const categoryRoute_1 = __importDefault(require("./routes/categoryRoute"));
const categoryController_1 = __importDefault(require("./controllers/categoryController"));
const cartRoute_1 = __importDefault(require("./routes/cartRoute"));
const orderRoute_1 = __importDefault(require("./routes/orderRoute"));
const socket_io_1 = require("socket.io");
const util_1 = require("util");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("./database/models/User"));
app.use(express_1.default.json());
//Admin Seeder:
(0, adminSeeder_1.default)();
//Image Check:
app.use(express_1.default.static("./src/uploads"));
//localhost:3000/register || localhost:3000/x/register
app.use("", userRoute_1.default);
app.use("/admin/product", productRoute_1.default);
app.use("/admin/category", categoryRoute_1.default);
app.use("/customer/cart", cartRoute_1.default);
app.use("/order", orderRoute_1.default);
const server = app.listen(PORT, () => {
    categoryController_1.default.seedCategory();
    console.log("Server has started at port:", PORT);
});
const io = new socket_io_1.Server(server, {
    cors: {
        origin: ["http://localhost:5173", "http://localhost:5174"],
    },
});
let onlineUsers = [];
const addToOnlineUsers = (socketId, userId, role) => {
    onlineUsers = onlineUsers.filter((user) => user.userId !== userId);
    onlineUsers.push({ socketId, userId, role });
};
io.on("connection", (socket) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Client Connected!", socket.id); // Check the socket ID
    const { token } = socket.handshake.auth;
    if (token) {
        //@ts-ignore
        const decoded = yield (0, util_1.promisify)(jsonwebtoken_1.default.verify)(token, process.env.SECRET_KEY);
        //@ts-ignore
        const existingUsers = yield User_1.default.findByPk(decoded.id);
        if (existingUsers) {
            addToOnlineUsers(socket.id, existingUsers.id, existingUsers.role);
        }
    }
    socket.on("updatedOrderStatus", ({ status, orderId, userId }) => {
        const findUser = onlineUsers.find((user) => user.userId == userId);
        if (findUser) {
            io.to(findUser.socketId).emit("statusUpdated", { status, orderId });
        }
    });
    console.log("OnlineUsers:", onlineUsers);
}));
