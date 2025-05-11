import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import corsObject from "./schemas/corsObject.js";
import { usersRouter } from "./routes/usersRouter.js";
import { fmoviesRouter } from "./routes/fmoviesRouter.js";
import jwtMiddleware from "./middlewares/cookieMiddleware.js";
import { PORT } from "./config.js";

const app = express();
app.disable("x-powered-by");
app.use(cors(corsObject));
app.use(express.json());
app.use(cookieParser());

app.use("/portal-users", usersRouter);

// app.use(jwtMiddleware);

app.use("/portal-movies", fmoviesRouter);

app.listen(PORT, () => {
  console.log(`server running on http://localhost:${PORT}`);
});