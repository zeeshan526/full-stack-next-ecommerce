import clientPromise from "../../lib/mongodb";
import { ObjectId } from "mongodb"; 

export async function POST(request) {
    try {
      const data = await request.json();
  
      // Server-side validation: ensure all fields are present
      if (!data.title || !data.description || !data.price || !data.category) {
        return new Response(
          JSON.stringify({ error: "All fields (title, description, price, category) are required" }),
          {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }
  
      const client = await clientPromise; // Get the MongoDB client
      const db = client.db("next-ecommerce");
  
      // Ensure category is stored as ObjectId
      const productData = {
        ...data,
        category: new ObjectId(data.category), // Convert category to ObjectId
        images: data.images || [],
        createdAt: new Date(),
      };
  
      // Insert the new product into the "products" collection
      const result = await db.collection("products").insertOne(productData);
  
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
      console.error("Error inserting product into MongoDB:", error);
  
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
    const client = await clientPromise;
    const db = client.db("next-ecommerce");

    // Perform an aggregation to join the category data
    const products = await db.collection("products").aggregate([
      {
        $lookup: {
          from: "categories", // The collection to join
          localField: "category", // The field from the products collection
          foreignField: "_id", // The field from the categories collection
          as: "categoryDetails", // Output the category data
        }
      },
      {
        $unwind: {
          path: "$categoryDetails", // Unwind the array to return one document per product
          preserveNullAndEmptyArrays: true, // Preserve products without categories
        }
      },
      {
        $project: {
          title: 1,
          description: 1,
          price: 1,
          createdAt: 1,
          images: 1,
          categoryName: { $ifNull: ["$categoryDetails.categoryName", "Uncategorized"] }, // Category name or default to 'Uncategorized'
        }
      }
    ])
    .sort({ createdAt: -1 })
    .toArray();

    return new Response(JSON.stringify(products), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error("Error fetching products from MongoDB:", error);

    return new Response(JSON.stringify({ error: `Failed to fetch products: ${error.message}` }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
