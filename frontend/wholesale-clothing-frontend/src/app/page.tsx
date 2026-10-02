import HeroSection from "@/components/HeroSection";
import CategorySection from "@/components/CategorySection";
import ProductSection from "@/components/ProductSection";
import SearchBar from "@/components/SearchBar";
import StoryCircles from "@/components/StoryCircles";
import HomeCategorySliders from "@/components/HomeCategorySliders";
import { loadHomeStories } from "@/lib/homeStories";

export default async function Home() {
  const stories = await loadHomeStories();

  return (
    <div className="flex flex-col">
      <div className="order-1">
        <StoryCircles stories={stories} placement="desktop" />
        <HeroSection stories={stories} />
      </div>

      <div className="order-3 md:order-2">
        <CategorySection />
      </div>

      <div className="order-2 md:order-3">
        <SearchBar />
      </div>

      <div className="order-4">
        <ProductSection />
      </div>

      <div className="order-5">
        <HomeCategorySliders />
      </div>
    </div>
  );
}