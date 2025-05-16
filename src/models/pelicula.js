import mongoose from "mongoose";

const peliculaSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  anio: { type: Number, required: true },
  genero: { type: String, required: true },
});

const Pelicula = mongoose.model('Pelicula', peliculaSchema);

export default Pelicula;
