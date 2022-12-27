import React, { useState, useEffect, useCallback } from 'react'
import AddMovie from './components/AddMovie'
import MoviesList from './components/MoviesList'
import './App.css'

function App() {
  const [movies, setMovies] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState(null)

  const fetchMovieHandler = useCallback(async () => {
    setIsLoading(true)
    setErrors(null)
    try {
      const respone = await fetch(
        'https://react-http-demo-7ba4c-default-rtdb.firebaseio.com/movies.json',
      )
      if (!respone.ok) {
        throw new Error('Something went wrong...')
      }
      const moviesData = await respone.json()

      const loadedMovies = []
      for (const key in moviesData) {
        loadedMovies.push({
          id: key,
          title: moviesData[key].title,
          openingText: moviesData[key].openingText,
          releaseDate: moviesData[key].release_date,
        })
      }

      setMovies(loadedMovies)
    } catch (error) {
      setErrors(error.message)
    }
    setIsLoading(false)
  }, [])

  useEffect(() => {
    fetchMovieHandler()
  }, [fetchMovieHandler])

  const onAddMovieHandler = async (movie) => {
    const response = await fetch(
      'https://react-http-demo-7ba4c-default-rtdb.firebaseio.com/movies.json',
      {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify(movie),
      },
    )
    const returnData = await response.json()
    console.log(returnData)
  }
  let content = <p>Movies are not found...</p>

  if (movies.length > 0) {
    content = <MoviesList movies={movies} />
  }

  if (errors) {
    content = <p>{errors}</p>
  }

  if (isLoading) {
    content = <p>Loading...</p>
  }
  return (
    <React.Fragment>
      <section>
        <AddMovie onAddMovie={onAddMovieHandler} />
      </section>
      <section>
        <button onClick={fetchMovieHandler}>Fetch Movies</button>
      </section>
      <section>{content}</section>
    </React.Fragment>
  )
}

export default App
