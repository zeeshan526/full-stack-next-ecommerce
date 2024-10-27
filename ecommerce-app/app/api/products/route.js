import clientPromise from "@/app/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('next-ecommerce');

    const products = await db.collection('products').find({}).toArray();

    if (products.length > 0) {
      return new Response(JSON.stringify(products), {
        status: 200,
      });
    } else {
      return new Response(JSON.stringify({ message: 'No products found' }), {
        status: 404,
      });
    }
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Internal Server Error', error }), {
      status: 500,
    });
  }
}
