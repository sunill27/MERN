"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_typescript_1 = require("sequelize-typescript");
const Product_1 = __importDefault(require("./models/Product"));
const User_1 = __importDefault(require("./models/User"));
const Category_1 = __importDefault(require("./models/Category"));
const Cart_1 = __importDefault(require("./models/Cart"));
const Order_1 = __importDefault(require("./models/Order"));
const OrderDetail_1 = __importDefault(require("./models/OrderDetail"));
const Payment_1 = __importDefault(require("./models/Payment"));
const sequelize = new sequelize_typescript_1.Sequelize({
    database: process.env.DB_NAME,
    dialect: "mysql",
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    models: [__dirname + "/models"],
});
sequelize
    .authenticate()
    .then(() => {
    console.log("Database Connected");
})
    .catch((err) => {
    console.error("Error connecting to the database:", err);
});
sequelize.sync({ force: false }).then(() => {
    console.log("Synced!!!");
});
//Relationships between User and Product Table:
User_1.default.hasMany(Product_1.default, { foreignKey: "userId" });
Product_1.default.belongsTo(User_1.default, { foreignKey: "userId" });
//Relationships between Product and Category Table:
Category_1.default.hasMany(Product_1.default, { foreignKey: "categoryId" });
Product_1.default.belongsTo(Category_1.default, { foreignKey: "categoryId" });
//Relationship between User and Cart:
User_1.default.hasMany(Cart_1.default, { foreignKey: "userId" });
Cart_1.default.belongsTo(User_1.default, { foreignKey: "userId" });
//Relationship between Product and Cart:
Product_1.default.hasMany(Cart_1.default, { foreignKey: "productId" });
Cart_1.default.belongsTo(Product_1.default, { foreignKey: "productId" });
//Relationship between Order and OrderDetails:
Order_1.default.hasMany(OrderDetail_1.default, { foreignKey: "orderId" });
OrderDetail_1.default.belongsTo(Order_1.default, { foreignKey: "orderId" });
//Relationship between OrderDetails and Product:
Product_1.default.hasMany(OrderDetail_1.default, { foreignKey: "productId" });
OrderDetail_1.default.belongsTo(Product_1.default, { foreignKey: "productId" });
//Relationship between Order and Payment:
Payment_1.default.hasOne(Order_1.default, { foreignKey: "paymentId" });
Order_1.default.belongsTo(Payment_1.default, { foreignKey: "paymentId" });
//Relationship between Order and User:
User_1.default.hasOne(Order_1.default, { foreignKey: "userId" });
Order_1.default.belongsTo(User_1.default, { foreignKey: "userId" });
exports.default = sequelize;
