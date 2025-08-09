import React from "react";

import HotelCard from "./HotelCard";
import Title from "./Title";

import { useAppContext } from "../context/AppContext";

function FeatureDestination() {
  const { navigate, rooms } = useAppContext();

  return (
    rooms.length > 0 && (
      <div className="flex flex-col items-center px-6 md:px-16 lg:px-24 bg-slate-50 dark:bg-gradient-to-r dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-20">
        <Title
          title="Featured Destination"
          subTitle="Top travel spots handpicked for unforgettable memories"
          // Title component me dark mode support add karna na bhoolein
        />
        <div className="flex flex-wrap items-center justify-center gap-8 mt-20">
          {rooms.slice(0, 4).map((room, index) => (
            <HotelCard key={room._id} room={room} index={index} />
          ))}
        </div>
        <button
          onClick={() => {
            navigate("/rooms");
            scrollTo(0, 0);
          }}
          className="my-16 px-6 py-3 text-sm font-semibold border border-gray-300 dark:border-gray-600 rounded-lg 
                     bg-white dark:bg-gradient-to-r dark:from-blue-600 dark:via-blue-700 dark:to-blue-800 
                     text-gray-900 dark:text-white shadow-md dark:shadow-lg 
                     hover:bg-gray-100 dark:hover:from-blue-700 dark:hover:via-blue-800 dark:hover:to-blue-900
                     transition-all cursor-pointer active:scale-95"
        >
          View All Destinations
        </button>
      </div>
    )
  );
}

export default FeatureDestination;
