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
const Product_1 = __importDefault(require("../database/models/Product"));
const User_1 = __importDefault(require("../database/models/User"));
const Category_1 = __importDefault(require("../database/models/Category"));
class ProductController {
    addProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            const { productName, productDescription, productPrice, productStock, categoryId, } = req.body;
            let fileName;
            // Check if there's an uploaded file
            if (req.file) {
                fileName = process.env.Local_Url + req.file.filename;
            }
            else {
                fileName =
                    "https://products.shureweb.eu/shure_product_db/product_main_images/files/c25/16a/40-/original/ce632827adec4e1842caa762f10e643d.webp";
            }
            // Check if all required fields are present
            if (!productName ||
                !productDescription ||
                !productPrice ||
                !productStock ||
                !categoryId) {
                res.status(400).json({
                    message: "Please provide product details.",
                });
                return;
            }
            // Additional validation for price (assuming it should be a number)
            if (isNaN(Number(productPrice))) {
                res.status(400).json({
                    message: "Price should be a valid number.",
                });
                return;
            }
            try {
                // Create a new product in the database
                yield Product_1.default.create({
                    productName,
                    productDescription,
                    productPrice: Number(productPrice), // Convert price to number if needed
                    productStock,
                    productImage: fileName,
                    userId: userId,
                    categoryId: categoryId,
                });
                res.status(200).json({
                    message: "Product Added successfully",
                });
            }
            catch (err) {
                // Handle database errors
                console.error("Error adding product:", err);
                res.status(500).json({
                    message: "Failed to add product. Please try again later.",
                });
            }
        });
    }
    getAllProducts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield Product_1.default.findAll({
                include: [
                    { model: User_1.default, attributes: ["id", "email", "username"] },
                    { model: Category_1.default, attributes: ["categoryName"] },
                ],
            });
            res.status(200).json({
                message: "Products fetched successfully",
                data,
            });
        });
    }
    getSingleProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            // console.log("Requested Id:", id);
            const data = yield Product_1.default.findOne({
                where: {
                    id: id,
                },
                include: [
                    {
                        model: User_1.default,
                        attributes: ["id", "email", "username"],
                    },
                    {
                        model: Category_1.default,
                        attributes: ["id", "categoryName"],
                    },
                ],
            });
            if (!data) {
                res.status(404).json({
                    message: "No product with that id",
                });
            }
            else {
                res.status(200).json({
                    message: "Product fetched successfully",
                    data,
                });
            }
        });
    }
    updateProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { productName } = req.body;
            const data = yield Product_1.default.findOne({
                where: {
                    id: id,
                },
            });
            yield Product_1.default.update({ productName }, {
                where: {
                    id: id,
                },
            });
            res.status(200).json({
                message: "Product updated successfully",
            });
        });
    }
    deleteProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const data = yield Product_1.default.findAll({
                where: {
                    id: id,
                },
            });
            if (data.length > 0) {
                yield Product_1.default.destroy({
                    where: {
                        id: id,
                    },
                });
                res.status(200).json({
                    message: "Product deleted successfully.",
                });
            }
            else {
                res.status(400).json({
                    message: "No product found",
                });
            }
        });
    }
}
exports.default = new ProductController();
