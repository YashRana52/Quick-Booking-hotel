import React, { useState } from "react";
import { assets, cities } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

function HotelReg() {
  const { setShowHotelReg, axios, getToken, setIsOwner } = useAppContext();
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [contact, setContact] = useState("");

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const { data } = await axios.post(
        "/api/hotels",
        { name, contact, address, city },
        {
          headers: { Authorization: `Bearer ${await getToken()}` },
        }
      );
      if (data.success) {
        toast.success(data.message);
        setIsOwner(true);
        setShowHotelReg(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div
      onClick={() => setShowHotelReg(false)}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
    >
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className="flex bg-white rounded-xl shadow-lg max-w-4xl w-full overflow-hidden max-md:mx-4"
      >
        {/* Left Image */}
        <img
          src={assets.regImage}
          alt="register"
          className="w-1/2 object-cover hidden md:block"
        />

        {/* Form Right Side */}
        <div className="relative flex flex-col items-center md:w-1/2 p-6 md:p-10 gap-4 text-gray-800">
          {/* Close Icon */}
          <img
            onClick={() => setShowHotelReg(false)}
            src={assets.closeIcon}
            alt="Close"
            className="absolute top-4 right-4 h-5 w-5 cursor-pointer hover:scale-110 transition"
          />

          <h2 className="text-2xl font-semibold mt-4">Register Your Hotel</h2>

          {/* Hotel Name */}
          <div className="w-full">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-600"
            >
              Hotel Name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              id="name"
              type="text"
              placeholder="Type here"
              className="mt-1 w-full px-3 py-2.5 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {/* Phone */}
          <div className="w-full">
            <label
              htmlFor="contact"
              className="block text-sm font-medium text-gray-600"
            >
              Phone
            </label>
            <input
              onChange={(e) => setContact(e.target.value)}
              value={contact}
              id="contact"
              type="tel"
              placeholder="Type here"
              className="mt-1 w-full px-3 py-2.5 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {/* Address */}
          <div className="w-full">
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-600"
            >
              Address
            </label>
            <input
              onChange={(e) => setAddress(e.target.value)}
              value={address}
              id="address"
              type="text"
              placeholder="Type here"
              className="mt-1 w-full px-3 py-2.5 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {/* City Dropdown */}
          <div className="w-full">
            <label
              htmlFor="city"
              className="block text-sm font-medium text-gray-600"
            >
              City
            </label>
            <select
              onChange={(e) => setCity(e.target.value)}
              value={city}
              id="city"
              className="mt-1 w-full px-3 py-2.5 rounded border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            >
              <option value="">Select City</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          {/* Register Button */}
          <button
            type="submit"
            className="mt-4 w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2.5 rounded font-medium transition duration-300 cursor-pointer"
          >
            Register
          </button>
        </div>
      </form>
    </div>
  );
}

export default HotelReg;
