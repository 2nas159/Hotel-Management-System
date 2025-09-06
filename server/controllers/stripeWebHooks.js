import stripe from "stripe";
import Booking from "../models/Booking.js";

// API to handle Stripe webhooks

export const stripeWebHooks = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  let event;

  try {
    event = stripeInstance.webhooks.constructEvent(
      req.body,
      sig,
      endpointSecret
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event based on its type
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;

      // The session contains the metadata we sent
      const { bookingId } = session.metadata;

      // Fulfill the purchase...
      if (session.payment_status === "paid" && bookingId) {
        try {
          const updatedBooking = await Booking.findByIdAndUpdate(bookingId, {
            isPaid: true,
            paymentMethod: "Stripe",
            status: "confirmed", // Update status to confirmed after payment
          }, { new: true });
          
        } catch (dbError) {
          return res.status(500).json({ error: "Database update failed." });
        }
      }
      break;
    }
    default:
  }

  // Return a 200 response to acknowledge receipt of the event
  res.status(200).json({ received: true });
};

// Test endpoint to verify webhook functionality
export const testWebhook = async (req, res) => {
  try {
    // Check if environment variables are set
    const hasStripeKey = !!process.env.STRIPE_SECRET_KEY;
    const hasWebhookSecret = !!process.env.STRIPE_WEBHOOK_SECRET;
    
    res.json({
      success: true,
      message: "Webhook endpoint is working",
      environment: {
        hasStripeKey,
        hasWebhookSecret,
        stripeKeyPrefix: process.env.STRIPE_SECRET_KEY?.substring(0, 7) + "...",
        webhookSecretPrefix: process.env.STRIPE_WEBHOOK_SECRET?.substring(0, 7) + "..."
      }
    });
  } catch (error) {
    console.error("Webhook test error:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
