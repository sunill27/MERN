import { Sequelize } from "sequelize-typescript";
import Product from "./models/Product";
import User from "./models/User";
import Category from "./models/Category";
import Cart from "./models/Cart";
import Order from "./models/Order";
import OrderDetail from "./models/OrderDetail";
import Payment from "./models/Payment";

const sequelize = new Sequelize({
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
User.hasMany(Product, { foreignKey: "userId" });
Product.belongsTo(User, { foreignKey: "userId" });

//Relationships between Product and Category Table:
Category.hasMany(Product, { foreignKey: "categoryId" });
Product.belongsTo(Category, { foreignKey: "categoryId" });

//Relationship between User and Cart:
User.hasMany(Cart, { foreignKey: "userId" });
Cart.belongsTo(User, { foreignKey: "userId" });

//Relationship between Product and Cart:
Product.hasMany(Cart, { foreignKey: "productId" });
Cart.belongsTo(Product, { foreignKey: "productId" });

//Relationship between Order and OrderDetails:
Order.hasMany(OrderDetail, { foreignKey: "orderId" });
OrderDetail.belongsTo(Order, { foreignKey: "orderId" });

//Relationship between OrderDetails and Product:
Product.hasMany(OrderDetail, { foreignKey: "productId" });
OrderDetail.belongsTo(Product, { foreignKey: "productId" });

//Relationship between Order and Payment:
Payment.hasOne(Order, { foreignKey: "paymentId" });
Order.belongsTo(Payment, { foreignKey: "paymentId" });

//Relationship between Order and User:
User.hasOne(Order, { foreignKey: "userId" });
Order.belongsTo(User, { foreignKey: "userId" });

export default sequelize;
