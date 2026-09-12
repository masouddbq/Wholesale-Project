import { getCategories } from "@/services/categoryService";

export default async function Home() {
  const data = await getCategories();

  return (
    <main>
      <h1>Categories</h1>

      <pre>
        {JSON.stringify(data, null, 2)}
      </pre>
    </main>
  );
}