import React from "react";
import Navbar from "./components/Navbar";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import AllRooms from "./pages/AllRooms";
import Footer from "./components/Footer";
import RoomDetails from "./pages/RoomDetails";
import MyBookings from "./pages/MyBookings";
import HotelReg from "./components/HotelReg";
import Layout from "./pages/hotelOwner/Layout";
import Dashboard from "./pages/hotelOwner/Dashboard";
import AddRoom from "./pages/hotelOwner/AddRoom";
import ListRoom from "./pages/hotelOwner/ListRoom";
import { Toaster } from "react-hot-toast";
import { useAppContext } from "./context/AppContext";
import Loader from "./components/Loader";
import Messages from "./pages/hotelOwner/Messages";
import ErrorBoundary from "./components/ErrorBoundary";

const App = () => {
  const isOwnerPath = useLocation().pathname.includes("owner");
  const { showHotelReg } = useAppContext();

  return (
    <ErrorBoundary>
      <div>
        {!isOwnerPath && <Navbar />}
        {showHotelReg && <HotelReg />}
        <Toaster />
        {false && <HotelReg />}
        <div className="min-h-[70vh]">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/rooms" element={<AllRooms />} />
            <Route path="/rooms/:id" element={<RoomDetails />} />
            <Route path="/my-bookings" element={<MyBookings />} />
            <Route path="/loader/:nextUrl" element={<Loader />} />

            <Route path="/owner" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="add-room" element={<AddRoom />} />
              <Route path="list-room" element={<ListRoom />} />
              <Route path="messages" element={<Messages />} />
            </Route>
          </Routes>
        </div>
        {/*<Footer />*/}
      </div>
    </ErrorBoundary>
  );
};

export default App;
