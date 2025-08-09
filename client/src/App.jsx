import React from "react";
import Navbar from "./components/Navbar";
import { Route, Routes, useLocation } from "react-router-dom";
import Hero from "./components/Hero";
import Home from "./pages/Home";
import AllRooms from "./pages/AllRooms";
import RoomDetails from "./pages/RoomDetails";
import MyBookings from "./pages/MyBookings";
import HotelReg from "./components/HotelReg";
import Layout from "./pages/HotelOwner/Layout";
import DashBoard from "./components/HotelOwner/DashBoard";
import ListRoom from "./pages/HotelOwner/ListRoom";
import AddRoom from "./pages/HotelOwner/AddRoom";
import { Toaster } from "react-hot-toast";
import { useAppContext } from "./context/AppContext";

function App() {
  const isOwnerPath = useLocation().pathname.includes("owner");
  const { showHotelReg } = useAppContext();

  return (
    <div>
      <Toaster />
      {!isOwnerPath && <Navbar />}
      {showHotelReg && <HotelReg />}
      <div className="min-h-[70vh]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rooms" element={<AllRooms />} />
          <Route path="/rooms/:id" element={<RoomDetails />} />
          <Route path="/my-bookings" element={<MyBookings />} />

          <Route path="/owner" element={<Layout />}>
            <Route index element={<DashBoard />} />
            <Route path="/owner/list-room" element={<ListRoom />} />
            <Route path="/owner/add-room" element={<AddRoom />} />
          </Route>
        </Routes>
      </div>
    </div>
  );
}

export default App;
