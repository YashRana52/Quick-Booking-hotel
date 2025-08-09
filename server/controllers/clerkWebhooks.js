import User from "../models/User.js";
import { Webhook } from "svix";
import dotenv from "dotenv";
dotenv.config();

const clerkWebHooks = async (req, res) => {
  try {
    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    const headers = {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    };

    const payload = wh.verify(req.body, headers);
    const { data, type } = payload;

    const userData = {
      _id: data.id,
      email: data.email_addresses?.[0]?.email_address || "",
      username: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
      image: data.image_url || data.profile_image_url || "",
      recentSearchedCities: [],
    };

    switch (type) {
      case "user.created":
        await User.create(userData);

        break;

      case "user.updated":
        await User.findByIdAndUpdate(data.id, userData, { new: true });

        break;

      case "user.deleted":
        await User.findByIdAndDelete(data.id);

        break;

      default:
        console.log(" Unhandled event type:", type);
    }

    res.status(200).json({ success: true, message: "Webhook processed" });
  } catch (error) {
    console.error(" Webhook error:", error.message);
    res.status(400).json({
      success: false,
      message: "Webhook failed",
      error: error.message,
    });
  }
};

export default clerkWebHooks;
