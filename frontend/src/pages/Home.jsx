import React, { useEffect } from 'react'
import HeroSection from '../components/HeroSection'
import FeaturedSection from '../components/FeaturedSection'
import TrailerSection from '../components/TrailerSection'
import { useAppContext } from '../context/AppContext'

const Home = () => {
  const { fetchShows } = useAppContext()

  useEffect(() => {
    fetchShows()
  }, [])

  return (
    <>
      <HeroSection/>
      <FeaturedSection/>
      <TrailerSection/>
    </>
  )
}

export default Home