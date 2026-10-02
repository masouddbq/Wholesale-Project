import ProductCard, {
  type HomeProductCardData,
} from "@/components/ProductCard";
import HorizontalScroller from "@/components/HorizontalScroller";

export default function ProductRail({
  products,
}: {
  products: HomeProductCardData[];
}) {
  return (
    <div className="home-rail-shadow rounded-lg">
      <HorizontalScroller className="flex gap-3 overflow-x-auto overflow-y-hidden pb-1">
        {products.map((product) => (
          <div key={product._id} className="w-[53%] shrink-0">
            <ProductCard product={product} />
          </div>
        ))}
      </HorizontalScroller>
    </div>
  );
}
