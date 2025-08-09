import React from "react";
import Title from "./Title";
import { assets } from "../assets/assets";

function Newsletter() {
  return (
    <div className="bg-gray-800 py-10">
      <div
        className="flex flex-col items-center max-w-5xl lg:w-full rounded-3xl px-6 py-10 md:py-15 mx-4 lg:mx-auto 
                   bg-gradient-to-r from-gray-800 via-gray-900 to-black text-white shadow-lg
                   dark:bg-gradient-to-r dark:from-gray-900 dark:via-black dark:to-black
                   transition-colors duration-500"
        style={{ minHeight: "300px" }}
      >
        <Title
          title="Stay Inspired"
          subTitle="Stay updated with the latest offers and unforgettable travel stories."
        />

        <div className="flex flex-col md:flex-row items-center justify-center gap-5 mt-8 w-full max-w-xl">
          <input
            type="email"
            className="bg-white/10 placeholder-gray-300 px-5 py-3 border border-white/30 rounded-xl outline-none w-full
                       focus:bg-white/20 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 transition duration-300"
            placeholder="Enter your email"
          />
          <button
            className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:scale-95
                       transition-transform rounded-xl px-6 py-3 font-semibold shadow-md focus:outline-none focus:ring-4 focus:ring-indigo-400"
          >
            Subscribe
            <img src={assets.arrowIcon} alt="arrow icon" className="w-5 h-5" />
          </button>
        </div>

        <p className="text-gray-400 mt-8 text-xs text-center max-w-md">
          By subscribing, you agree to our{" "}
          <span className="underline cursor-pointer hover:text-indigo-400">
            Privacy Policy
          </span>{" "}
          and consent to receive updates.
        </p>
      </div>
    </div>
  );
}

export default Newsletter;
