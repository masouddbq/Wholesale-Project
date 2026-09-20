import HeroSection from "@/components/HeroSection";
import CategorySection from "@/components/CategorySection";
import ProductSection from "@/components/ProductSection";
import SearchBar from "@/components/SearchBar";

export default function Home() {
  return (
    <div>
      <HeroSection />

      <SearchBar />

      <CategorySection />

      <ProductSection />
    </div>
  );
}