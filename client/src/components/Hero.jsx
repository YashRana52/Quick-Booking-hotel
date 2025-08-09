import React, { useState, useEffect } from "react";
import { assets, cities } from "../assets/assets";
import { useAppContext } from "../context/AppContext";

function Hero() {
  const [destination, setDestination] = useState("");
  const { navigate, axios, getToken, setSearchCities } = useAppContext();

  const bgImages = [assets.hotel3, assets.hotel5, assets.hotel4];
  const [currentIndex, setCurrentIndex] = useState(0);

  // Background image index har 3 second me change karo
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % bgImages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [bgImages.length]);

  const onSearch = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "/api/user/store-recent-search",
        { recentSearchedCities: destination },
        {
          headers: { Authorization: `Bearer ${await getToken()}` },
        }
      );

      setSearchCities((prev) => {
        const safeDestination = (destination || "").toLowerCase();
        const updated = [
          ...(Array.isArray(prev)
            ? prev.filter((c) => (c || "").toLowerCase() !== safeDestination)
            : []),
          destination,
        ];
        if (updated.length > 3) updated.shift();
        return updated;
      });

      navigate(`/rooms?destination=${destination}`);
    } catch (error) {
      console.error("Failed to store recent search:", error);
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-center px-6 md:px-16 lg:px-24 xl:px-32 text-white
                 bg-cover bg-center bg-no-repeat h-screen transition-background duration-1000 ease-in-out"
      style={{
        backgroundImage: `url(${bgImages[currentIndex]})`,
        transitionProperty: "background-image",
        transitionDuration: "1.5s",
        transitionTimingFunction: "ease-in-out",
      }}
    >
      <p className="bg-[#49B9FF]/50 px-3.5 py-1 rounded-full mt-20">
        Your Dream Stay Awaits ✨
      </p>
      <h1 className="font-playfair text-2xl md:text-5xl md:text-[56px] md:leading-[56px] font-bold md:font-extrabold max-w-xl mt-4">
        Where Every Stay Feels Like Home”
      </h1>
      <p className="max-w-130 mt-2 text-sm md:text-base">
        Journey to stunning locations with unmatched comfort and service. Secure
        your dream vacation today!
      </p>

      <form
        onSubmit={onSearch}
        className="bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 rounded-lg px-6 py-4
                   flex flex-col md:flex-row max-md:items-start gap-4 mt-8 max-md:mx-auto"
      >
        {/* Destination Input */}
        <div>
          <div className="flex items-center gap-2">
            <img src={assets.calenderIcon} alt="" className="h-4" />
            <label htmlFor="destinationInput">Destination</label>
          </div>
          <input
            onChange={(e) => setDestination(e.target.value)}
            value={destination}
            list="destinations"
            id="destinationInput"
            type="text"
            className="rounded border border-gray-300 dark:border-gray-700 px-3 py-1.5 mt-1.5 text-sm outline-none
                       bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            placeholder="Type here"
            required
          />
          <datalist id="destinations">
            {cities.map((city, index) => (
              <option value={city} key={index} />
            ))}
          </datalist>
        </div>

        {/* Check-in */}
        <div>
          <div className="flex items-center gap-2">
            <img src={assets.calenderIcon} alt="" className="h-4" />
            <label htmlFor="checkIn">Check in</label>
          </div>
          <input
            id="checkIn"
            type="date"
            className="rounded border border-gray-300 dark:border-gray-700 px-3 py-1.5 mt-1.5 text-sm outline-none
                       bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />
        </div>

        {/* Check-out */}
        <div>
          <div className="flex items-center gap-2">
            <img src={assets.calenderIcon} alt="" className="h-4" />
            <label htmlFor="checkOut">Check out</label>
          </div>
          <input
            id="checkOut"
            type="date"
            className="rounded border border-gray-300 dark:border-gray-700 px-3 py-1.5 mt-1.5 text-sm outline-none
                       bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />
        </div>

        {/* Guests */}
        <div className="flex md:flex-col max-md:gap-2 max-md:items-center">
          <label htmlFor="guests">Guests</label>
          <input
            min={1}
            max={4}
            id="guests"
            type="number"
            className="rounded border border-gray-300 dark:border-gray-700 px-3 py-1.5 mt-1.5 text-sm outline-none max-w-16
                       bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            placeholder="0"
          />
        </div>

        {/* Search Button */}
        <button
          type="submit"
          className="flex items-center justify-center gap-1 rounded-md bg-black dark:bg-gray-700 py-3 px-4
                     text-white my-auto cursor-pointer max-md:w-full max-md:py-1 hover:bg-gray-800 dark:hover:bg-gray-600 transition"
        >
          <img src={assets.searchIcon} alt="search-icon" className="h-4" />
          <span>Search</span>
        </button>
      </form>
    </div>
  );
}

export default Hero;
