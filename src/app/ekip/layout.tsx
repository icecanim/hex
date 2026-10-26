import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ekibimiz — Loxford Roleplay",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}