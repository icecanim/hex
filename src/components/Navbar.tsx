"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { Menu, X, User, LogOut, LayoutDashboard } from "lucide-react";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { data: session, status } = useSession();

  const links = [
    { href: "/", label: "Ana Sayfa" },
    { href: "/evren-hikayesi", label: "Evren Hikayesi" },
    { href: "/kurallar", label: "Kurallar" },
    { href: "/ekip", label: "Ekip" },
    { href: "/duyurular", label: "Duyurular" },
    { href: "/basvuru", label: "Başvuru" },
  ];

  const cikisYap = () => {
    setUserMenuOpen(false);
    setMobileOpen(false);
    signOut({ callbackUrl: "/" });
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#0f0a14]/80 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-lg overflow-hidden flex items-center justify-center">
            <Image
              src="/loxford-logo.png"
              alt="Loxford"
              width={36}
              height={36}
              className="object-contain"
            />
          </div>
          <span
            className="text-lg font-bold tracking-wider text-white"
            style={{ fontFamily: "var(--font-cinzel)" }}
          >
            LOXFORD
          </span>
        </Link>

        <div className="hidden lg:flex items-center gap-1 text-sm">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-3 py-2 text-[#8b8296] hover:text-white transition rounded-lg hover:bg-white/5"
            >
              {link.label}
            </Link>
          ))}

          {status === "authenticated" && session?.user ? (
            <div className="relative ml-2">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg border border-white/10 text-white hover:bg-white/5 transition"
              >
                {session.user.image && (
                  <Image
                    src={session.user.image}
                    alt={session.user.name || "Kullanıcı"}
                    width={22}
                    height={22}
                    className="rounded-full"
                  />
                )}
                <span className="font-medium">
                  {session.user.name?.split(" ")[0]}
                </span>
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl border border-white/10 bg-[#17111f] shadow-2xl overflow-hidden">
                  <Link
                    href="/panel"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-3 text-[#8b8296] hover:bg-white/5 hover:text-white transition"
                  >
                    <LayoutDashboard size={16} />
                    Panel
                  </Link>
                  <Link
                    href="/panel/ayarlar"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-3 text-[#8b8296] hover:bg-white/5 hover:text-white transition border-t border-white/5"
                  >
                    <User size={16} />
                    Ayarlar
                  </Link>
                  <button
                    onClick={cikisYap}
                    className="w-full flex items-center gap-2 px-4 py-3 text-[#d97777] hover:bg-white/5 transition border-t border-white/5"
                  >
                    <LogOut size={16} />
                    Çıkış Yap
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/giris"
              style={{ color: "#0f0a14" }}
              className="ml-2 px-4 py-2 rounded-lg !bg-[#f0e6d2] hover:!bg-white font-bold transition"
            >
              Giriş Yap
            </Link>
          )}
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden text-white p-2"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="lg:hidden bg-[#0f0a14]/98 backdrop-blur-xl border-t border-white/5 px-6 py-4 space-y-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-3 text-[#8b8296] hover:text-white transition rounded-lg hover:bg-white/5"
            >
              {link.label}
            </Link>
          ))}

          <div className="pt-3 border-t border-white/5 space-y-2">
            {status === "authenticated" && session?.user ? (
              <>
                <div className="flex items-center gap-3 px-3 py-2">
                  {session.user.image && (
                    <Image
                      src={session.user.image}
                      alt={session.user.name || "Kullanıcı"}
                      width={36}
                      height={36}
                      className="rounded-full"
                    />
                  )}
                  <div>
                    <p className="text-white font-medium text-sm">
                      {session.user.name}
                    </p>
                    <p className="text-[#6b6276] text-xs">
                      {session.user.email}
                    </p>
                  </div>
                </div>
                <Link
                  href="/panel"
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2 rounded-lg text-[#8b8296] hover:text-white text-center border border-white/10"
                >
                  Panel
                </Link>
                <button
                  onClick={cikisYap}
                  className="w-full px-3 py-2 rounded-lg text-[#d97777] text-center border border-white/10"
                >
                  Çıkış Yap
                </button>
              </>
            ) : (
              <Link
                href="/giris"
                onClick={() => setMobileOpen(false)}
                style={{ color: "#0f0a14" }}
                className="block px-4 py-2 rounded-lg !bg-[#f0e6d2] font-bold text-center"
              >
                Giriş Yap
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}