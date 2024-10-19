import { ObjectId } from "mongodb";
import clientPromise from "../../../lib/mongodb";

// GET: Fetch a category by ID
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("next-ecommerce");

    // Perform an aggregation to lookup parent categories
    const categories = await db.collection("categories").aggregate([
      {
        $lookup: {
          from: "categories",
          localField: "parentCategory",
          foreignField: "_id",
          as: "parentCategoryDetails",
        },
      },
      {
        $unwind: {
          path: "$parentCategoryDetails",
          preserveNullAndEmptyArrays: true, // Allow categories without parents
        },
      },
      {
        $project: {
          categoryName: 1,
          createdAt: 1,
          properties:1,
          parentCategoryName: { $ifNull: ["$parentCategoryDetails.categoryName", "None"] },
        },
      },
    ]).toArray();

    return new Response(JSON.stringify(categories), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return new Response(JSON.stringify({ error: `Failed to fetch categories: ${error.message}` }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}


// DELETE: Delete a category by ID
export async function DELETE(request, { params }) {
  try {
    const client = await clientPromise;
    const db = client.db("next-ecommerce");

    // Convert the id parameter to ObjectId
    const categoryId = new ObjectId(params.id);

    const result = await db.collection("categories").deleteOne({ _id: categoryId });

    if (result.deletedCount === 1) {
      return new Response(JSON.stringify({ success: true, message: "Category deleted successfully!" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } else {
      return new Response(JSON.stringify({ error: "Category not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch (error) {
    console.error("Error deleting category:", error);
    return new Response(JSON.stringify({ error: `Failed to delete category: ${error.message}` }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// PATCH: Update a category by ID
// PATCH: Update a category by ID
export async function PATCH(request, { params }) {
  try {
    const data = await request.json();  // Parse incoming JSON data
    const client = await clientPromise;
    const db = client.db("next-ecommerce");

    const categoryId = new ObjectId(params.id);

    // Check if parentCategory is a valid ObjectId, else set it to null
    const parentCategory = data.parentCategory && data.parentCategory !== "" 
      ? new ObjectId(data.parentCategory) 
      : null;

    // Ensure that properties are an array of objects
    const properties = Array.isArray(data.properties) ? data.properties : [];

    const result = await db.collection("categories").updateOne(
      { _id: categoryId },
      { $set: { categoryName: data.categoryName.trim(), parentCategory: parentCategory, properties: properties } }
    );

    if (result.matchedCount === 0) {
      return new Response(JSON.stringify({ error: "Category not found" }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Fetch the parent category name (if any)
    let parentCategoryName = null;
    if (parentCategory) {
      const parent = await db.collection("categories").findOne({ _id: parentCategory });
      parentCategoryName = parent ? parent.categoryName : null;
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Category updated successfully!",
        category: {
          id: categoryId,
          categoryName: data.categoryName.trim(),
          parentCategoryName: parentCategoryName || "None",
          properties:properties,
        },
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error("Error updating category:", error);
    return new Response(JSON.stringify({ error: `Failed to update category: ${error.message}` }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}


