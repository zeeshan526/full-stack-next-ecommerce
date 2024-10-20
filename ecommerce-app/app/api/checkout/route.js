import clientPromise from "../../lib/mongodb";

export async function POST(request) {
  try {
    const data = await request.json();

    // Destructure the nested userDetails and orderDetails from the request body
    const { userDetails, orderDetails } = data;

    // Validate userDetails fields
    const { fullName, email, shippingAddress } = userDetails;
    const { city, postalCode, country, address } = shippingAddress;

    // Validate orderDetails fields
    const { cartProducts, totalPrice, currency } = orderDetails;

    // Server-side validation: ensure all fields are present
    if (!fullName || !email || !city || !postalCode || !country || !address || !cartProducts || cartProducts.length === 0 || !totalPrice || !currency) {
      return new Response(
        JSON.stringify({ error: "All fields (userDetails, shippingAddress, and order details) are required" }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const client = await clientPromise; // Get the MongoDB client
    const db = client.db("next-ecommerce");

    // Construct the order data to insert into MongoDB
    const orderData = {
      userDetails: {
        fullName,
        email,
        shippingAddress: {
          city,
          postalCode,
          country,
          address,
        },
      },
      orderDetails: {
        cartProducts,
        totalPrice,
        currency,
      },
      createdAt: new Date(), // Store when the order was created
    };

    // Insert the new order into the "orders" collection
    const result = await db.collection("orders").insertOne(orderData);

    // Return success response with the inserted order ID
    return new Response(
      JSON.stringify({
        success: true,
        message: "Order created successfully!",
        orderId: result.insertedId,  // Return the ID of the newly created order
      }),
      {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error("Error inserting order into MongoDB:", error);

    return new Response(
      JSON.stringify({ error: `Failed to create order: ${error.message}` }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
