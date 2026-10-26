"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  LogOut,
  Coins,
  FileText,
  User,
  Settings,
  Shield,
  Crown,
  Swords,
  Sparkles,
  Wand2,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react";

const rolBilgileri: Record<string, { ikon: any; renk: string; label: string }> = {
  kurucu: { ikon: Crown, renk: "text-red-400", label: "Kurucu" },
  "baş admin": { ikon: Swords, renk: "text-orange-400", label: "Baş Admin" },
  admin: { ikon: Shield, renk: "text-blue-400", label: "Admin" },
  moderatör: { ikon: Sparkles, renk: "text-green-400", label: "Moderatör" },
  yetkili: { ikon: Wand2, renk: "text-purple-400", label: "Yetkili" },
};

export default function Panel() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [adminMi, setAdminMi] = useState(false);
  const [adminBilgi, setAdminBilgi] = useState<any>(null);
  const [istatistikler, setIstatistikler] = useState<any>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/giris");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/admin/kontrol")
        .then((r) => r.json())
        .then((data) => {
          if (data.adminMi) {
            setAdminMi(true);
            setAdminBilgi(data.bilgi);
            fetch("/api/admin/istatistikler")
              .then((r) => r.json())
              .then((ist) => {
                if (ist.istatistikler) setIstatistikler(ist.istatistikler);
              })
              .catch(() => {});
          }
        })
        .catch(() => {});
    }
  }, [status]);

  if (status === "loading") {
    return (
      <div className="min-h-screen text-white flex items-center justify-center">
        <div className="text-[#8b8296] text-sm">Yükleniyor...</div>
      </div>
    );
  }

  if (!session) return null;

  const rol = adminBilgi?.rol?.toLowerCase().trim() || "";
  const rolBilgi = rolBilgileri[rol] || null;
  const RolIkon = rolBilgi?.ikon;

  return (
    <div className="min-h-screen text-white">
      {/* PROFİL KARTI */}
      <section className="relative pt-32 pb-10 px-6">
        <div className="relative max-w-4xl mx-auto">
          <div className="p-6 rounded-2xl border border-white/5 bg-[#17111f]/60 backdrop-blur-xl">
            <div className="flex items-center gap-5 flex-wrap">
              {session.user?.image && (
                <div className="w-16 h-16 rounded-xl overflow-hidden border border-white/10">
                  <Image
                    src={session.user.image}
                    alt={session.user.name || "Kullanıcı"}
                    width={64}
                    height={64}
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1
                    className="text-2xl font-bold text-white tracking-wide"
                    style={{ fontFamily: "var(--font-cinzel)" }}
                  >
                    {session.user?.name}
                  </h1>
                  {rolBilgi && RolIkon && (
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium border border-white/10 bg-white/5 ${rolBilgi.renk} flex items-center gap-1`}
                    >
                      <RolIkon size={11} />
                      {rolBilgi.label}
                    </span>
                  )}
                </div>
                <p className="text-[#8b8296] text-sm mt-1 truncate">
                  {session.user?.email}
                </p>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="px-4 py-2 rounded-lg border border-white/10 text-[#d97777] hover:bg-white/5 transition flex items-center gap-2 text-sm"
              >
                <LogOut size={14} />
                Çıkış Yap
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* KARTLAR */}
      <section className="max-w-4xl mx-auto px-6 pb-8 grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          href="/basvuru"
          className="group p-6 rounded-2xl border border-white/5 bg-[#17111f]/60 backdrop-blur-xl hover:border-white/10 hover:bg-[#1f1729]/60 transition"
        >
          <div className="w-11 h-11 mb-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-105 transition">
            <FileText className="text-white" size={20} />
          </div>
          <h3 className="font-semibold text-white mb-1 text-sm">Başvurular</h3>
          <p className="text-[#8b8296] text-xs">Başvuru yap ve takip et</p>
        </Link>

        <div className="p-6 rounded-2xl border border-white/5 bg-[#17111f]/60 backdrop-blur-xl">
          <div className="w-11 h-11 mb-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
            <Coins className="text-white" size={20} />
          </div>
          <h3 className="font-semibold text-white mb-1 text-sm">
            Coin Bakiyesi
          </h3>
          <p className="text-[#8b8296] text-xs">
            <span className="text-white font-semibold">0</span> coin
          </p>
        </div>

        <div className="p-6 rounded-2xl border border-white/5 bg-[#17111f]/60 backdrop-blur-xl">
          <div className="w-11 h-11 mb-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
            <User className="text-white" size={20} />
          </div>
          <h3 className="font-semibold text-white mb-1 text-sm">Karakter</h3>
          <p className="text-[#8b8296] text-xs">Henüz karakter yok</p>
        </div>

        <Link
          href="/panel/ayarlar"
          className="group p-6 rounded-2xl border border-white/5 bg-[#17111f]/60 backdrop-blur-xl hover:border-white/10 hover:bg-[#1f1729]/60 transition"
        >
          <div className="w-11 h-11 mb-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-105 transition">
            <Settings className="text-white" size={20} />
          </div>
          <h3 className="font-semibold text-white mb-1 text-sm">Ayarlar</h3>
          <p className="text-[#8b8296] text-xs">Hesap ayarları</p>
        </Link>
      </section>

      {/* ADMİN BÖLÜMÜ */}
      {adminMi && (
        <section className="max-w-4xl mx-auto px-6 pb-8">
          <div className="p-6 rounded-2xl border border-white/5 bg-[#17111f]/60 backdrop-blur-xl">
            <div className="flex items-center justify-between gap-4 flex-wrap mb-6">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <Shield className="text-white" size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">
                    Yönetici Paneli
                  </h2>
                  <p className="text-[#8b8296] text-xs">Yetkili işlemleri</p>
                </div>
              </div>
              <Link
                href="/admin"
                style={{ color: "#0f0a14" }}
                className="px-5 py-2.5 rounded-lg !bg-[#f0e6d2] hover:!bg-white font-bold transition text-sm"
              >
                Admin Paneline Git →
              </Link>
            </div>

            {istatistikler && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02] text-center">
                  <FileText className="mx-auto text-white mb-2" size={18} />
                  <p className="text-2xl font-bold text-white">
                    {istatistikler.toplam}
                  </p>
                  <p className="text-[#6b6276] text-xs">Toplam</p>
                </div>

                <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02] text-center">
                  <Clock className="mx-auto text-yellow-400 mb-2" size={18} />
                  <p className="text-2xl font-bold text-yellow-400">
                    {istatistikler.beklemede}
                  </p>
                  <p className="text-[#6b6276] text-xs">Beklemede</p>
                </div>

                <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02] text-center">
                  <CheckCircle2
                    className="mx-auto text-green-400 mb-2"
                    size={18}
                  />
                  <p className="text-2xl font-bold text-green-400">
                    {istatistikler.onaylandi}
                  </p>
                  <p className="text-[#6b6276] text-xs">Onaylanan</p>
                </div>

                <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02] text-center">
                  <XCircle className="mx-auto text-red-400 mb-2" size={18} />
                  <p className="text-2xl font-bold text-red-400">
                    {istatistikler.reddedildi}
                  </p>
                  <p className="text-[#6b6276] text-xs">Reddedilen</p>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* HOŞ GELDİN */}
      <section className="max-w-4xl mx-auto px-6 pb-20">
        <div className="p-8 rounded-2xl border border-white/5 bg-[#17111f]/60 backdrop-blur-xl">
          <h2
            className="text-xl font-bold text-white mb-4 tracking-wide"
            style={{ fontFamily: "var(--font-cinzel)" }}
          >
            Hoş Geldin, {session.user?.name?.split(" ")[0]}
          </h2>
          <p className="text-[#8b8296] leading-relaxed text-sm">
            Loxford Roleplay paneline hoş geldin. Buradan başvuru yapabilir,
            karakter oluşturabilir ve sunucu içi ilerlemeni takip edebilirsin.
            Herhangi bir sorun için Discord sunucumuzdan yetkililere
            ulaşabilirsin.
          </p>
        </div>
      </section>
    </div>
  );
}