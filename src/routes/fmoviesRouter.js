import { Router } from "express";
import { usersController } from "../controllers/usersController.js";

export const fmoviesRouter = Router();

fmoviesRouter.get("/", usersController.serverRunning);

fmoviesRouter.post("/update-favorites", usersController.addFavoriteMovies);