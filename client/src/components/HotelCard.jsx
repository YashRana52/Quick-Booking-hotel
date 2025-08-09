import React from "react";
import { Link } from "react-router-dom";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";

function HotelCard({ room, index }) {
  const { currency } = useAppContext();
  return (
    <Link
      to={`/rooms/${room._id}`}
      onClick={() => window.scrollTo(0, 0)}
      key={room._id}
      className="block rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-shadow relative bg-white"
    >
      <img
        src={room.images[0]}
        alt="Room"
        className="w-full h-52 object-cover"
      />

      {index % 2 === 0 && (
        <p className="absolute top-3 left-3 bg-white text-gray-800 text-xs px-3 py-1 rounded-full font-medium shadow">
          Best Seller
        </p>
      )}

      <div className="p-4">
        <div className="flex items-center justify-between">
          <p className="font-playfair text-lg font-semibold text-gray-800">
            {room.hotel?.name}
          </p>
          <div className="flex items-center gap-1 text-sm text-yellow-600 font-medium">
            <img src={assets.starIconFilled} alt="Star" className="w-4 h-4" />
            4.5
          </div>
        </div>

        <div className="flex items-center gap-2 text-gray-600 text-sm mt-3">
          <img src={assets.locationIcon} alt="Location" className="w-4 h-4" />
          <span>{room.hotel?.address}</span>
        </div>

        <div className="flex items-center justify-between mt-5">
          <p className="text-gray-800">
            <span className="text-xl font-semibold ">
              {currency} {room?.pricePerNight}
            </span>{" "}
            /night
          </p>
          <button className="px-4 py-2 text-sm font-medium border border-gray-300 rounded hover:bg-gray-100 transition">
            Book Now
          </button>
        </div>
      </div>
    </Link>
  );
}

export default HotelCard;
