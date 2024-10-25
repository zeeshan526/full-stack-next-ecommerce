import clientPromise from "../../lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("next-ecommerce");

    // Fetch orders sorted by createdAt in descending order with only required fields
    const orders = await db.collection("orders")
      .find(
        {},
        {
          projection: {
            _id: 1,
            userDetails: 1,
            orderDetails: 1,
            paymentMethod: 1,
            paymentStatus: 1,
            createdAt: 1,
          }
        }
      )
      .sort({ createdAt: -1 })
      .toArray();

    return new Response(JSON.stringify(orders), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error("Error fetching orders from MongoDB:", error);

    return new Response(JSON.stringify({ error: `Failed to fetch orders: ${error.message}` }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
