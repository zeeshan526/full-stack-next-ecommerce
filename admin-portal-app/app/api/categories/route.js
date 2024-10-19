import clientPromise from "../../lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(request) {
  try {
    const data = await request.json();

    if (!data.categoryName || data.categoryName.trim() === "") {
      return new Response(
        JSON.stringify({ error: "Category name is required" }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const client = await clientPromise; 
    const db = client.db("next-ecommerce");

     // Ensure that properties are an array of objects
     const properties = Array.isArray(data.properties) ? data.properties : [];

    // Insert the new category into the "categories" collection
    const result = await db.collection("categories").insertOne({
      categoryName: data.categoryName.trim(),
      properties:properties,
      parentCategory: data.parentCategory ? new ObjectId(data.parentCategory) : null, 
      createdAt: new Date(), 
    });

    // Fetch the parent category name (if any)
    let parentCategoryName = null;
    if (data.parentCategory) {
      const parentCategory = await db.collection("categories").findOne({ _id: new ObjectId(data.parentCategory) });
      parentCategoryName = parentCategory ? parentCategory.categoryName : null;
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Category added successfully!",
        category: {
          id: result.insertedId,
          categoryName: data.categoryName.trim(),
          parentCategoryName: parentCategoryName || "None",
          properties:properties || [],
          createdAt: new Date(),
        },
      }),
      {
        status: 201,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error("Error inserting category into MongoDB:", error);
    return new Response(
      JSON.stringify({ error: `Failed to create category: ${error.message}` }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

// GET: Fetch all categories
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
            parentCategoryName: { $ifNull: ["$parentCategoryDetails.categoryName", "None"] }, // Return parent category name or 'None'
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
  
