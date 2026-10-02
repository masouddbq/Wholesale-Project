const getApiBase = () => {
  const publicUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!publicUrl || publicUrl === "same") {
    return "";
  }

  return publicUrl.replace(/\/$/, "");
};

export const API_BASE = getApiBase();
