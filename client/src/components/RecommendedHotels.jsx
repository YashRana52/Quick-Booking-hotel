import React, { useEffect, useState } from "react";
import HotelCard from "./HotelCard";
import Title from "./Title";
import { useAppContext } from "../context/AppContext";

function RecommendedHotels() {
  const { searchCities, rooms } = useAppContext();
  const [recommended, setRecommended] = useState([]);

  const filterHotels = () => {
    if (!Array.isArray(searchCities) || !Array.isArray(rooms)) {
      setRecommended([]);
      return;
    }

    const filteredHotels = rooms
      .slice()
      .filter((room) => searchCities.includes(room?.hotel?.city));

    setRecommended(filteredHotels);
  };

  useEffect(() => {
    filterHotels();
  }, [rooms, searchCities]);

  return (
    recommended.length > 0 && (
      <div className="flex flex-col items-center px-6 md:px-16 lg:px-24 bg-slate-50 py-20">
        <Title
          title="Hotels You Might Love"
          subTitle="Based on your recent searches, we’ve handpicked these stays just for you"
        />

        <div className="flex flex-wrap items-center justify-center gap-6 mt-20">
          {recommended.slice(0, 4).map((room, index) => (
            <HotelCard key={room._id} room={room} index={index} />
          ))}
        </div>
      </div>
    )
  );
}

export default RecommendedHotels;
