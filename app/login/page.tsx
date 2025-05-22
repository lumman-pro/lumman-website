import type { Metadata } from "next";
import { Suspense } from "react";
import LoginPageClient from "./login-page-client";

export const metadata: Metadata = {
  title: "Login | Lumman.ai",
  description: "Sign in to your Lumman account",
};

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          Loading...
        </div>
      }
    >
      <LoginPageClient />
    </Suspense>
  );
}
