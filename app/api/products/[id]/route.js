import { ObjectId } from "mongodb";
import clientPromise from "../../../lib/mongodb";

// GET: Fetch a product by ID
export async function GET(request, { params }) {
  try {
    const client = await clientPromise;
    const db = client.db("next-ecommerce");

    // Convert the id parameter to ObjectId
    const productId = new ObjectId(params.id);

    const product = await db.collection("products").findOne({ _id: productId });

    if (!product) {
      return new Response(JSON.stringify({ error: "Product not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(product), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    return new Response(JSON.stringify({ error: `Failed to fetch product: ${error.message}` }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// PATCH: Update a product by ID
export async function PATCH(request, { params }) {
  try {
    const data = await request.json();
    const client = await clientPromise;
    const db = client.db("next-ecommerce");

    // Convert the id parameter to ObjectId
    const productId = new ObjectId(params.id);

    const result = await db.collection("products").updateOne(
      { _id: productId },
      { $set: data }
    );

    if (result.modifiedCount === 1) {
      return new Response(JSON.stringify({ success: true, message: "Product updated successfully!" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } else {
      return new Response(JSON.stringify({ error: "Product not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch (error) {
    console.error("Error updating product:", error);
    return new Response(JSON.stringify({ error: `Failed to update product: ${error.message}` }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// DELETE: Delete a product by ID
export async function DELETE(request, { params }) {
  try {
    const client = await clientPromise;
    const db = client.db("next-ecommerce");

    // Convert the id parameter to ObjectId
    const productId = new ObjectId(params.id);

    const result = await db.collection("products").deleteOne({ _id: productId });

    if (result.deletedCount === 1) {
      return new Response(JSON.stringify({ success: true, message: "Product deleted successfully!" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } else {
      return new Response(JSON.stringify({ error: "Product not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch (error) {
    console.error("Error deleting product:", error);
    return new Response(JSON.stringify({ error: `Failed to delete product: ${error.message}` }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
