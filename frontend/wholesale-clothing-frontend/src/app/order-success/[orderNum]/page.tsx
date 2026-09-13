import Link from "next/link";

type OrderSuccessPageProps = {
  params: Promise<{
    orderNum: string;
  }>;
};

export default async function OrderSuccessPage({
  params,
}: OrderSuccessPageProps) {
  const { orderNum } = await params;

  return (
    <div className="mx-auto flex min-h-[650px] max-w-7xl items-center justify-center px-4 py-16">
      <div className="w-full max-w-xl rounded-3xl border border-neutral-200 bg-white p-8 text-center shadow-sm md:p-12">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-4xl text-green-600">
          ✓
        </div>

        <p className="mt-8 text-sm font-medium text-green-600">
          سفارش با موفقیت ثبت شد
        </p>

        <h1 className="mt-3 text-3xl font-bold md:text-4xl">
          ممنون از ثبت سفارش شما
        </h1>

        <p className="mx-auto mt-5 max-w-md leading-8 text-neutral-500">
          سفارش شما با موفقیت ثبت شده است.
          کارشناسان ما برای هماهنگی و ادامه مراحل
          سفارش با شما تماس خواهند گرفت.
        </p>

        <div className="mt-8 rounded-2xl bg-neutral-50 p-5">
          <p className="text-sm text-neutral-500">
            شماره سفارش
          </p>

          <p
            dir="ltr"
            className="mt-2 text-xl font-bold tracking-wide"
          >
            {orderNum}
          </p>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <Link
            href="/account/orders"
            className="rounded-xl bg-black px-6 py-3.5 font-medium text-white transition hover:bg-neutral-800"
          >
            مشاهده سفارش‌های من
          </Link>

          <Link
            href="/products"
            className="rounded-xl border border-neutral-300 px-6 py-3.5 font-medium transition hover:bg-neutral-50"
          >
            ادامه خرید
          </Link>
        </div>

        <Link
          href="/"
          className="mt-6 inline-block text-sm text-neutral-500 underline underline-offset-4 transition hover:text-black"
        >
          بازگشت به صفحه اصلی
        </Link>
      </div>
    </div>
  );
}