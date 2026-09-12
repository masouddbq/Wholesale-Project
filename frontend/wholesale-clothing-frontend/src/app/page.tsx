import { getProducts } from "@/services/productService";

export default async function Home() {
  const data = await getProducts();

  return (
    <main>
      <h1>Products</h1>

      <pre>
        {JSON.stringify(data, null, 2)}
      </pre>
    </main>
  );
}