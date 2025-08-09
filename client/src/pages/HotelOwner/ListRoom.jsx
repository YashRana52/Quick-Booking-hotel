import React, { useEffect, useState } from "react";

import Title from "../../components/Title";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

function ListRoom() {
  const { axios, getToken, user, currency } = useAppContext();
  const [rooms, setRooms] = useState([]);

  //fetch rooms for hotel owner

  const fetchRoom = async () => {
    try {
      const { data } = await axios.get("/api/rooms/owner", {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });
      if (data.success) {
        setRooms(data.rooms);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  //toggle awailability of room

  const toggleRoom = async (roomId) => {
    try {
      const { data } = await axios.post(
        "/api/rooms/toggle-availability",
        { roomId },
        {
          headers: { Authorization: `Bearer ${await getToken()}` },
        }
      );

      if (data.success) {
        toast.success(data.message);
        fetchRoom();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (user) {
      fetchRoom();
    }
  }, [user]);

  return (
    <div className="h-screen overflow-y-auto px-4 sm:px-6 lg:px-12 py-10 max-w-7xl mx-auto text-gray-800 ">
      <Title
        align="left"
        font="outfit"
        title="Room Listings"
        subTitle="View, edit, or manage all listed rooms. Keep the information up-to-date to provide the best experience for users."
      />

      <p className="text-lg font-semibold mt-8 mb-4">All Rooms</p>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto  bg-white rounded-xl border border-gray-200 shadow-md ">
        <table className="min-w-[600px] w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs tracking-wide">
            <tr>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Facility</th>
              <th className="py-3 px-4">Price / Night</th>
              <th className="py-3 px-4 text-center">Available</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {rooms.map((item, index) => (
              <tr
                key={index}
                className="border-t border-gray-100 hover:bg-gray-50 transition"
              >
                <td className="py-3 px-4 font-medium">{item.roomType}</td>
                <td className="py-3 px-4">
                  <div className="flex flex-wrap gap-1">
                    {item.amenities.map((amenity, i) => (
                      <span
                        key={i}
                        className="bg-gray-200 text-gray-800 text-xs px-2 py-0.5 rounded-full"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="py-3 px-4 font-semibold text-green-600">
                  {currency}
                  {item.pricePerNight}
                </td>
                <td className="py-3 px-4 text-center">
                  <label className="relative inline-flex items-center cursor-pointer text-gray-900 gap-3">
                    <input
                      onChange={() => toggleRoom(item._id)}
                      type="checkbox"
                      className="sr-only peer"
                      checked={item.isAvailable}
                      readOnly
                    />
                    <div className="w-12 h-7 bg-slate-300 rounded-full peer-checked:bg-blue-600 transition-colors duration-200"></div>
                    <span className="dot absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-5"></span>
                  </label>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-6 mt-6">
        {rooms.map((room, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-md border border-gray-200 p-4"
          >
            <div className="flex justify-between items-start">
              <h3 className="text-base font-semibold text-blue-600">
                {room.roomType}
              </h3>
              <label className="relative inline-flex items-center cursor-pointer text-gray-900 gap-3">
                <input
                  onChange={() => toggleRoom(room._id)}
                  type="checkbox"
                  className="sr-only peer"
                  checked={room.isAvailable}
                  readOnly
                />
                <div className="w-12 h-7 bg-slate-300 rounded-full peer-checked:bg-blue-600 transition-colors duration-200"></div>
                <span className="dot absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-5"></span>
              </label>
            </div>
            <div className="mt-2">
              <p className="text-sm text-gray-500 mb-1">Amenities:</p>
              <div className="flex flex-wrap gap-1">
                {room.amenities.map((a, i) => (
                  <span
                    key={i}
                    className="bg-gray-200 text-gray-800 text-xs px-2 py-0.5 rounded-full"
                  >
                    {a}
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-3">
              <p className="text-sm font-medium">
                Price:{" "}
                <span className="text-green-600 font-semibold">
                  {currency}
                  {room.pricePerNight}
                </span>{" "}
                / night
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ListRoom;
