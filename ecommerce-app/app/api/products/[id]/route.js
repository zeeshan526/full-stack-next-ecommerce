import clientPromise from '../../../lib/mongodb'; 
import { ObjectId } from 'mongodb';

export async function GET(req, { params }) {
  const { id } = params;

  if (!ObjectId.isValid(id)) {
    return new Response(JSON.stringify({ message: 'Invalid product ID format' }), {
      status: 400,
    });
  }

  try {
    const client = await clientPromise;
    const db = client.db('next-ecommerce'); 

    const product = await db.collection('products').findOne({ _id: new ObjectId(id) });

    if (product) {
      return new Response(JSON.stringify(product), {
        status: 200,
      });
    } else {
      return new Response(JSON.stringify({ message: 'Product not found' }), {
        status: 404,
      });
    }
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Internal Server Error', error }), {
      status: 500,
    });
  }
}
