export const SOCIAL_PLATFORMS = [
  { id: "instagram", label: "اینستاگرام" },
  { id: "telegram", label: "تلگرام" },
  { id: "whatsapp", label: "واتساپ" },
  { id: "eitaa", label: "ایتا" },
  { id: "rubika", label: "روبیکا" },
] as const;

export type SocialPlatformId = (typeof SOCIAL_PLATFORMS)[number]["id"];

export type FooterSocial = {
  platform: SocialPlatformId;
  url: string;
  icon?: string;
};

export type FooterContent = {
  socials: FooterSocial[];
  showEnamad: boolean;
  mapLat: string;
  mapLng: string;
  mapAddress: string;
};

export const defaultFooterContent = (): FooterContent => ({
  socials: SOCIAL_PLATFORMS.map((item) => ({
    platform: item.id,
    url: "",
    icon: "",
  })),
  showEnamad: true,
  mapLat: "",
  mapLng: "",
  mapAddress: "",
});

export const parseFooterContent = (data: Record<string, any> = {}): FooterContent => {
  const fallback = defaultFooterContent();

  return {
    socials: Array.isArray(data.socials)
      ? fallback.socials.map((item, index) => ({
          platform: data.socials[index]?.platform || item.platform,
          url: data.socials[index]?.url || "",
          icon: data.socials[index]?.icon || "",
        }))
      : fallback.socials,
    showEnamad: data.showEnamad !== false,
    mapLat: typeof data.mapLat === "string" || typeof data.mapLat === "number"
      ? String(data.mapLat)
      : fallback.mapLat,
    mapLng: typeof data.mapLng === "string" || typeof data.mapLng === "number"
      ? String(data.mapLng)
      : fallback.mapLng,
    mapAddress:
      typeof data.mapAddress === "string" ? data.mapAddress : fallback.mapAddress,
  };
};
