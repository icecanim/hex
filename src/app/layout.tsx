import type { Metadata } from "next";
import { Inter, Cinzel } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AuthProvider from "@/components/AuthProvider";
import ClientWrapper from "@/components/ClientWrapper";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  weight: ["400", "700", "900"],
});

export const metadata: Metadata = {
  title: "Loxford Roleplay",
  description: "Loxford Roleplay - Büyücülük dünyasının kapıları açılıyor.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body
        className={`${inter.variable} ${cinzel.variable} text-white antialiased min-h-screen`}
        style={{
          backgroundImage: "url('/hogwarts-bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
          backgroundRepeat: "no-repeat",
          position: "relative",
        }}
      >
        {/* Karartma katmanı - position absolute, içeriğin altında */}
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(15, 10, 20, 0.75)",
            zIndex: 0,
            pointerEvents: "none",
          }}
        />

        {/* İçerik - z-index yüksek */}
        <div style={{ position: "relative", zIndex: 1 }}>
          <AuthProvider>
            <ClientWrapper>
              <Navbar />
              <main className="pt-16">{children}</main>
              <Footer />
            </ClientWrapper>
          </AuthProvider>
        </div>
      </body>
    </html>
  );
}