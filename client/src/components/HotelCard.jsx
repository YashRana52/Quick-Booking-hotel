import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";

function HotelCard({ room, index }) {
  const { currency } = useAppContext();
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(cardRef.current); // unobserve after visible
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) observer.unobserve(cardRef.current);
    };
  }, []);

  return (
    <Link
      to={`/rooms/${room._id}`}
      onClick={() => window.scrollTo(0, 0)}
      key={room._id}
      ref={cardRef}
      className={`
        block rounded-2xl overflow-hidden shadow-md relative
        bg-white dark:bg-gradient-to-br dark:from-gray-800 dark:via-gray-900 dark:to-gray-800
        transition-shadow duration-500 ease-in-out
        ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}
      `}
      style={{ transitionProperty: "opacity, transform" }}
    >
      <img
        src={room.images[0]}
        alt="Room"
        className="w-full h-52 object-cover transition-transform duration-300 ease-in-out"
      />

      {index % 2 === 0 && (
        <p
          className="absolute top-3 left-3 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200
                      text-xs px-3 py-1 rounded-full font-medium shadow transition-colors duration-300"
        >
          Best Seller
        </p>
      )}

      <div className="p-4">
        <div className="flex items-center justify-between">
          <p className="font-playfair text-lg font-semibold text-gray-800 dark:text-gray-200">
            {room.hotel?.name}
          </p>
          <div className="flex items-center gap-1 text-sm text-yellow-500 dark:text-yellow-400 font-medium">
            <img src={assets.starIconFilled} alt="Star" className="w-4 h-4" />
            4.5
          </div>
        </div>

        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm mt-3">
          <img src={assets.locationIcon} alt="Location" className="w-4 h-4" />
          <span>{room.hotel?.address}</span>
        </div>

        <div className="flex items-center justify-between mt-5">
          <p className="text-gray-800 dark:text-gray-200">
            <span className="text-xl font-semibold ">
              {currency} {room?.pricePerNight}
            </span>{" "}
            /night
          </p>
          <button
            className="px-5 py-2 text-sm font-semibold rounded-md 
                       bg-blue-600 text-white hover:bg-blue-700 
                       dark:bg-blue-500 dark:hover:bg-blue-600
                       transition-colors duration-300 shadow-md dark:shadow-lg"
          >
            Book Now
          </button>
        </div>
      </div>
    </Link>
  );
}

export default HotelCard;
