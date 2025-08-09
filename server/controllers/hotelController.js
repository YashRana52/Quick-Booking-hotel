import Hotel from "../models/Hotel.js";
import User from "../models/User.js";

//register hotet
export const registerHotel = async (req, res) => {
  try {
    const { name, address, contact, city } = req.body;

    const owner = req.user._id;
    //check if user is already register

    const hotel = await Hotel.findOne({ owner });
    if (hotel) {
      return res.json({
        success: false,
        message: "Hotel already register",
      });
    }
    await Hotel.create({
      name,
      address,
      contact,
      city,
      owner,
    });
    await User.findByIdAndUpdate(owner, { role: "hotelOwner" });
    res.json({
      success: true,
      message: "Hotel Register Successfully",
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};
