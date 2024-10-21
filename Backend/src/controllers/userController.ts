import { Request, Response } from "express";
import User from "../database/models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Payment from "../database/models/Payment";
import { AuthRequest } from "../middleware/authMiddleware";
import Order from "../database/models/Order";

class AuthController {
  public static async registerUser(req: Request, res: Response): Promise<void> {
    const { username, email, password, role } = req.body;
    if (!username || !email || !password) {
      res.status(400).json({
        message: "Please provide username, email, password",
      });
      return;
    }
    await User.create({
      username,
      email,
      password: bcrypt.hashSync(password, 8),
      role: role,
    });

    res.status(200).json({
      message: "User registered successfully",
    });
  }

  public static async loginUser(req: Request, res: Response): Promise<void> {
    //User input
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({
        message: "Please provide email and password.",
      });
      return;
    }

    //Check whether user with above email exist or not.
    const data = await User.findOne({
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
    const isMatched = bcrypt.compareSync(password, data.password);
    if (!isMatched) {
      res.status(403).json({
        message: "Invalid password",
      });
      return;
    }
    //Generate token and send to user:
    const token = jwt.sign(
      {
        id: data.id,
      },
      process.env.SECRET_KEY as string, //password
      {
        expiresIn: "20d",
      }
    );
    res.status(200).json({
      message: "Logged in successfully",
      data: token,
    });
  }

  //To fetch users:
  public static async fetchUsers(
    req: AuthRequest,
    res: Response
  ): Promise<void> {
    const users = await User.findAll();

    if (users.length > 0) {
      res.status(200).json({
        message: "Users fetched successfully",
        data: users,
      });
    } else {
      res.status(404).json({
        message: "No users registered yet",
        data: [],
      });
    }
  }

  //To Delete User:
  public static async deleteUser(
    req: AuthRequest,
    res: Response
  ): Promise<void> {
    const id = req.params.id;
    const users = await User.destroy({
      where: {
        id,
      },
    });

    res.status(404).json({
      message: "User deleted successfully",
      data: [],
    });
  }
}
export default AuthController;
