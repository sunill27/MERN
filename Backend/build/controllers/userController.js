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
const User_1 = __importDefault(require("../database/models/User"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class AuthController {
    static registerUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { username, email, password, role } = req.body;
            if (!username || !email || !password) {
                res.status(400).json({
                    message: "Please provide username, email, password",
                });
                return;
            }
            yield User_1.default.create({
                username,
                email,
                password: bcrypt_1.default.hashSync(password, 8),
                role: role,
            });
            res.status(200).json({
                message: "User registered successfully",
            });
        });
    }
    static loginUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            //User input
            const { email, password } = req.body;
            if (!email || !password) {
                res.status(400).json({
                    message: "Please provide email and password.",
                });
                return;
            }
            //Check whether user with above email exist or not.
            const data = yield User_1.default.findOne({
                //'findAll()' gives data in array while 'findByPk' gives in object.
                where: {
                    email: email,
                },
            });
            if (!data) {
                res.status(404).json({
                    message: "No user found with that email",
                });
                return;
            }
            //Check password now:
            const isMatched = bcrypt_1.default.compareSync(password, data.password);
            if (!isMatched) {
                res.status(403).json({
                    message: "Invalid password",
                });
                return;
            }
            //Generate token and send to user:
            const token = jsonwebtoken_1.default.sign({
                id: data.id,
            }, process.env.SECRET_KEY, //password
            {
                expiresIn: "20d",
            });
            res.status(200).json({
                message: "Logged in successfully",
                data: token,
            });
        });
    }
    //To fetch users:
    static fetchUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield User_1.default.findAll();
            if (users.length > 0) {
                res.status(200).json({
                    message: "Users fetched successfully",
                    data: users,
                });
            }
            else {
                res.status(404).json({
                    message: "No users registered yet",
                    data: [],
                });
            }
        });
    }
    //To Delete User:
    static deleteUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const users = yield User_1.default.destroy({
                where: {
                    id,
                },
            });
            res.status(404).json({
                message: "User deleted successfully",
                data: [],
            });
        });
    }
}
exports.default = AuthController;
