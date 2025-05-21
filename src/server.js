import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import corsObject from "./schemas/corsObject.js";
import jwtMiddleware from "./middlewares/cookieMiddleware.js";
import { usersRouter } from "./routes/usersRouter.js";
import { fmoviesRouter } from "./routes/fmoviesRouter.js";
import { peliculaRouter } from "./routes/fmoviesRouter.js";
import { PORT } from "./config.js";

const app = express();
app.disable("x-powered-by");
app.use(cors(corsObject));
app.use(express.json());
app.use(cookieParser());

app.use("/", fmoviesRouter)

app.use("/portal-users", usersRouter);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Conexión a la base de datos establecida en MongoDB Atlas'))
  .catch((err) => console.error('Error de conexión a MongoDB:', err))
  
app.use('/api/peliculas', peliculaRouter);

app.use(jwtMiddleware)

app.use("/portal-movies", fmoviesRouter);

app.listen(PORT, () => {
  console.log(`server running on http://localhost:${PORT}`);
});