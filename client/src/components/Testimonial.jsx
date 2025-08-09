import React from "react";
import Title from "./Title";

import { testimonials } from "../assets/assets";
import StarRating from "./StarRating";

function Testimonial() {
  return (
    <div className="py-16 bg-[#f9f9f9]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Title
          title="What Our Guests Say"
          subTitle="Real stories from our happy guests. Discover what made their stay unforgettable!"
          align="center"
        />

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition duration-300"
            >
              <div className="flex items-start gap-4">
                {/* Profile Image */}
                <img
                  className="w-14 h-14 rounded-full object-cover"
                  src={testimonial.image}
                  alt={testimonial.name}
                />

                <div>
                  <p className="text-base font-semibold text-gray-800">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {testimonial.address}
                  </p>
                  <div className="mt-2 flex">
                    <StarRating rating={testimonial.rating} />
                  </div>
                </div>
              </div>

              {/* Review */}
              <p className="text-gray-600 mt-4 text-sm leading-relaxed">
                "{testimonial.review}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Testimonial;
