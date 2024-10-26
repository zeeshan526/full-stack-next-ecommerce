import { ObjectId } from "mongodb";
import clientPromise from "../../../lib/mongodb";

// GET: Fetch a product by ID
export async function GET(request, { params }) {
  try {
    const client = await clientPromise;
    const db = client.db("next-ecommerce");

    // Convert the id parameter to ObjectId
    const productId = new ObjectId(params.id);

    // Perform an aggregation to lookup the category for the product
    const product = await db.collection("products").aggregate([
      { $match: { _id: productId } }, // Match the specific product by ID
      {
        $lookup: {
          from: "categories", // The categories collection
          localField: "category", // The category field in the product
          foreignField: "_id", // The _id field in the categories collection
          as: "categoryDetails", // Join the category details
        }
      },
      {
        $unwind: {
          path: "$categoryDetails", // Unwind to show the category details
          preserveNullAndEmptyArrays: true, // Allow products with no category
        }
      },
      {
        $project: {
          title: 1,
          description: 1,
          price: 1,
          createdAt: 1,
          properties: 1,
          images: 1,
          categoryId: "$categoryDetails._id", // Return the category ID for pre-selection
          categoryName: { $ifNull: ["$categoryDetails.categoryName", "Uncategorized"] }, // Include the category name or default
        }
      }
    ]).toArray();

    if (!product.length) {
      return new Response(JSON.stringify({ error: "Product not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(product[0]), {
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

    // Ensure the category is converted to ObjectId if it exists
    if (data.category) {
      data.category = new ObjectId(data.category); // Convert category to ObjectId
    }

    const properties = data.properties ? data.properties : {};
    const images =  data.images || [];

    // Update the product in the database
    const result = await db.collection("products").updateOne(
      { _id: productId },
      {  $set: {
        ...data,
        properties: properties,
        images: images
      }}
    );

    if (result.modifiedCount === 1) {
      return new Response(JSON.stringify({ success: true, message: "Product updated successfully!"}), {
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
