import apiClient from "@/lib/appClient";

export type SiteContent = {
  _id: string;
  key: string;
  data: Record<string, any>;
  createdAt: string;
  updatedAt: string;
};

export type SiteContentsResponse = {
  contents: SiteContent[];
};

export const getSiteContents = async () => {
  const response =
    await apiClient.get<SiteContentsResponse>(
      "/site-content"
    );

  return response.data;
};

export const getSiteContent = async (
  key: string
) => {
  const response = await apiClient.get<{
    content: SiteContent;
  }>(`/site-content/${key}`);

  return response.data;
};

export const updateSiteContent = async (
  key: string,
  data: Record<string, any>
) => {
  const response = await apiClient.put<{
    message: string;
    content: SiteContent;
  }>(`/site-content/${key}`, data);

  return response.data;
};

export const PAGE_CONTENT_FALLBACKS: Record<
  string,
  { title: string; content: string }
> = {
  about: {
    title: "درباره AM-Clothing",
    content:
      "فروشگاه عمده پوشاک AM-Clothing برای خرید عمده لباس راه‌اندازی شده است.\n\nما مجموعه‌ای از محصولات را با حداقل سفارش عمده در اختیار فروشندگان و خرده‌فروشان قرار می‌دهیم.\n\nبرای ثبت سفارش می‌توانید از سایت استفاده کنید یا از طریق اطلاعات تماس فروشگاه با ما در ارتباط باشید.",
  },
  terms: {
    title: "قوانین و شرایط سفارش",
    content:
      "ثبت سفارش در این فروشگاه به معنای پذیرش شرایط زیر است.\n\nحداقل تعداد سفارش هر محصول روی صفحه همان کالا مشخص شده است.\nسفارش پس از ثبت بررسی می‌شود و وضعیت آن از طریق حساب کاربری قابل مشاهده است.\nپرداخت و هماهنگی ارسال پس از تأیید سفارش با شما انجام می‌شود.\nدر صورت لغو سفارش از سوی فروشگاه، موجودی کالا در صورت نیاز به انبار برمی‌گردد.",
  },
  "wholesale-guide": {
    title: "راهنمای خرید عمده",
    content:
      "برای خرید عمده، محصول را انتخاب کنید، سایز و رنگ مورد نظر را مشخص کنید و تعداد را با توجه به حداقل سفارش وارد سبد کنید.\n\nپس از تکمیل سبد وارد صفحه تسویه شوید و اطلاعات گیرنده را وارد کنید. ورود به حساب کاربری اجباری نیست، اما با حساب کاربری می‌توانید سفارش‌های قبلی را ببینید.\n\nپس از ثبت سفارش، تیم فروش برای هماهنگی با شما تماس می‌گیرد.",
  },
  contact: {
    title: "ارتباط با ما",
    content:
      "برای هماهنگی سفارش عمده، سوال درباره موجودی یا پیگیری ارسال می‌توانید از طریق تلفن با فروشگاه در ارتباط باشید.\n\nشماره تماس: ۰۹۳۶۶۷۷۶۵۱۹\n\nموقعیت فروشگاه روی نقشه پایین صفحه نمایش داده می‌شود.",
  },
};

export const getPageContent = async (key: string) => {
  const fallback =
    PAGE_CONTENT_FALLBACKS[key] || {
      title: "محتوا",
      content: "این بخش هنوز تکمیل نشده است.",
    };

  try {
    const { content } = await getSiteContent(key);
    const data = content.data || {};

    return {
      title:
        typeof data.title === "string" && data.title.trim()
          ? data.title
          : fallback.title,
      content:
        typeof data.content === "string" && data.content.trim()
          ? data.content
          : fallback.content,
    };
  } catch {
    return fallback;
  }
};