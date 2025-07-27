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
    console.log(`⚠️  Webhook signature verification failed.`, err.message);
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
          await Booking.findByIdAndUpdate(bookingId, {
            isPaid: true,
            paymentMethod: "Stripe",
          });
          console.log(`✅ Booking ${bookingId} has been marked as paid.`);
        } catch (dbError) {
          console.error(`Error updating booking ${bookingId}:`, dbError);
          return res.status(500).json({ error: "Database update failed." });
        }
      }
      break;
    }
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  res.status(200).json({ received: true });
};
