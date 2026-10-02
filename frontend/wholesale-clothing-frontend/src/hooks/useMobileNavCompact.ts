"use client";

import { useEffect, useState } from "react";

export default function useMobileNavCompact() {
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const update = () => {
      const isMobile = window.matchMedia("(max-width: 767px)").matches;
      setCompact(isMobile && window.scrollY > 16);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return compact;
}
