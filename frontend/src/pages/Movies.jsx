import React from 'react'
import MovieCard from '../components/MovieCard'
import BlurCircle from '../components/BlurCircle'
import { useAppContext } from '../context/AppContext'
import { useEffect } from 'react';

const Movies = () => {

  const { shows, fetchShows } = useAppContext();
  
  useEffect(() => {
    fetchShows();
  }, []);
  
  return shows.length > 0 ? (
    <div className='relative my-40 mb-60 px-6 md:px-16 lg:px-40 xl:px-44 overflow-hidden min-h-[80vh]'>

      <BlurCircle top='150px' left='0px'/>
      <BlurCircle bottom='50px' right='50px'/>
      <h1 className='text-xl text-primary font-medium my-4'>Now Showing</h1>
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 justify-items-center'>
        {shows.map((movie)=> (
          <MovieCard movie={movie} key={movie.id || movie._id}/>
        ))}
      </div>
    </div>
  ) : (
    <div className='flex flex-col items-center justify-center h-screen'>
      <h1 className='text-3xl font-bold text-center text-primary'>No Movies Available</h1>
    </div>
  )
}

export default Movies