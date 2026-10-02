type StoreMapProps = {
  lat?: number | string;
  lng?: number | string;
  title?: string;
  className?: string;
  tone?: "dark" | "light";
};

export default function StoreMap({
  lat,
  lng,
  title = "موقعیت فروشگاه",
  className = "",
  tone = "dark",
}: StoreMapProps) {
  const latitude = Number(lat);
  const longitude = Number(lng);

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return null;
  }

  const delta = 0.012;
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${longitude - delta}%2C${latitude - delta}%2C${longitude + delta}%2C${latitude + delta}&layer=mapnik&marker=${latitude}%2C${longitude}`;
  const openHref = `https://www.google.com/maps?q=${latitude},${longitude}`;

  return (
    <div className={className}>
      <iframe
        title={title}
        src={src}
        className="h-48 w-full rounded-lg border-0 bg-neutral-100"
        loading="lazy"
      />
      <a
        href={openHref}
        target="_blank"
        rel="noopener noreferrer"
        className={`mt-2 inline-block text-xs underline underline-offset-4 ${
          tone === "light"
            ? "text-neutral-600 hover:text-black"
            : "text-white/70 hover:text-white"
        }`}
      >
        مشاهده در نقشه
      </a>
    </div>
  );
}
