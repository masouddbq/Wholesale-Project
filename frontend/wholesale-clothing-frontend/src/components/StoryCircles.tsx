import Link from "next/link";
import { API_BASE } from "@/lib/imageUrl";
import { storyHref, type HomeStory } from "@/lib/homeStories";

type StoryCirclesProps = {
  stories: HomeStory[];
  placement: "mobile" | "desktop";
};

export default function StoryCircles({
  stories,
  placement,
}: StoryCirclesProps) {
  if (!stories.length) {
    return null;
  }

  const isMobile = placement === "mobile";

  return (
    <div
      className={
        isMobile
          ? "mb-4 md:hidden"
          : "hidden bg-transparent md:block"
      }
    >
      <div
        className={
          isMobile
            ? "home-h-scroll overflow-x-auto pb-1"
            : "mx-auto max-w-7xl px-4 pb-0 pt-4 sm:px-6 lg:px-8"
        }
      >
        <div
          className={
            isMobile
              ? "mx-auto flex w-max justify-center gap-3 px-1"
              : "flex w-full flex-wrap items-start justify-center gap-x-3 gap-y-4"
          }
        >
          {stories.map((story) => (
            <Link
              key={story.id}
              href={storyHref(story)}
              className="flex w-[76px] shrink-0 flex-col items-center sm:w-[88px]"
            >
              <span
                className="flex h-[72px] w-[72px] items-center justify-center rounded-full border-2 border-neutral-400/50 bg-white/25 p-[3px] shadow-[0_4px_14px_rgba(163,163,163,0.28)] backdrop-blur-sm sm:h-20 sm:w-20"
              >
                <span className="flex h-full w-full overflow-hidden rounded-full border-2 border-white/50 bg-neutral-100">
                  <img
                    src={`${API_BASE}${story.image}`}
                    alt={story.title}
                    className="h-full w-full object-cover"
                  />
                </span>
              </span>
              <span className="mt-2 line-clamp-2 w-full text-center text-[11px] font-medium leading-4 text-[var(--text-primary)] sm:text-xs">
                {story.title}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
