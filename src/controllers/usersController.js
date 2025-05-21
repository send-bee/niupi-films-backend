import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { usersModel } from "../models/usersModel.js";
import sesionUsersSchema from "../schemas/usersSchema.js";


const { validateSignInInput, validateSignUpInput } = sesionUsersSchema();

export class usersController {

  static async serverRunning(req, res) {
    res.json({server: "Server running"})
  }

  static async getAllUsers(req, res) {
    try {
      const users = await usersModel.getAllUsers();
      return res.status(200).send({ success: true, data: users[0] });
    } catch (error) {
      return res.status(403).json({ success: false, message: "You do not have autorization" });
    };
  }

  static async createaUser(req, res) {
    const input = validateSignUpInput(req.body);
    if (input.success) {
      const user = await usersModel.checkIfExistsAUser(input.data);
      if (!user) {
        const result = await usersModel.createUser(input.data);
        if (result.success) {
          const payload = {
            email: input.data.email
          };
          const token = jwt.sign(
            payload,
            process.env.SECRET_JWT_KEY,
            { expiresIn: 1000 * 60 * 60 * 15 }
          );
          res.cookie("access_token", token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 15,
            secure: process.env.NODE_ENV === 'production',
            sameSite: "None",
            path: "/"
          });
          res.json({ success: true, message: result.message, data: result.data })
        } else {
          res.json({ success: false, message: result.message }) 
        }
      } else if (user) {
        res.json({ success: false, message: "Already exist an account with this email" });
      }
    } else {
      res.status(400).json({ success: false, message: `error: ${input.error.issues[0].message}` });
    }
  }

  static async createSesion(req, res) {
    const input = validateSignInInput(req.body);
    if (input.success) {
      const user = await usersModel.getAUser(input.data);
      if (user) {
        const validatePassword = bcrypt.compareSync(input.data.password, user.user_password);
        if (validatePassword) {
          const payload = {
            email: user.user_email
          };
          const token = jwt.sign(
            payload,
            process.env.SECRET_JWT_KEY,
            { expiresIn: 1000 * 60 * 60 * 15 }
          );
          res.cookie("access_token", token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 15,
            secure: process.env.NODE_ENV === 'production',
            sameSite: "None",
            path: "/"
          });
          const data = {
            name: user.user_name,
            email: user.user_email,
            favoritesFilms: JSON.parse(user.favorites_movies)
          };
          res.status(200).json({ success: true, message: "sesión created successfully", data: data})
        } else {
          res.json({ success: false, message: "Check your credentials" });
        }
      } else {
        res.json({ success: false, message: "User no found" });
      }
    } else {
      res.status(400).json({ success: false, message: `error: ${input.error.issues[0].message}` });
    }
  }

  static async addFavoriteMovies (req, res) {
    const input = req.body;
    const result = await usersModel.addFavoriteMovie(input)
    if (result.success) {
      res.status(200).json(result)
    } else {
      res.status(400).json(result)
    }
  }
}
