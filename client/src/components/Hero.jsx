import React, { useState } from "react";
import { assets, cities } from "../assets/assets";
import { useAppContext } from "../context/AppContext";

function Hero() {
  const [destination, setDestination] = useState("");
  const { navigate, axios, getToken, setSearchCities } = useAppContext();

  const onSearch = async (e) => {
    e.preventDefault();

    try {
      // Call API to save recent search
      await axios.post(
        "/api/user/store-recent-search",
        { recentSearchedCities: destination },
        {
          headers: { Authorization: `Bearer ${await getToken()}` },
          withCredentials: true,
        }
      );

      // Update recent searched cities (safe lowercasing)
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

      // Navigate after saving search
      navigate(`/rooms?destination=${destination}`);
    } catch (error) {
      console.error("Failed to store recent search:", error);
    }
  };

  return (
    <div className='flex flex-col items-center justify-center px-6 md:px-16 lg:px-24 xl:px-32 text-white bg-[url("/src/assets/heroImage.png")] bg-cover bg-center bg-no-repeat h-screen'>
      <p className="bg-[#49B9FF]/50 px-3.5 py-1 rounded-full mt-20">
        Your Dream Stay Awaits ✨
      </p>
      <h1 className="font-playfair text-2xl md:text-5xl md:text-[56px] md:leading-[56px] font-bold md:font-extrabold max-w-xl mt-4">
        Experience Luxury and Comfort Like Never Before
      </h1>
      <p className="max-w-130 mt-2 text-sm md:text-base">
        Escape to breathtaking destinations with top-class hospitality. Book
        your perfect getaway now!
      </p>

      <form
        onSubmit={onSearch}
        className="bg-white text-gray-500 rounded-lg px-6 py-4 flex flex-col md:flex-row max-md:items-start gap-4 mt-8 max-md:mx-auto"
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
            className="rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none"
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
            className="rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none"
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
            className="rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none"
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
            className="rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none max-w-16"
            placeholder="0"
          />
        </div>

        {/* Search Button */}
        <button className="flex items-center justify-center gap-1 rounded-md bg-black py-3 px-4 text-white my-auto cursor-pointer max-md:w-full max-md:py-1">
          <img src={assets.searchIcon} alt="search-icon" className="h-4" />
          <span>Search</span>
        </button>
      </form>
    </div>
  );
}

export default Hero;
