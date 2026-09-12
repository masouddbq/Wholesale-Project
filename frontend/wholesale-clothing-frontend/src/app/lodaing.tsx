export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16">
      <div className="animate-pulse">
        {/* Hero skeleton */}
        <div className="mb-16 h-[400px] rounded-2xl bg-neutral-200" />

        {/* Categories */}
        <div className="mb-16">
          <div className="mb-8 h-8 w-48 rounded bg-neutral-200" />

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-32 rounded-2xl bg-neutral-200"
              />
            ))}
          </div>
        </div>

        {/* Products */}
        <div>
          <div className="mb-8 h-8 w-48 rounded bg-neutral-200" />

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-2xl border border-neutral-200"
              >
                <div className="aspect-square bg-neutral-200" />

                <div className="space-y-3 p-4">
                  <div className="h-5 w-3/4 rounded bg-neutral-200" />
                  <div className="h-4 w-1/2 rounded bg-neutral-200" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

