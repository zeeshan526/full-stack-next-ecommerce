import clientPromise from "../../lib/mongodb";
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    const data = await request.json();
    const { userDetails, orderDetails } = data;

    // Validate user details and order details
    if (!userDetails || !orderDetails || !orderDetails.cartProducts || !orderDetails.totalPrice || !orderDetails.paymentMethod) {
      console.log('Invalid data:', data);
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // MongoDB connection
    const client = await clientPromise;
    const db = client.db("next-ecommerce");

    // Insert order into MongoDB
    const orderData = {
      userDetails: userDetails,
      orderDetails: orderDetails,
      paymentMethod: orderDetails.paymentMethod,
      paymentStatus: orderDetails.paymentMethod === 'cod' ? 'pending' : 'paid', // If COD, payment status is pending
      createdAt: new Date(),
    };

    const result = await db.collection("orders").insertOne(orderData);

    // If payment method is 'card', create Stripe PaymentIntent
    if (orderDetails.paymentMethod === 'card') {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(orderDetails.totalPrice * 100), // Stripe accepts amounts in cents
        currency: orderDetails.currency,
        metadata: { orderId: result.insertedId.toString() },
        payment_method_types: ['card'],
      });

      return new Response(JSON.stringify({
        success: true,
        clientSecret: paymentIntent.client_secret,
        orderId: result.insertedId,
      }), {
        status: 201,
        headers: { "Content-Type": "application/json" },
      });
    } else {
      // For COD, return success without creating a PaymentIntent
      return new Response(JSON.stringify({
        success: true,
        orderId: result.insertedId,
      }), {
        status: 201,
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch (error) {
    console.error("Error processing order or payment:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
