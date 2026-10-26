"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FileText,
  Users,
  Megaphone,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  Shield,
  ArrowLeft,
  Settings,
  BookOpen,
  ScrollText,
  UsersRound,
  Ban as BanIcon,
} from "lucide-react";

export default function AdminPanel() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [kontrol, setKontrol] = useState<"bekliyor" | "admin" | "degil">(
    "bekliyor"
  );
  const [istatistikler, setIstatistikler] = useState<any>(null);

  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated") {
      router.push("/giris");
      return;
    }

    if (status === "authenticated" && kontrol === "bekliyor") {
      fetch("/api/admin/kontrol")
        .then((r) => r.json())
        .then((data) => {
          if (data.adminMi) {
            setKontrol("admin");
            fetch("/api/admin/istatistikler")
              .then((r) => r.json())
              .then((ist) => {
                if (ist.istatistikler) {
                  setIstatistikler(ist.istatistikler);
                }
              })
              .catch(() => {});
          } else {
            setKontrol("degil");
          }
        })
        .catch(() => {
          setKontrol("degil");
        });
    }
  }, [status, kontrol, router]);

  if (status === "loading" || kontrol === "bekliyor") {
    return (
      <div className="min-h-screen text-white flex items-center justify-center">
        <div className="text-[#8b8296] text-sm">Yükleniyor...</div>
      </div>
    );
  }

  if (kontrol === "degil") {
    return (
      <div className="min-h-screen text-white flex items-center justify-center px-6">
        <div className="max-w-md w-full p-10 rounded-2xl border border-white/5 bg-[#17111f]/60 backdrop-blur-xl text-center">
          <Shield className="mx-auto text-red-400 mb-6" size={48} />
          <h1 className="text-2xl font-bold text-white mb-3">Yetkiniz Yok</h1>
          <p className="text-[#8b8296] mb-6 text-sm">
            Bu sayfaya erişmek için yönetici olmanız gerekiyor.
          </p>
          <Link
            href="/panel"
            style={{ color: "#0f0a14" }}
            className="inline-block px-5 py-2.5 rounded-lg !bg-[#f0e6d2] hover:!bg-white font-bold transition text-sm"
          >
            Panele Dön
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white">
      {/* BAŞLIK */}
      <section className="relative pt-32 pb-8 px-6">
        <div className="relative max-w-7xl mx-auto">
          <Link
            href="/panel"
            className="inline-flex items-center gap-2 text-[#8b8296] hover:text-white transition mb-6 text-sm"
          >
            <ArrowLeft size={14} />
            Panele Dön
          </Link>

          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
              <Shield className="text-white" size={20} />
            </div>
            <h1
              className="text-3xl md:text-4xl font-black text-white tracking-wide"
              style={{ fontFamily: "var(--font-cinzel)" }}
            >
              ADMIN PANELİ
            </h1>
          </div>
          <p className="text-[#8b8296] text-sm">
            Hoş geldin, {session?.user?.name}
          </p>
        </div>
      </section>

      {/* HIZLI ERİŞİM */}
      <section className="max-w-7xl mx-auto px-6 pb-8 grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          href="/admin/basvurular"
          className="group p-6 rounded-2xl border border-white/5 bg-[#17111f]/60 backdrop-blur-xl hover:border-white/10 hover:bg-[#1f1729]/60 transition"
        >
          <div className="w-11 h-11 mb-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-105 transition">
            <FileText className="text-white" size={20} />
          </div>
          <h3 className="font-semibold text-white mb-1 text-sm">Başvurular</h3>
          <p className="text-[#8b8296] text-xs">
            {istatistikler?.toplam || 0} toplam
          </p>
        </Link>

        <Link
          href="/admin/basvurular/ayarlar"
          className="group p-6 rounded-2xl border border-white/5 bg-[#17111f]/60 backdrop-blur-xl hover:border-white/10 hover:bg-[#1f1729]/60 transition"
        >
          <div className="w-11 h-11 mb-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-105 transition">
            <Settings className="text-white" size={20} />
          </div>
          <h3 className="font-semibold text-white mb-1 text-sm">
            Başvuru Ayarları
          </h3>
          <p className="text-[#8b8296] text-xs">Aç/kapat</p>
        </Link>

        <Link
          href="/admin/kullanicilar"
          className="group p-6 rounded-2xl border border-white/5 bg-[#17111f]/60 backdrop-blur-xl hover:border-white/10 hover:bg-[#1f1729]/60 transition"
        >
          <div className="w-11 h-11 mb-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-105 transition">
            <Users className="text-white" size={20} />
          </div>
          <h3 className="font-semibold text-white mb-1 text-sm">
            Kullanıcılar
          </h3>
          <p className="text-[#8b8296] text-xs">
            {istatistikler?.kullaniciSayisi || 0} kayıtlı
          </p>
        </Link>

        <Link
          href="/admin/duyurular"
          className="group p-6 rounded-2xl border border-white/5 bg-[#17111f]/60 backdrop-blur-xl hover:border-white/10 hover:bg-[#1f1729]/60 transition"
        >
          <div className="w-11 h-11 mb-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-105 transition">
            <Megaphone className="text-white" size={20} />
          </div>
          <h3 className="font-semibold text-white mb-1 text-sm">Duyurular</h3>
          <p className="text-[#8b8296] text-xs">Duyuru gönder</p>
        </Link>
      </section>

      {/* BAN SİSTEMİ */}
      <section className="max-w-7xl mx-auto px-6 pb-8">
        <h2 className="text-lg font-bold text-white mb-5">Ban Sistemi</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/admin/ban"
            className="group p-6 rounded-2xl border border-white/5 bg-[#17111f]/60 backdrop-blur-xl hover:border-white/10 hover:bg-[#1f1729]/60 transition"
          >
            <div className="w-11 h-11 mb-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-105 transition">
              <BanIcon className="text-white" size={20} />
            </div>
            <h3 className="font-semibold text-white mb-1 text-sm">
              Ban Yönetimi
            </h3>
            <p className="text-[#8b8296] text-xs">
              Oyuncu banla ve banları yönet
            </p>
          </Link>
        </div>
      </section>

      {/* İÇERİK YÖNETİMİ */}
      <section className="max-w-7xl mx-auto px-6 pb-8">
        <h2 className="text-lg font-bold text-white mb-5">İçerik Yönetimi</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            href="/admin/icerik/evren-hikayesi"
            className="group p-6 rounded-2xl border border-white/5 bg-[#17111f]/60 backdrop-blur-xl hover:border-white/10 hover:bg-[#1f1729]/60 transition"
          >
            <div className="w-11 h-11 mb-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-105 transition">
              <BookOpen className="text-white" size={20} />
            </div>
            <h3 className="font-semibold text-white mb-1 text-sm">
              Evren Hikayesi
            </h3>
            <p className="text-[#8b8296] text-xs">Hikaye düzenle</p>
          </Link>

          <Link
            href="/admin/icerik/kurallar"
            className="group p-6 rounded-2xl border border-white/5 bg-[#17111f]/60 backdrop-blur-xl hover:border-white/10 hover:bg-[#1f1729]/60 transition"
          >
            <div className="w-11 h-11 mb-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-105 transition">
              <ScrollText className="text-white" size={20} />
            </div>
            <h3 className="font-semibold text-white mb-1 text-sm">Kurallar</h3>
            <p className="text-[#8b8296] text-xs">Kural yönetimi</p>
          </Link>

          <Link
            href="/admin/icerik/ekip"
            className="group p-6 rounded-2xl border border-white/5 bg-[#17111f]/60 backdrop-blur-xl hover:border-white/10 hover:bg-[#1f1729]/60 transition"
          >
            <div className="w-11 h-11 mb-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-105 transition">
              <UsersRound className="text-white" size={20} />
            </div>
            <h3 className="font-semibold text-white mb-1 text-sm">Ekip</h3>
            <p className="text-[#8b8296] text-xs">Ekip yönetimi</p>
          </Link>
        </div>
      </section>

      {/* İSTATİSTİKLER */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
          <TrendingUp size={18} />
          İstatistikler
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="p-6 rounded-2xl border border-white/5 bg-[#17111f]/60 backdrop-blur-xl">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="text-white" size={16} />
              <p className="text-[#8b8296] text-xs">Toplam</p>
            </div>
            <p className="text-3xl font-bold text-white">
              {istatistikler?.toplam || 0}
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-white/5 bg-[#17111f]/60 backdrop-blur-xl">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="text-yellow-400" size={16} />
              <p className="text-[#8b8296] text-xs">Beklemede</p>
            </div>
            <p className="text-3xl font-bold text-yellow-400">
              {istatistikler?.beklemede || 0}
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-white/5 bg-[#17111f]/60 backdrop-blur-xl">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 className="text-green-400" size={16} />
              <p className="text-[#8b8296] text-xs">Onaylanan</p>
            </div>
            <p className="text-3xl font-bold text-green-400">
              {istatistikler?.onaylandi || 0}
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-white/5 bg-[#17111f]/60 backdrop-blur-xl">
            <div className="flex items-center gap-2 mb-3">
              <XCircle className="text-red-400" size={16} />
              <p className="text-[#8b8296] text-xs">Reddedilen</p>
            </div>
            <p className="text-3xl font-bold text-red-400">
              {istatistikler?.reddedildi || 0}
            </p>
          </div>
        </div>

        <div className="p-6 rounded-2xl border border-white/5 bg-[#17111f]/60 backdrop-blur-xl">
          <h3 className="text-sm font-semibold text-white mb-5">
            Başvuru Türleri
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-white">
                {istatistikler?.turler?.whitelist || 0}
              </p>
              <p className="text-[#6b6276] text-xs mt-1">Whitelist</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-white">
                {istatistikler?.turler?.seherbaz || 0}
              </p>
              <p className="text-[#6b6276] text-xs mt-1">Seherbaz</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-white">
                {istatistikler?.turler?.bakanlik || 0}
              </p>
              <p className="text-[#6b6276] text-xs mt-1">Bakanlık</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-white">
                {istatistikler?.turler?.profesor || 0}
              </p>
              <p className="text-[#6b6276] text-xs mt-1">Profesör</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-white">
                {istatistikler?.turler?.olumYiyen || 0}
              </p>
              <p className="text-[#6b6276] text-xs mt-1">Ölüm Yiyen</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}