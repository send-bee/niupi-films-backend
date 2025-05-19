import Pelicula from "../models/pelicula.js"

export const getAllPeliculas = async (req, res) => {
  try {
    const peliculas = await Pelicula.find();
    res.json(peliculas);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener las películas', error });
  }
};

export const getPeliculasPorGenero = async (req, res) => {
  try {
    const genre = req.params.genre;
    const peliculas = await Pelicula.find({ genero: { $regex: genre, $options: 'i' } });
    res.json(peliculas);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener películas por género', error });
  }
};

export const createPelicula = async (req, res) => {
  try {
    const nueva = new Pelicula(req.body);
    await nueva.save();
    res.status(201).json(nueva);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al crear la película', error });
  }
};

export const deletePelicula = async (req, res) => {
  try {
    await Pelicula.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar la película', error });
  }
};

export const getPeliculaPorId = async (req, res) => {
  try {
    const pelicula = await Pelicula.findById(req.params.id);
    if (!pelicula) {
      return res.status(404).json({ mensaje: 'Película no encontrada' });
    }
    res.json(pelicula);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener la película', error });
  }
};

export const getPeliculasPorIds = async (req, res) => {
  try {
    const ids = req.body.favoritesFilms
    const peliculas = await Pelicula.find({
      _id: { $in: ids}
    });
    
    if (!peliculas) {
      return res.status(404).json({ mensaje: 'Película no encontrada' });
    }
    res.json(peliculas);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener la película', error });
  }
};

export const buscarPeliculaPorTitulo = async (req, res) => {
  const titulo = req.query.titulo;
  try {
    const resultados = await Pelicula.find({
      titulo: { $regex: titulo, $options: 'i' }
    });
    res.json(resultados);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al buscar la película', error });
  }
};

export const getPeliculasPorFiltro = async (req, res) => {
  try {

    const { genero, anio, rating, director } = req.query;

    let filtro = {};

    if (genero) filtro.genero = genero;
    if (anio) filtro.anio = anio;
    if (rating) filtro.rating = { $gte: rating };
    if (director) filtro.director = director;

    const peliculas = await Pelicula.find(filtro);

    if (peliculas.length === 0) {
      return res.status(404).json({ mensaje: 'No se encontraron películas que coincidan con los filtros' });
    }

    res.json(peliculas);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al filtrar las películas', error });
  }
};
