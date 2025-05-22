import type React from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background transition-colors duration-300 ease-in-out">
      <Header />
      <main className="flex-1 transition-colors duration-300 ease-in-out py-12 md:py-24">
        {children}
      </main>
      <Footer />
    </div>
  );
}
