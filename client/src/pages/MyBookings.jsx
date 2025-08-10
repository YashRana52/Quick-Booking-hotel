import React, { useEffect, useState } from "react";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import toast from "react-hot-toast";
import { useAppContext } from "../context/AppContext";

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const { getToken, axios, user, currency } = useAppContext();

  const HandleUserBookings = async () => {
    try {
      const { data } = await axios.get("/api/bookings/user", {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });
      if (data.success) {
        setBookings(data.bookings);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handlePayment = async (bookingId) => {
    try {
      const { data } = await axios.post(
        "/api/bookings/stripe-payment",
        { bookingId },
        {
          headers: { Authorization: `Bearer ${await getToken()}` },
        }
      );
      if (data.success) {
        window.location.href = data.url;
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (user) {
      HandleUserBookings();
    }
  }, [user]);

  return (
    <div className="py-28 md:pb-36 md:pt-32 px-4 md:px-16 lg:px-24 xl:px-32 bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-800 dark:text-gray-200">
      <Title
        title="My Bookings"
        subTitle="Easily manage your past, current, and upcoming hotel reservations in one place. Plan your trips seamlessly with a few clicks."
        align="left"
      />

      <div className="max-w-6xl mt-8 w-full">
        {/* Table */}
        <div className="hidden md:grid grid-cols-[3fr_2fr_1fr] border-b border-gray-300 dark:border-gray-700 font-semibold text-gray-700 dark:text-gray-300 text-base pb-3 mb-4">
          <div>Hotel</div>
          <div>Date & Timings</div>
          <div>Payment</div>
        </div>

        {/* Booking rows */}
        {bookings.map((booking) => (
          <div
            key={booking._id}
            className="grid grid-cols-1 md:grid-cols-[3fr_2fr_1fr] gap-6 w-full border-b border-gray-200 dark:border-gray-700 py-6 first:border-t bg-white dark:bg-gray-800 shadow-sm rounded-lg mb-4 p-4"
          >
            {/* Hotel Info */}
            <div className="flex flex-col md:flex-row gap-4">
              <img
                src={booking.room.images[0]}
                alt="Room"
                className="w-full md:w-44 h-32 object-cover rounded-md shadow-sm"
              />
              <div className="flex flex-col justify-between">
                <p className="font-playfair text-xl leading-tight">
                  {booking.hotel.name}
                  <span className="block text-sm font-inter text-gray-500 dark:text-gray-400">
                    ({booking.room.roomType})
                  </span>
                </p>

                <div className="flex items-center gap-2 mt-2 text-sm text-gray-500 dark:text-gray-400">
                  <img
                    src={assets.locationIcon}
                    alt="Location"
                    className="w-4"
                  />
                  <span>{booking.hotel.address}</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-1">
                  <img src={assets.guestsIcon} alt="Guests" className="w-4" />
                  <span>Guests: {booking.guests}</span>
                </div>

                <p className="text-gray-400 dark:text-gray-300 text-sm mt-1">
                  Total: {currency}
                  {booking.totalPrice}
                </p>
              </div>
            </div>

            {/* Dates */}
            <div className="flex md:flex-col justify-around md:justify-center gap-4 text-sm">
              <div>
                <p className="font-medium">Check-In</p>
                <p className="text-gray-500 dark:text-gray-400">
                  {new Date(booking.checkInDate).toDateString()}
                </p>
              </div>
              <div>
                <p className="font-medium">Check-Out</p>
                <p className="text-gray-500 dark:text-gray-400">
                  {new Date(booking.checkOutDate).toDateString()}
                </p>
              </div>
            </div>

            {/* Payment */}
            <div className="flex flex-col items-start md:items-center justify-center gap-2">
              <div className="flex items-center gap-2">
                <div
                  className={`h-3 w-3 rounded-full ${
                    booking.isPaid ? "bg-green-500" : "bg-red-500"
                  }`}
                ></div>
                <p
                  className={`text-sm font-medium ${
                    booking.isPaid ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {booking.isPaid ? "Paid" : "Unpaid"}
                </p>
              </div>

              {!booking.isPaid && (
                <button
                  onClick={() => handlePayment(booking._id)}
                  className="mt-2 px-4 py-1.5 text-sm bg-primary text-white rounded hover:bg-primary-dull transition duration-300"
                >
                  Pay Now
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyBookings;
