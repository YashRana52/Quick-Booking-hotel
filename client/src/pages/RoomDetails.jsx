import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { assets, facilityIcons, roomCommonData } from "../assets/assets";
import StarRating from "../components/StarRating";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

function RoomDetails() {
  const { id } = useParams();
  const [room, setRoom] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const { rooms, getToken, axios, navigate } = useAppContext();

  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [guests, setGuest] = useState(1);
  const [isAvailable, setIsAvailable] = useState(false);

  const checkAvailability = async () => {
    try {
      if (!checkInDate || !checkOutDate) {
        toast.error("Please select both check-in and check-out dates");
        return;
      }

      if (new Date(checkInDate) >= new Date(checkOutDate)) {
        toast.error("Check-in date must be before check-out date");
        return;
      }

      const { data } = await axios.post("/api/bookings/check-availability", {
        room: id,
        checkInDate,
        checkOutDate,
      });

      if (data.success) {
        if (data.isAvailable) {
          setIsAvailable(true);
          toast.success("Room is available");
        } else {
          setIsAvailable(false);
          toast.error("Room is not available");
        }
      } else {
        toast.error(data.message || "Error checking availability");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!isAvailable) {
      return checkAvailability();
    }

    try {
      const { data } = await axios.post(
        "/api/bookings/book",
        {
          room: id,
          checkInDate,
          checkOutDate,
          guests,
          paymentMethod: "Pay At Hotel",
        },
        {
          headers: { Authorization: `Bearer ${await getToken()}` },
          withCredentials: true,
        }
      );

      if (data.success) {
        toast.success(data.message);
        navigate("/my-bookings");
        window.scrollTo(0, 0);
      } else {
        toast.error(data.message || "Booking failed");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    const foundRoom = rooms.find((r) => r._id === id);
    if (foundRoom) {
      setRoom(foundRoom);
      if (Array.isArray(foundRoom.images) && foundRoom.images.length > 0) {
        setMainImage(foundRoom.images[0]);
      }
    }
  }, [rooms, id]);

  return (
    room && (
      <div className="py-28 md:py-35 px-4 md:px-16 lg:px-24 xl:px-32">
        {/* Room Details */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
          <h1 className="text-3xl font-playfair md:text-4xl">
            {room?.hotel?.name}{" "}
            <span className="text-sm font-inter">({room?.roomType})</span>
          </h1>
          <p className="text-xs font-inter py-1.5 px-3 text-white bg-orange-500 rounded-full">
            20% OFF
          </p>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1 mt-2">
          <StarRating />
          <p className="ml-2">100+ reviews</p>
        </div>

        {/* Address */}
        <div className="flex items-center gap-1 text-gray-500 mt-2">
          <img src={assets.locationIcon} alt="" />
          <span>{room?.hotel?.address}</span>
        </div>

        {/* Images */}
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-1/2 w-full">
            {mainImage && (
              <img
                src={mainImage}
                alt="main-room"
                className="w-full rounded-xl shadow-lg object-cover"
              />
            )}
          </div>
          <div className="grid grid-cols-2 gap-4 lg:w-1/2 w-full">
            {room?.images?.map((image, index) => (
              <img
                key={index}
                onClick={() => setMainImage(image)}
                src={image}
                alt=""
                className={`w-full rounded-xl shadow-md object-cover cursor-pointer ${
                  mainImage === image ? "outline-3 outline-orange-500" : ""
                }`}
              />
            ))}
          </div>
        </div>

        {/* Highlights */}
        <div className="flex flex-col md:flex-row md:justify-between mt-10">
          <div>
            <h1 className="text-3xl lg:text-4xl font-playfair">
              Experience Luxury Like Never Before
            </h1>
            <div className="flex flex-wrap items-center gap-6 mb-6 mt-3">
              {room?.amenities?.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100"
                >
                  <img
                    src={facilityIcons[item]}
                    alt={item}
                    className="w-5 h-5"
                  />
                  <p className="text-xs">{item}</p>
                </div>
              ))}
            </div>
          </div>
          <p className="text-2xl font-medium">${room?.pricePerNight}/night</p>
        </div>

        {/* Booking Form */}
        <form
          onSubmit={onSubmitHandler}
          className="flex flex-col md:flex-row items-start md:items-center justify-between bg-white shadow-lg p-6 rounded-xl mx-auto mt-16 max-w-6xl"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-10 text-gray-500">
            <div>
              <label className="font-medium">
                Check-In
                <input
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  value={checkInDate}
                  onChange={(e) => setCheckInDate(e.target.value)}
                  className="w-full rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none"
                />
              </label>
            </div>
            <div className="w-px h-15 bg-gray-300/70 max-md:hidden"></div>
            <div>
              <label className="font-medium">
                Check-Out
                <input
                  type="date"
                  min={checkInDate || new Date().toISOString().split("T")[0]}
                  value={checkOutDate}
                  onChange={(e) => setCheckOutDate(e.target.value)}
                  disabled={!checkInDate}
                  className="w-full rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none"
                />
              </label>
            </div>
            <div className="w-px h-15 bg-gray-300/70 max-md:hidden"></div>
            <div>
              <label className="font-medium mb-1">Guests</label>
              <input
                type="number"
                min="1"
                value={guests}
                onChange={(e) => setGuest(e.target.value)}
                className="w-20 rounded border border-gray-300 px-3 py-2 outline-none"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="bg-primary hover:bg-primary-dull active:scale-95 transition-all text-white rounded-md max-md:w-full max-md:mt-6 md:px-8 py-3 text-base"
          >
            {isAvailable ? "Book Now" : "Check Availability"}
          </button>
        </form>

        {/* Specifications */}
        <div className="mt-25 space-y-4">
          {roomCommonData.map((spec, index) => (
            <div key={index} className="flex items-start gap-2">
              <img
                src={spec.icon}
                alt={`${spec.title}-icon`}
                className="w-6.5"
              />
              <div>
                <p className="text-base">{spec.title}</p>
                <p className="text-gray-500">{spec.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Description */}
        <div className="max-w-3xl border-y border-gray-300 my-10 py-10 px-6 text-gray-700 rounded-lg bg-gray-50 leading-relaxed">
          <p>
            Guests will be allocated on the ground floor according to
            availability. You get a comfortable two-bedroom apartment with a
            true city feeling. The price quoted is for two guests. Please update
            the guest count for accurate pricing.
          </p>
        </div>

        {/* Host Info */}
        <div className="flex flex-col items-start gap-4">
          <div className="flex gap-4">
            <img
              src={room?.hotel?.owner?.image}
              alt="host"
              className="h-14 w-14 md:h-18 md:w-18 rounded-full"
            />
            <div>
              <p className="text-lg md:text-xl">
                Hosted by {room?.hotel?.name}
              </p>
              <div className="flex items-center mt-1">
                <StarRating />
                <p className="ml-2">100+ reviews</p>
              </div>
            </div>
          </div>
          <button className="px-6 py-2.5 mt-4 rounded text-white bg-primary hover:bg-primary-dull transition-all">
            Contact Now
          </button>
        </div>
      </div>
    )
  );
}

export default RoomDetails;
