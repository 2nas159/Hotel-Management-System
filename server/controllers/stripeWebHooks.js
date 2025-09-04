import stripe from "stripe";
import Booking from "../models/Booking.js";

// API to handle Stripe webhooks

export const stripeWebHooks = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  let event;

  console.log("🔔 Stripe webhook received:", {
    signature: sig ? "Present" : "Missing",
    endpointSecret: endpointSecret ? "Present" : "Missing",
    bodySize: req.body ? req.body.length : 0
  });

  try {
    event = stripeInstance.webhooks.constructEvent(
      req.body,
      sig,
      endpointSecret
    );
    console.log("✅ Webhook signature verified. Event type:", event.type);
  } catch (err) {
    console.log(`⚠️  Webhook signature verification failed.`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event based on its type
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      console.log("💳 Checkout session completed:", {
        sessionId: session.id,
        paymentStatus: session.payment_status,
        metadata: session.metadata
      });

      // The session contains the metadata we sent
      const { bookingId } = session.metadata;
      console.log("📋 Booking ID from metadata:", bookingId);

      // Fulfill the purchase...
      if (session.payment_status === "paid" && bookingId) {
        try {
          const updatedBooking = await Booking.findByIdAndUpdate(bookingId, {
            isPaid: true,
            paymentMethod: "Stripe",
            status: "confirmed", // Update status to confirmed after payment
          }, { new: true });
          
          console.log(`✅ Booking ${bookingId} has been marked as paid and confirmed.`);
          console.log(`Updated booking:`, {
            id: updatedBooking._id,
            status: updatedBooking.status,
            isPaid: updatedBooking.isPaid,
            paymentMethod: updatedBooking.paymentMethod
          });
        } catch (dbError) {
          console.error(`Error updating booking ${bookingId}:`, dbError);
          return res.status(500).json({ error: "Database update failed." });
        }
      } else {
        console.log("⚠️ Payment not completed or booking ID missing:", {
          paymentStatus: session.payment_status,
          bookingId: bookingId
        });
      }
      break;
    }
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  res.status(200).json({ received: true });
};

// Test endpoint to verify webhook functionality
export const testWebhook = async (req, res) => {
  try {
    console.log("🧪 Testing webhook endpoint...");
    
    // Check if environment variables are set
    const hasStripeKey = !!process.env.STRIPE_SECRET_KEY;
    const hasWebhookSecret = !!process.env.STRIPE_WEBHOOK_SECRET;
    
    console.log("Environment check:", {
      hasStripeKey,
      hasWebhookSecret,
      stripeKeyLength: process.env.STRIPE_SECRET_KEY?.length || 0,
      webhookSecretLength: process.env.STRIPE_WEBHOOK_SECRET?.length || 0
    });
    
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
