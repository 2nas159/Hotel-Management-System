import User from "../models/User.js";
import { Webhook } from "svix";

const clerkWebHooks = async (req, res) => {
  try {
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    const headers = {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    };

    // Verify the headers
    await whook.verify(JSON.stringify(req.body), headers);

    // Getting data from the request body
    const { data, type } = req.body;

    const userData = {
      _id: data.id,
      email: data.email_addresses[0].email_adress,
      username: data.first_name + " " + data.last_name,
      image: data.image_url,
    };

    // Switch Cases for different Events
    switch (type) {
      case "user.created":
        // Create a new user in the database
        await User.create(userData);
        break;

      case "user.updated":
        // Update the existing user in the database
        await User.findByIdAndUpdate(data.id, userData);
        break;

      case "user.deleted":
        // Delete the user from the database
        await User.findByIdAndDelete(data.id);
        break;

      default:
        break;
    }
    res.json({ success: true, message: "Webhook processed successfully" });
  } catch (error) {
    console.log(error.message);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export default clerkWebHooks;
