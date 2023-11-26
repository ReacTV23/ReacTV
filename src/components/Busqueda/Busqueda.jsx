import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MoviesContainer from './MoviesContainer'; // Importa el componente MoviesContainer

const Busqueda = () => {
  const API_URL = process.env.REACT_APP_API_URL_TMDB;
  const API_KEY = process.env.REACT_APP_API_KEY_TMDB;

  //variables de estado
  const [movies, setMovies] = useState([]);
  const [searchKey, setSearchKey]= useState("");
  const [selectedMovie, setSelectedMovie] = useState({});
  const [trailer, setTrailer] = useState(null);
  const [movie, setMovie] = useState( {title: "Loading Movies"});
  const [playing, setPlaying] = useState(false);

  // Esta función es para realizar la petición por get a la API
  const fetchMovies = async (searchKey) => {
    const type = searchKey ? "search" : "discover";
    const {
      data: { results },
    } = await axios.get(`${API_URL}/${type}/movie`, {
      params: {
        api_key: API_KEY,
        query: searchKey,
      },
    });
  
    setMovies(results)
    setMovie(results[0])

    if (results.length) {
      await fetchMovie(results[0].id);
    }
  };

  // Función para la petición de un solo objeto y mostrar en reproductor de video
  const fetchMovie = async(id) => {
    const {data} = await axios.get(`${API_URL}/movie/${id}`, {
      params: {
        api_key: API_KEY,
        append_to_response: "videos"
      }
    });

    if(data.videos && data.videos.results) {
      const trailer = data.videos.results.find(
        (vid) => vid.name === "Official Trailer"
      );
      setTrailer(trailer ? trailer : data.videos.results[0])
    }
    setMovie(data)
  }

  // Función para buscar películas
  const searchMovies = (e) => {
    e.preventDefault();
    fetchMovies(searchKey);
  }

  useEffect(() => {
    fetchMovies(searchKey);
  }, [searchKey]);

  return (
    <div>
      {/* Buscador */}
      <form className='container mb-4' onSubmit={searchMovies}>
        <input type="text" placeholder='search' onChange={(e)=> setSearchKey(e.target.value)}/> 
        <button className='btn btn-primary'>Buscar</button>
      </form>

      {/* Contenedor de películas */}
      <MoviesContainer movies={movies} handleSelectedMovie={fetchMovie} />
    </div>
  );
}

export default Busqueda;