"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/lib/axios";

function OAuthSuccess() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const token = params.get("token");
    if (!token) return router.replace("/login");

    localStorage.setItem("token", token);

    api.get("/auth/me").then((res) => {
      localStorage.setItem("user", JSON.stringify(res.data.user));
      window.dispatchEvent(new Event("auth-change"));
      router.replace("/");
    });
  }, [params, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      Logging you in...
    </div>
  );
}

export default function OAuthSuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OAuthSuccess />
    </Suspense>
  );
}
