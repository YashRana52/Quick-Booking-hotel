import { UserButton } from "@clerk/clerk-react";
import { assets } from "../../assets/assets";

import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <div className="flex items-center justify-between px-4 md:px-8 border-b border-gray-300 py-1 bg-white transition-all duration-300">
      <Link to="/" className="">
        <img
          src={assets.logo1}
          alt="logo"
          className="h-15 w-30 invert opacity-80"
        />
      </Link>
      <UserButton />
    </div>
  );
}

export default Navbar;
