// تغییر جدید: اسکلتون لودینگ با افکت shimmer
export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="animate-pulse">
        <div className="mb-4 h-5 w-32 rounded bg-neutral-200" />

        <div className="mb-4 h-10 w-48 rounded bg-neutral-200" />

        <div className="mb-10 h-5 w-96 max-w-full rounded bg-neutral-200" />

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-2xl border border-neutral-200"
            >
              <div className="skeleton-shimmer aspect-square bg-neutral-200" />

              <div className="space-y-3 p-4">
                <div className="h-5 w-3/4 rounded bg-neutral-200" />
                <div className="h-4 w-1/2 rounded bg-neutral-200" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
