import mysql from "mysql2/promise"
import sesionUsersSchema from "../schemas/usersSchema.js";
import bcrypt from "bcrypt"

const config = {
  host: process.env.DB_HOST,
  user: "root",
  port: process.env.DB_PORT,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
}

const pool = await mysql.createConnection(config)

const { validateSignUpInput } = sesionUsersSchema();

export class usersModel {

  static async getAllUsers() {
    const query = 'SELECT user_id, user_name, user_email, favorites_movies FROM niupi_films_users;'
    const result = await pool.query(query)
    .then(res => res)
    .then(data => {return data})
    return result
  }

  static async getAUser(input) {
    const query = 'SELECT user_id, user_name, user_email, user_password, favorites_movies FROM niupi_films_users WHERE user_email = ?;'
    const user = await pool.query(query, [input.email])
    .then(res => res)
    .then(data => {return data})
    if (user) {
      return user[0][0];
    } else {
      return false;
    }    
  }

  static async checkIfExistsAUser(input) {
    const query = 'SELECT EXISTS(SELECT 1 FROM niupi_films_users WHERE user_email = ?) AS exist;'
    const result = await pool.query(query, [input.email])
    .then(res => res)
    .then(data => {
      const boolean = !!data[0][0].exist
      return boolean
    })
    return result   
  }

  static async createUser(input) {
    try {
      const user = validateSignUpInput(input);
      const { name, email, password } = user.data;
      const hashedPassword = await bcrypt.hash(password, 11);
      const fmovies = JSON.stringify([])
      const query = 'INSERT INTO niupi_films_users (user_name, user_email, user_password, favorites_movies) VALUES (?, ?, ?, ?)'
      const result = await pool.query(query, [name, email, hashedPassword, fmovies])
      .then(res => {
        return res[0];
      });
      return { success: true, message: "User created succesfully", data: {
        name: name,
        email: email,
        favoritesFilms: []   
      }};
    } catch (error) {
      return { success: false, message: "What are you trying?" }
    }    
  }
  
  static async addFavoriteMovie(input) {
    try {
      const userEmail = input.email;
      const favoritesMoviesToUpdate = JSON.stringify(input.favoritesFilms);
      const query = 'UPDATE niupi_films_users SET favorites_movies = ? WHERE user_email = ?'
      const result = await pool.query(query, [favoritesMoviesToUpdate, userEmail])
      .then(res => res)
      .then(data => {
        if (data[0].affectedRows === 1) {
          return true
        } else if (data[0].affectedRows === 0) {
          return false
        }
      })
      if (result) {
        return { success: true, message: "Favorites movies updated succesfully" }
      } else {
        return { success: false, message: "Favorites movies were not updated succesfully" }
      }
    } catch (error) {
      return { success: false, message: "Favorites movies were not updated succesfully" }
    }
  }
}
