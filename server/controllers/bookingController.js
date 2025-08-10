import transporter from "../config/nodemialer.js";
import Booking from "../models/Booking.js";
import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";
import stripe, { Stripe } from "stripe";
// Function to check Availability of room

export const checkAvailability = async ({
  checkInDate,
  checkOutDate,
  room,
}) => {
  try {
    const bookings = await Booking.find({
      room,
      checkInDate: { $lte: checkOutDate },
      checkOutDate: { $gte: checkInDate },
    });
    const isAvailable = bookings.length === 0;
    return isAvailable;
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// Api to check availability of room

export const checkAvailabilityAPI = async (req, res) => {
  try {
    const { room, checkInDate, checkOutDate } = req.body;
    const isAvailable = await checkAvailability({
      checkInDate,
      checkOutDate,
      room,
    });
    res.json({
      success: true,
      isAvailable,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

//Api to create new booking

export const createBooking = async (req, res) => {
  try {
    const { room, checkInDate, checkOutDate, guests } = req.body;
    const user = req.user._id; // ab safe hai

    // Check availability
    const isAvailable = await checkAvailability({
      room,
      checkInDate,
      checkOutDate,
    });
    if (!isAvailable) {
      return res.json({ success: false, message: "Room is not available" });
    }

    // Room details
    const roomData = await Room.findById(room).populate("hotel");
    let totalPrice = roomData.pricePerNight;

    // Calculate nights
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 3600 * 24));
    totalPrice *= nights;

    // Create booking
    const booking = await Booking.create({
      user,
      room,
      hotel: roomData.hotel._id,
      guests: +guests,
      checkInDate,
      checkOutDate,
      totalPrice,
    });

    // Email
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: req.user.email,
      subject: "Hotel Booking Details",
      html: `
        <h2>Your Booking Details</h2>
        <p>Dear ${req.user.username},</p>
        <p>Thank you for booking! Here are your details:</p>
        <ul>
          <li>Booking ID: <strong>${booking._id}</strong></li>
          <li>Hotel Name: <strong>${roomData.hotel.name}</strong></li>
          <li>Location: <strong>${roomData.hotel.address}</strong></li>
          <li>Check-in Date: <strong>${booking.checkInDate.toDateString()}</strong></li>
          <li>Price: <strong>${process.env.CURRENCY || "$"} ${
        booking.totalPrice
      }/night</strong></li>
        </ul>
        <p>We’re excited to welcome you!</p>
        <p>
          <strong>Yash Rana</strong><br>
          Phone: <a href="tel:9569633102">9569633102</a><br>
          Email: <a href="mailto:${process.env.SENDER_EMAIL}">${
        process.env.SENDER_EMAIL
      }</a>
        </p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.json({ success: true, message: "Booking created successfully" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Failed to create booking" });
  }
};

//api to get all bookings for a user
export const getUserBookings = async (req, res) => {
  try {
    const user = req.user._id;
    const bookings = await Booking.find({ user })
      .populate("room hotel")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      bookings,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Failed to fetch booking",
    });
  }
};

// gethotel booking for owner

export const getHotelBookings = async (req, res) => {
  try {
    const hotel = await Hotel.findOne({ owner: req.auth.userId });
    if (!hotel) {
      return res.json({
        success: false,
        message: "No Hotel found",
      });
    }

    const bookings = await Booking.find({
      hotel: hotel._id,
    })
      .populate("room hotel user")
      .sort({ createdAt: -1 });

    // Total bookings
    const totalBookings = bookings.length;
    //Total Revenue
    const totalRevenue = bookings.reduce(
      (acc, booking) => acc + booking.totalPrice,
      0
    );
    res.json({
      success: true,
      dashboardData: {
        totalBookings,
        totalRevenue,
        bookings,
      },
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Failed to fetch booking",
    });
  }
};

// stripe payment gateway

export const stripePayment = async (req, res) => {
  try {
    const { bookingId } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }

    const roomData = await Room.findById(booking.room).populate("hotel");
    if (!roomData) {
      return res
        .status(404)
        .json({ success: false, message: "Room not found" });
    }

    const totalPrice = Number(booking.totalPrice);
    const { origin } = req.headers;

    const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

    const line_items = [
      {
        price_data: {
          currency: "inr",
          product_data: {
            name: roomData.hotel.name,
          },
          unit_amount: Math.max(totalPrice * 100, 5000), // min ₹50
        },
        quantity: 1,
      },
    ];

    const session = await stripeInstance.checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url: `${origin}/loader/my-bookings`,
      cancel_url: `${origin}/my-bookings`,
      metadata: { bookingId: String(bookingId) },
    });

    res.json({ success: true, url: session.url });
  } catch (error) {
    console.error("Stripe payment error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to process payment" });
  }
};
