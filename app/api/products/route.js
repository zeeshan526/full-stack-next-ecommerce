import clientPromise from "../../lib/mongodb";

export async function POST(request) {
  try {
    const data = await request.json(); // Parse the incoming JSON request body

    // Server-side validation: ensure all fields are present
    if (!data.title || !data.description || !data.price) {
      return new Response(
        JSON.stringify({ error: "All fields (title, description, price) are required" }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const client = await clientPromise; // Get the MongoDB client
    const db = client.db("next-ecommerce"); // Replace with your actual database name

    // Insert the new product into the "products" collection
    const result = await db.collection("products").insertOne({
      ...data, // Spread the parsed data (title, description, price)
      createdAt: new Date(), // Add a createdAt timestamp
    });

    // Return a success message along with the inserted product data
    return new Response(JSON.stringify({
      success: true,
      message: "Product added successfully!",
      product: {
        id: result.insertedId,
        ...data,
        created_at: new Date(),
      }
    }), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error("Error inserting product into MongoDB:", error); // Log the actual error to the console

    return new Response(JSON.stringify({ error: `Failed to create product: ${error.message}` }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

export async function GET() {
  try {
    const client = await clientPromise; // Get the MongoDB client
    const db = client.db("next-ecommerce"); // Replace with your actual database name

    // Fetch all products from the "products" collection
    const products = await db.collection("products").find({}).toArray();

    // Return the products as a JSON response
    return new Response(JSON.stringify(products), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error("Error fetching products from MongoDB:", error); // Log the actual error

    return new Response(JSON.stringify({ error: `Failed to fetch products: ${error.message}` }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
