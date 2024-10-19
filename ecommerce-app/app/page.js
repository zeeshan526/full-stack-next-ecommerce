import clientPromise from './lib/mongodb'; // MongoDB connection
import FeaturedProductsPage from './components/FeaturedProducts'; 

export default async function Home() {
  // Fetch products from MongoDB
  const client = await clientPromise;
  const db = client.db('next-ecommerce');
  const products = await db.collection('products').find({}).toArray();

  return (
    <div>
      <FeaturedProductsPage products={JSON.parse(JSON.stringify(products))} />
    </div>
  );
}
