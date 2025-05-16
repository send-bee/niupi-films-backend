import { Router } from "express";
import { usersController } from "../controllers/usersController.js";
import Pelicula from "../models/pelicula.js"
import {
  getAllPeliculas,
  getPeliculasPorGenero,
  createPelicula,
  deletePelicula,
  getPeliculaPorId,
  buscarPeliculaPorTitulo,
  getPeliculasPorFiltro
} from "../controllers/peliculacontroller.js"

export const fmoviesRouter = Router();

export const peliculaRouter = Router();

fmoviesRouter.get("/", usersController.serverRunning);

fmoviesRouter.post("/update-favorites", usersController.addFavoriteMovies);

// Ruta para buscar películas por título o género usando query params
peliculaRouter.get('/buscar', async (req, res) => {
  try {
    const { titulo, genero } = req.query;
    let filtro = {};
    if (titulo) filtro.titulo = new RegExp(titulo, 'i'); // Buscar por título con expresión regular
    if (genero) filtro.genero = new RegExp(genero, 'i'); // Buscar por género con expresión regular
    const peliculas = await Pelicula.find(filtro);
    res.json(peliculas);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al buscar películas" });
  }
});

// Otras rutas
peliculaRouter.get('/', getAllPeliculas); // Obtener todas las películas
peliculaRouter.get('/genero/:genre', getPeliculasPorGenero); // Obtener películas por género
peliculaRouter.get('/filtro', getPeliculasPorFiltro); // Obtener películas con filtros como género, año, rating, etc.
peliculaRouter.get('/:id', getPeliculaPorId); // Obtener una película por su ID
peliculaRouter.post('/', createPelicula); // Crear una nueva película
peliculaRouter.delete('/:id', deletePelicula); // Eliminar una película por su ID
