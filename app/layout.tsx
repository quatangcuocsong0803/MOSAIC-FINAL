import "./globals.css";
import DisplayPreferences from "@/src/components/settings/DisplayPreferences";
import { Suspense } from "react";
import NavigationFeedback from "@/src/components/navigation/NavigationFeedback";
import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import "@fontsource-variable/playfair-display";
import "@fontsource/cinzel/400.css";
import "@fontsource/cinzel/500.css";
import "@fontsource/cinzel/600.css";
import "@fontsource/cinzel/700.css";
import "@fontsource/cinzel/800.css";
import "@fontsource/cinzel/900.css";
import "@fontsource/cormorant-garamond/400.css";
import "@fontsource/cormorant-garamond/500.css";
import "@fontsource/cormorant-garamond/600.css";
import "@fontsource/cormorant-garamond/400-italic.css";
import "@fontsource/cormorant-garamond/600-italic.css";
import "@fontsource/cormorant-garamond/500-italic.css";
import "@fontsource/cormorant-garamond/700.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import RememberReturn from "@/src/components/auth/RememberReturn";
import Navbar from "@/src/components/Navbar";
import ProfileOnboardingModal from "@/src/components/ProfileOnboardingModal";

export const metadata: Metadata = {
  title: "MOSAIC",
  description:
    "A personality typology platform for self-exploration in antique grimoire style.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      signInFallbackRedirectUrl="/"
      signUpFallbackRedirectUrl="/"
    >
      <html lang="vi" className="bg-[#FCFBF8]">
        <body
          className={`bg-transparent min-h-screen selection:bg-[#E2D4B7] selection:text-[#5C4326] antialiased font-sans text-gray-800 relative isolate`}
        >
          {/* Lớp nền trang trí cổ điển (Background Decor) */}
          <div className="mosaic-background fixed inset-0 z-[-1] pointer-events-none overflow-hidden bg-[#FAF6F0]">
            {/* Đám mây - Giữa trên cùng */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/cloud.jpg"
              alt="Cloud"
              className="absolute top-0 left-1/2 -translate-x-1/2 w-[450px] md:w-[800px] opacity-15"
              style={{
                mixBlendMode: "multiply",
                filter: "sepia(40%) opacity(0.8)",
              }}
            />

            {/* Mặt trời - Góc trên cùng bên phải (Đã hạ thấp) */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/sun.jpg"
              alt="Sun"
              className="absolute top-20 md:top-24 right-0 w-[200px] md:w-[300px] opacity-15 translate-x-12"
              style={{
                mixBlendMode: "multiply",
                filter: "sepia(60%) saturate(150%)",
              }}
            />

            {/* Vải ren che - Góc trái trên cùng (Đã thu nhỏ) */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/lace.jpg"
              alt="Lace Decor"
              className="absolute top-0 left-0 w-[250px] md:w-[400px] opacity-15 -translate-x-8 -translate-y-8"
              style={{ mixBlendMode: "multiply", filter: "sepia(30%)" }}
            />

            {/* Chim 1 - Di chuyển sang giữa bên phải */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/bird-1.jpg"
              alt="Bird"
              className="absolute top-[40%] right-8 md:right-32 w-[100px] md:w-[150px] opacity-20"
              style={{
                mixBlendMode: "multiply",
                filter: "sepia(40%) contrast(110%)",
              }}
            />

            {/* Chim 2 - Hạ thấp xuống dưới một chút */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/bird-2.jpg"
              alt="Bird with Rose"
              className="absolute top-[75%] left-0 -translate-y-1/2 translate-x-8 w-[120px] md:w-[180px] opacity-20"
              style={{
                mixBlendMode: "multiply",
                filter: "sepia(40%) contrast(110%)",
              }}
            />

            {/* Mặt trăng - Góc dưới cùng bên phải (Đã được thu nhỏ) */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/moon.jpg"
              alt="Vintage Moon"
              className="absolute bottom-0 right-0 w-[150px] md:w-[250px] opacity-15 translate-x-8 translate-y-8"
              style={{
                mixBlendMode: "multiply",
                filter: "sepia(30%) saturate(120%) brightness(95%)",
              }}
            />
          </div>

          <DisplayPreferences />
          <Suspense fallback={null}>
            <NavigationFeedback />
          </Suspense>
          <RememberReturn />
          <Navbar />
          <ProfileOnboardingModal />
          <main className="w-full flex flex-col items-center relative z-10 bg-transparent">
            {children}
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}
