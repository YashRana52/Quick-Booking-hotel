import Stripe from "stripe";
import Booking from "../models/Booking.js";

export const stripeWebhooks = async (req, res) => {
  const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripeInstance.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  let bookingId;

  // Handle Checkout Session Completion
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    bookingId = session.metadata?.bookingId;
  }

  // Handle Payment Intent Succeeded
  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object;
    bookingId = paymentIntent.metadata?.bookingId;
  }

  // If bookingId mila hai, update booking
  if (bookingId) {
    try {
      await Booking.findByIdAndUpdate(bookingId, {
        isPaid: true,
        paymentMethod: "Stripe",
      });
      console.log(`Booking ${bookingId} marked as paid.`);
    } catch (err) {
      console.error("Error updating booking:", err.message);
    }
  } else {
    console.log("Event received but no bookingId found:", event.type);
  }

  res.json({ received: true });
};
