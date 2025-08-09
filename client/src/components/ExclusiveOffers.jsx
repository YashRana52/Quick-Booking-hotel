import React from "react";
import Title from "./Title";
import { assets, exclusiveOffers } from "../assets/assets";

function ExclusiveOffers() {
  return (
    <div className="flex flex-col items-center px-6 md:px-16 lg:px-24 xl:px-32 pb-30 bg-white dark:bg-gray-900 transition-colors duration-500">
      <div className="flex flex-col md:flex-row items-center justify-between w-full">
        <Title
          align="left"
          title="Exclusive Offers"
          subTitle="Take advantage of our limited time offers and special packages to enhance your stay and create unforgettable memories."
        />
        <button className="group flex items-center gap-2 font-medium cursor-pointer max-md:mt-12 text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
          View All Offers
          <img
            src={assets.arrowIcon}
            alt=""
            className="group-hover:translate-x-1 transition-transform duration-300 invert dark:invert-0"
          />
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12 w-full">
        {exclusiveOffers.map((item) => (
          <div
            key={item._id}
            className="group relative flex flex-col items-start justify-between gap-1 pt-12 md:pt-18 px-4 rounded-xl text-white bg-no-repeat bg-cover bg-center shadow-lg
                       hover:shadow-2xl transition-shadow duration-300"
            style={{
              backgroundImage: `url(${item.image})`,
              filter: "brightness(0.85)",
            }}
          >
            <p className="px-3 py-1 absolute top-4 left-4 text-xs bg-white text-gray-800 font-medium rounded-full shadow">
              {item.priceOff}% OFF
            </p>
            <div>
              <p className="text-2xl font-medium font-playfair drop-shadow-lg">
                {item.title}
              </p>
              <p className="drop-shadow-md">{item.description}</p>
              <p className="text-xs text-white/70 mt-3 drop-shadow-md">
                {item.expiryDate}
              </p>
            </div>
            <button className="flex items-center gap-2 font-medium cursor-pointer mt-4 mb-5 text-white group-hover:text-blue-400 transition-colors duration-300">
              view offers
              <img
                className="invert group-hover:translate-x-1 transition-transform duration-300"
                src={assets.arrowIcon}
                alt="arrow_icon"
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ExclusiveOffers;
