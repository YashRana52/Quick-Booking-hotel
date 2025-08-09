import { Link } from "react-router-dom";
import React from "react";
import { assets } from "../assets/assets";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 border-t border-gray-700">
      <div className="mx-auto w-full max-w-screen-xl p-4 py-8 lg:py-12">
        <div className="md:flex md:justify-between">
          <div className="mb-6 md:mb-0">
            <Link to="/" className="flex items-center">
              <img src={assets.logo1} className="mr-3 h-40" alt="Logo" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
            <div>
              <h2 className="mb-6 text-sm font-semibold text-white uppercase">
                Resources
              </h2>
              <ul className="font-medium space-y-2">
                <li>
                  <Link to="/" className="hover:underline hover:text-primary">
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/about"
                    className="hover:underline hover:text-primary"
                  >
                    About
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="mb-6 text-sm font-semibold text-white uppercase">
                Follow us
              </h2>
              <ul className="font-medium space-y-2">
                <li>
                  <a
                    href="https://github.com/YashRana52"
                    className="hover:underline hover:text-primary"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Github
                  </a>
                </li>
                <li>
                  <Link to="/" className="hover:underline hover:text-primary">
                    Discord
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="mb-6 text-sm font-semibold text-white uppercase">
                Legal
              </h2>
              <ul className="font-medium space-y-2">
                <li>
                  <Link to="#" className="hover:underline hover:text-primary">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:underline hover:text-primary">
                    Terms & Conditions
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <hr className="my-6 border-gray-700" />
        <div className="sm:flex sm:items-center sm:justify-between">
          <span className="text-sm text-gray-400">
            © 2025
            <a
              href="https://yashrana.com/"
              className="hover:underline text-primary ml-1"
            >
              yashrana
            </a>
            . All Rights Reserved.
          </span>
          <div className="flex mt-4 space-x-6 sm:justify-center sm:mt-0">
            {/* Example social icons, customize as needed */}
            <Link to="#" className="text-gray-400 hover:text-white transition">
              <i className="fab fa-facebook-f"></i>
            </Link>
            <Link to="#" className="text-gray-400 hover:text-white transition">
              <i className="fab fa-twitter"></i>
            </Link>
            <Link to="#" className="text-gray-400 hover:text-white transition">
              <i className="fab fa-github"></i>
            </Link>
            <Link to="#" className="text-gray-400 hover:text-white transition">
              <i className="fab fa-dribbble"></i>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
