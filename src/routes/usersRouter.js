import { Router } from "express";
import { usersController } from "../controllers/usersController.js";


export const usersRouter = Router();

usersRouter.get("/get-users", usersController.getAllUsers);

usersRouter.post("/create-account", usersController.createaUser);

usersRouter.post("/create-session", usersController.createSesion);

