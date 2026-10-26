import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Evren Hikayesi — Loxford Roleplay",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}