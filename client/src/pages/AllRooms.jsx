import React, { useMemo, useState } from "react";
import { assets, facilityIcons } from "../assets/assets";
import { useSearchParams } from "react-router-dom";
import StarRating from "../components/StarRating";
import { useAppContext } from "../context/AppContext";

const CheckBox = ({ label, selected = false, onChange = () => {} }) => {
  return (
    <label className="flex gap-3 items-center cursor-pointer mt-2 text-sm text-gray-700 dark:text-gray-300">
      <input
        type="checkbox"
        checked={selected}
        onChange={(e) => onChange(e.target.checked, label)}
        className="cursor-pointer"
      />
      <span className="font-light select-none">{label}</span>
    </label>
  );
};

const RadioButton = ({ label, selected = false, onChange = () => {} }) => {
  return (
    <label className="flex gap-3 items-center cursor-pointer mt-2 text-sm text-gray-700 dark:text-gray-300">
      <input
        type="radio"
        name="sortOptions"
        checked={selected}
        onChange={() => onChange(label)}
        className="cursor-pointer"
      />
      <span className="font-light select-none">{label}</span>
    </label>
  );
};

function AllRooms() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { rooms, navigate, currency } = useAppContext();

  const [selectedFilters, setSelectedFilters] = useState({
    roomType: [],
    priceRange: [],
  });

  const [selectedSort, setSelectedSort] = useState("");

  const roomTypes = ["Single Bed", "Double Bed", "Luxury Room", "Family Suite"];

  const priceRange = [
    "0 to 500",
    "500 to 1000",
    "1000 to 2000",
    "2000 to 3000",
  ];

  const sortOptions = [
    "Price Low to High",
    "Price High to Low",
    "Newest First",
  ];

  const [openFilters, setOpenFilters] = useState(false);

  // Handle filter change
  const handleFilterChange = (checked, value, type) => {
    setSelectedFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters };
      if (checked) {
        updatedFilters[type] = [...updatedFilters[type], value];
      } else {
        updatedFilters[type] = updatedFilters[type].filter(
          (item) => item !== value
        );
      }
      return updatedFilters;
    });
  };

  const handleSortChange = (option) => {
    setSelectedSort(option);
  };

  // Check if a room matches the selected room types
  const matchesRoomType = (room) => {
    return (
      selectedFilters.roomType.length === 0 ||
      selectedFilters.roomType.includes(room.roomType)
    );
  };

  // Check if a room matches the selected price ranges
  const matchPriceRange = (room) => {
    return (
      selectedFilters.priceRange.length === 0 ||
      selectedFilters.priceRange.some((range) => {
        const [min, max] = range.replace(/\s/g, "").split("to").map(Number);
        return room.pricePerNight >= min && room.pricePerNight <= max;
      })
    );
  };

  // Sort rooms
  const sortRooms = (a, b) => {
    const sortKey = selectedSort.trim().toLowerCase();
    if (sortKey === "price low to high") {
      return a.pricePerNight - b.pricePerNight;
    }
    if (sortKey === "price high to low") {
      return b.pricePerNight - a.pricePerNight;
    }
    if (sortKey === "newest first") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    return 0;
  };

  // Filter by destination from search params
  const filterDestination = (room) => {
    const destination = searchParams.get("destination");
    if (!destination) return true;
    return room.hotel?.city.toLowerCase().includes(destination.toLowerCase());
  };

  // Filter and sort rooms
  const filteredRooms = useMemo(() => {
    return rooms
      .filter(
        (room) =>
          matchesRoomType(room) &&
          matchPriceRange(room) &&
          filterDestination(room)
      )
      .sort(sortRooms);
  }, [rooms, selectedFilters, selectedSort, searchParams]);

  // Clear all filters
  const clearFilter = () => {
    setSelectedFilters({
      roomType: [],
      priceRange: [],
    });
    setSelectedSort("");
    setSearchParams({});
  };

  return (
    <div className="flex flex-col-reverse lg:flex-row items-start justify-between pt-28 md:pt-35 px-4 md:px-16 lg:px-24 xl:px-32 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Left side - Room List */}
      <div>
        <div className="flex flex-col items-start text-left">
          <h1 className="font-playfair text-4xl md:text-[40px]">Hotel Rooms</h1>
          <p className="text-sm md:text-base text-gray-500/90 dark:text-gray-400 mt-2">
            Take advantage of our limited-time offers and special packages to
            enhance your stay and create unforgettable memories.
          </p>
        </div>
        {filteredRooms?.map((room) => (
          <div
            key={room._id}
            className="flex flex-col md:flex-row items-start py-10 gap-6 border-b border-gray-300 dark:border-gray-700 last:pb-30 last:border-0"
          >
            <img
              onClick={() => {
                navigate(`/rooms/${room._id}`);
                scrollTo(0, 0);
              }}
              src={room?.images[0]}
              alt="Room"
              title="View Room Details"
              className="max-h-65 md:w-1/2 rounded-xl shadow-lg object-cover cursor-pointer"
            />
            <div className="md:w-1/2 flex flex-col gap-2">
              <p className="text-gray-500 dark:text-gray-400">
                {room.hotel?.city}
              </p>
              <p
                onClick={() => {
                  navigate(`/rooms/${room._id}`);
                  scrollTo(0, 0);
                }}
                className="text-gray-900 dark:text-gray-100 text-3xl font-playfair cursor-pointer"
              >
                {room.hotel?.name}
              </p>
              <div className="flex items-center">
                <StarRating />
                <p className="ml-2 text-gray-700 dark:text-gray-300">
                  100+ reviews
                </p>
              </div>
              <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 mt-2 text-sm">
                <img src={assets?.locationIcon} alt="" />
                <span>{room.hotel?.address}</span>
              </div>

              {/* Amenities */}
              <div className="flex flex-wrap items-center mt-3 mb-6 gap-4">
                {room.amenities.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#F5F5FF]/70 dark:bg-gray-800"
                  >
                    <img
                      src={facilityIcons[item]}
                      alt={item}
                      className="w-5 h-5"
                    />
                    <p className="text-xs text-gray-900 dark:text-gray-100">
                      {item}
                    </p>
                  </div>
                ))}
              </div>

              {/* Price */}
              <p className="text-xl font-medium text-gray-700 dark:text-gray-300">
                {currency} {room?.pricePerNight} /night
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 w-80 border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 max-lg:mb-8 min-lg:mt-16 rounded-md shadow-sm">
        <div
          className={`flex items-center justify-between px-5 py-2.5 min-lg:border-b border-gray-300 dark:border-gray-700 ${
            openFilters && "border-b"
          }`}
        >
          <p className="text-base font-medium text-gray-800 dark:text-gray-100">
            FILTER
          </p>
          <div className="text-xs cursor-pointer flex gap-3">
            <span
              onClick={() => setOpenFilters(!openFilters)}
              className="lg:hidden text-gray-800 dark:text-gray-100"
            >
              {openFilters ? "HIDE" : "SHOW"}
            </span>
            <span
              onClick={clearFilter}
              className="hidden lg:block text-gray-800 dark:text-gray-100 cursor-pointer"
            >
              CLEAR
            </span>
          </div>
        </div>

        <div
          className={`${
            openFilters ? "h-auto" : "h-0 lg:h-auto"
          } overflow-hidden transition-all duration-700`}
        >
          {/* Room Type */}
          <div className="px-5 pt-5">
            <p className="font-medium text-gray-800 dark:text-gray-100 pb-2">
              Popular filters
            </p>
            {roomTypes.map((room, index) => (
              <CheckBox
                key={index}
                label={room}
                selected={selectedFilters?.roomType.includes(room)}
                onChange={(checked) =>
                  handleFilterChange(checked, room, "roomType")
                }
              />
            ))}
          </div>

          {/* Price Range */}
          <div className="px-5 pt-5">
            <p className="font-medium text-gray-800 dark:text-gray-100 pb-2">
              Price Range
            </p>
            {priceRange?.map((range, index) => (
              <CheckBox
                key={index}
                label={`${currency} ${range}`}
                selected={selectedFilters.priceRange.includes(range)}
                onChange={(checked) =>
                  handleFilterChange(checked, range, "priceRange")
                }
              />
            ))}
          </div>

          {/* Sort Options */}
          <div className="px-5 pt-5 pb-7">
            <p className="font-medium text-gray-800 dark:text-gray-100 pb-2">
              Sort By
            </p>
            {sortOptions.map((option, index) => (
              <RadioButton
                key={index}
                label={option}
                selected={selectedSort === option}
                onChange={() => handleSortChange(option)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AllRooms;
