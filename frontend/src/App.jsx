import React from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Movies from "./pages/Movies";
import MovieDetails from "./pages/MovieDetails";
import SeatLayout from "./pages/SeatLayout";
import MyBookings from "./pages/MyBookings";
import { Toaster } from "react-hot-toast";
import Footer from "./components/Footer";
import Favorites from "./pages/Favorites";
import Theatres from "./pages/Theatres";
import TheatreDetails from "./pages/TheatreDetails";
import Layout from "./pages/admin/Layout";
import Dashboard from "./pages/admin/Dashboard";
import ListShows from "./pages/admin/ListShows";
import ListBookings from "./pages/admin/ListBookings";
import ListMovies from "./pages/admin/ListMovies";

import OwnerCinemaHalls from "./pages/owner/CinemaHalls";
import OwnerMovies from "./pages/owner/Movies";
import OwnerShows from "./pages/owner/Shows";
import OwnerBookings from "./pages/owner/Bookings";

import { useAppContext } from "./context/AppContext";
import Loading from "./components/Loading";
import Login from "./pages/Login";
import Register from "./pages/Register";

const App = () => {
  const { pathname } = useLocation();
  const { user } = useAppContext();

  const isAdminRoute = pathname.startsWith("/admin") || pathname.startsWith("/owner");
  const isAuthRoute = pathname === "/login" || pathname === "/register";
  const showLayout = !isAdminRoute && !isAuthRoute;

  return (
    <>
      <Toaster />
      {showLayout && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/movies/:id" element={<MovieDetails />} />
        <Route path="/movies/:id/:date" element={<SeatLayout />} />
        <Route path="/theatres" element={<Theatres />} />
        <Route path="/theatres/:id" element={<TheatreDetails />} />
        <Route path="/my-bookings" element={user ? <MyBookings /> : <Navigate to="/login" />} />
        <Route path="/loading/:nextUrl" element={<Loading />} />
        <Route path="/favorites" element={user ? <Favorites /> : <Navigate to="/login" />} />
        <Route path="/admin/*" element={user && user.role === "admin" ? <Layout /> : <Navigate to="/" />}>
          <Route index element={<Dashboard />} />

          <Route path="list-shows" element={<ListShows />} />
          <Route path="list-bookings" element={<ListBookings />} />
          <Route path="list-movies" element={<ListMovies />} />
        </Route>
        <Route path="/owner/*" element={user && user.role === "cinemaHallOwner" ? <Layout /> : <Navigate to="/" />}>
          <Route index element={<Dashboard />} />
          <Route path="cinema-halls" element={<OwnerCinemaHalls />} />
          <Route path="movies" element={<OwnerMovies />} />
          <Route path="shows" element={<OwnerShows />} />
          <Route path="bookings" element={<OwnerBookings />} />
        </Route>
      </Routes>
      {showLayout && <Footer />}
    </>
  );
};

export default App;