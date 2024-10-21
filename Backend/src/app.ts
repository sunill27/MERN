import express, { Application, Request, Response } from "express";
const app: Application = express();
const PORT: number = 4000;

// require("./model/index");
import * as dotenv from "dotenv";
dotenv.config();

// Database Invoked:
import "./database/connection";

//Cors to allow all protocols to access the database and backend
import cors from "cors";
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

import adminSeeder from "./adminSeeder";
import userRoute from "./routes/userRoute";
import productRoute from "./routes/productRoute";
import categoryRoute from "./routes/categoryRoute";
import categoryController from "./controllers/categoryController";
import cartRoute from "./routes/cartRoute";
import orderRoute from "./routes/orderRoute";
import { Server } from "socket.io";
import { promisify } from "util";
import jwt from "jsonwebtoken";
import User from "./database/models/User";

app.use(express.json());

//Admin Seeder:
adminSeeder();

//Image Check:
app.use(express.static("./src/uploads"));

//localhost:3000/register || localhost:3000/x/register
app.use("", userRoute);
app.use("/admin/product", productRoute);
app.use("/admin/category", categoryRoute);
app.use("/customer/cart", cartRoute);
app.use("/order", orderRoute);

const server = app.listen(PORT, () => {
  categoryController.seedCategory();
  console.log("Server has started at port:", PORT);
});

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:5174"],
  },
});

interface OnlineUser {
  socketId: string;
  userId: string;
  role: string;
}

let onlineUsers: OnlineUser[] = [];

const addToOnlineUsers = (socketId: string, userId: string, role: string) => {
  onlineUsers = onlineUsers.filter((user: any) => user.userId !== userId);
  onlineUsers.push({ socketId, userId, role });
};

io.on("connection", async (socket) => {
  console.log("Client Connected!", socket.id); // Check the socket ID

  const { token } = socket.handshake.auth;
  if (token) {
    //@ts-ignore
    const decoded = await promisify(jwt.verify)(token, process.env.SECRET_KEY);

    //@ts-ignore
    const existingUsers = await User.findByPk(decoded.id);
    if (existingUsers) {
      addToOnlineUsers(socket.id, existingUsers.id, existingUsers.role);
    }
  }
  socket.on("updatedOrderStatus", ({ status, orderId, userId }) => {
    const findUser = onlineUsers.find((user: any) => user.userId == userId);
    if (findUser) {
      io.to(findUser.socketId).emit("statusUpdated", { status, orderId });
    }
  });
  console.log("OnlineUsers:", onlineUsers);
});
