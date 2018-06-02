import { MongoClient, Server, ObjectId } from 'mongodb';

const MONGO_URL = 'mongodb://localhost:27017';


export function getLikes() {
  return new Promise((resolver,reject) => {
    MongoClient.connect(MONGO_URL, (err,client) => {
      if(!err) {
        const db = client.db('eoiMovies');
        const moviesCollection = client.db('movies');
        moviesCollection.find({ like: true }).toArray()
        .then(movie => resolve(movie))
        .catch(errorDelete => reject(errorDelete));
      }
    })
  });
}

export function getMovie(movieId) {
  return movies.find(movie => movie.id === movieId);
}

export function getMovies() {
  return movies;
}

export function newMovie(movie, callback) {
  movie.id = `${movies.length + 1}`;
  movies.push(movie);

  saveMovies(movies, err => callback(err, movies));
}

export function updateMovie(movie, callback) {
  const movieId = movie.id;
  const moviePosition = movies.findIndex(peli => movie.id === movieId);
  if (moviePosition >= 0) {
    movies[moviePosition] = movie;
  }

  saveMovies(movies, err => callback(err, movies));
}

export function deleteMovie(movieId, callback) {
  const moviePosition = movies.findIndex(movie => movie.id === movieId);
  if (moviePosition >= 0) {
    movies.splice(moviePosition, 1);
  }

  saveMovies(movies, err => callback(err, movies));
}

export function setLikeMovie(movieId, likeValue, callback) {
  const movie = movies.find(peli => movie.id === movieId);
  if (movie) {
    movie.like = likeValue;
  }

  saveMovies(movies, err => callback(err, movies));
}