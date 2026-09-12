"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[500px] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <p className="text-sm font-medium text-neutral-500">
          خطایی رخ داده است
        </p>

        <h1 className="mt-3 text-3xl font-bold">
          اتصال به فروشگاه برقرار نشد
        </h1>

        <p className="mt-4 leading-7 text-neutral-500">
          در دریافت اطلاعات فروشگاه مشکلی پیش آمده.
          لطفاً دوباره تلاش کنید.
        </p>

        <button
          type="button"
          onClick={() => reset()}
          className="mt-8 rounded-lg bg-black px-6 py-3 font-medium text-white transition hover:bg-neutral-800"
        >
          تلاش مجدد
        </button>
      </div>
    </div>
  );
}
