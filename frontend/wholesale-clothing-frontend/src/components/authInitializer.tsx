"use client";

import { useEffect } from "react";
import { checkAuth } from "@/lib/auth";

export default function AuthInitializer() {
  useEffect(() => {
    checkAuth();
  }, []);

  return null;
}