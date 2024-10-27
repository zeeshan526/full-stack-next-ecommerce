import clientPromise from "@/app/lib/mongodb";

export async function POST(request) {
  try {
    const data = await request.json();

    if (!data.userName || !data.email || !data.message) {
      return new Response(
        JSON.stringify({ error: "All fields (userName, email, message) are required." }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const client = await clientPromise;
    const db = client.db("next-ecommerce");

    const contactData = {
      userName: data.userName,
      email: data.email,
      message: data.message,
      createdAt: new Date(),
    };

    const result = await db.collection("contacts").insertOne(contactData);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Contact information saved successfully!",
        contact: {
          id: result.insertedId,
          ...contactData,
        }
      }),
      {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error("Error saving contact info to MongoDB:", error);

    return new Response(
      JSON.stringify({ error: `Failed to save contact information: ${error.message}` }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
