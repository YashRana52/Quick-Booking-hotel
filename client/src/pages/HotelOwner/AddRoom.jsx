import { assets } from "../../assets/assets";
import Title from "../../components/Title";
import React, { useState } from "react";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

function AddRoom() {
  const { axios, getToken } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState({
    1: null,
    2: null,
    3: null,
    4: null,
  });

  const [input, setInput] = useState({
    roomType: "",
    pricePerNight: 0,
    amenities: {
      "Free Wifi": false,
      "Free BreakFast": false,
      "Room Service": false,
      "Mountain View": false,
      "Pool Access": false,
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    // check if all input are filled
    if (
      !input.roomType ||
      !input.pricePerNight ||
      !input.amenities ||
      !Object.values(images).some((image) => image)
    ) {
      toast.error("Please fill in all the details");
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("roomType", input.roomType);
      formData.append("pricePerNight", input.pricePerNight);

      //converting Amenities to array & keep only enable Amenties

      const amenties = Object.keys(input.amenities).filter(
        (key) => input.amenities[key]
      );

      formData.append("amenities", JSON.stringify(amenties));
      //adding images to formdata
      Object.keys(images).forEach((key) => {
        images[key] && formData.append("images", images[key]);
      });

      const { data } = await axios.post("/api/rooms", formData, {
        headers: { Authorization: `Bearer ${await getToken()}` },
        withCredentials: true,
      });

      if (data.success) {
        toast.success(data.message);
        setInput({
          roomType: "",
          pricePerNight: "",
          amenities: {
            "Free Wifi": false,
            "Free BreakFast": false,
            "Room Service": false,
            "Mountain View": false,
            "Pool Access": false,
          },
        });
        setImages({ 1: null, 2: null, 3: null, 4: null });
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-5xl mx-auto px-4  space-y-10"
    >
      <Title
        align="left"
        font="outfit"
        title="Add Room"
        subTitle="Add new rooms with photos, type, price, and amenities to attract more guests."
      />

      {/* Upload Images */}
      <div>
        <p className="text-lg font-semibold text-gray-800 mb-2">
          Upload Room Images
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {Object.keys(images).map((key) => (
            <label
              htmlFor={`roomImages${key}`}
              key={key}
              className="relative w-full h-24 border border-gray-300 rounded-md cursor-pointer overflow-hidden group bg-gray-50 hover:shadow-md transition"
            >
              <img
                src={
                  images[key]
                    ? URL.createObjectURL(images[key])
                    : assets.uploadArea
                }
                alt={`Room ${key}`}
                className="object-cover w-full h-full group-hover:opacity-80 transition"
              />
              <input
                type="file"
                accept="image/*"
                id={`roomImages${key}`}
                hidden
                onChange={(e) =>
                  setImages({ ...images, [key]: e.target.files[0] })
                }
              />
            </label>
          ))}
        </div>
      </div>

      {/* Room Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="text-gray-700 font-medium block mb-2">
            Room Type
          </label>
          <select
            value={input.roomType}
            onChange={(e) => setInput({ ...input, roomType: e.target.value })}
            className="w-full border border-gray-300 bg-white px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Room Type</option>
            <option value="Single Bed">Single Bed</option>
            <option value="Double Bed">Double Bed</option>
            <option value="Luxury Room">Luxury Room</option>
            <option value="Family Suite">Family Suite</option>
          </select>
        </div>

        <div>
          <label className="text-gray-700 font-medium block mb-2">
            Price <span className="text-sm text-gray-500">/night (INR)</span>
          </label>
          <input
            min={0}
            type="number"
            placeholder="Enter Price"
            className="w-full border border-gray-300 px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={input.pricePerNight}
            onChange={(e) =>
              setInput({ ...input, pricePerNight: e.target.value })
            }
          />
        </div>
      </div>

      {/* Amenities */}
      <div>
        <p className="text-xl font-semibold text-gray-800 mb-1">
          Select Amenities
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {Object.keys(input.amenities).map((amenity, index) => (
            <label
              key={index}
              className="flex items-center gap-3 p-3 border border-gray-200 rounded-md bg-gray-50 hover:bg-gray-100 transition cursor-pointer"
            >
              <input
                type="checkbox"
                checked={input.amenities[amenity]}
                onChange={() =>
                  setInput({
                    ...input,
                    amenities: {
                      ...input.amenities,
                      [amenity]: !input.amenities[amenity],
                    },
                  })
                }
              />
              <span className="text-gray-700">{amenity}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Submit */}
      <div>
        <button
          disabled={loading}
          type="submit"
          className="bg-blue-600 text-white px-8 py-3 rounded-md font-semibold hover:bg-blue-700 transition active:scale-95"
        >
          {loading ? "Adding..." : "+ Add Room"}
        </button>
      </div>
    </form>
  );
}

export default AddRoom;
