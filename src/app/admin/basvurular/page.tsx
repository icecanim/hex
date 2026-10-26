"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Search,
  Filter,
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  Trash2,
  Eye,
  X,
} from "lucide-react";

type Basvuru = {
  id: string;
  tur: string;
  discordId: string;
  discordAd: string | null;
  veriler: Record<string, string>;
  durum: string;
  onaylayan: string | null;
  mulakat: string | null;
  notlar: string | null;
  createdAt: string;
};

export default function AdminBasvurular() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [adminMi, setAdminMi] = useState(false);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [basvurular, setBasvurular] = useState<Basvuru[]>([]);
  const [filtreTur, setFiltreTur] = useState("tumu");
  const [filtreDurum, setFiltreDurum] = useState("tumu");
  const [arama, setArama] = useState("");
  const [seciliBasvuru, setSeciliBasvuru] = useState<Basvuru | null>(null);
  const [islemYukleniyor, setIslemYukleniyor] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/giris");
      return;
    }
    if (status === "authenticated") {
      fetch("/api/admin/kontrol")
        .then((r) => r.json())
        .then((data) => {
          if (data.adminMi) {
            setAdminMi(true);
          } else {
            router.push("/panel");
          }
          setYukleniyor(false);
        })
        .catch(() => router.push("/panel"));
    }
  }, [status, router]);

  const basvurulariCek = () => {
    const params = new URLSearchParams();
    if (filtreTur !== "tumu") params.set("tur", filtreTur);
    if (filtreDurum !== "tumu") params.set("durum", filtreDurum);
    if (arama) params.set("arama", arama);

    fetch(`/api/admin/basvurular?${params.toString()}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.basvurular) setBasvurular(data.basvurular);
      })
      .catch(console.error);
  };

  useEffect(() => {
    if (adminMi) {
      basvurulariCek();
    }
  }, [adminMi, filtreTur, filtreDurum]);

  const durumGuncelle = async (
    id: string,
    durum: string,
    mulakat?: string
  ) => {
    setIslemYukleniyor(true);
    try {
      const yanit = await fetch(`/api/admin/basvurular/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ durum, mulakat }),
      });
      if (yanit.ok) {
        basvurulariCek();
        setSeciliBasvuru(null);
      }
    } catch (hata) {
      console.error(hata);
    } finally {
      setIslemYukleniyor(false);
    }
  };

  const sil = async (id: string) => {
    if (!confirm("Bu başvuruyu silmek istediğinden emin misin?")) return;
    try {
      const yanit = await fetch(`/api/admin/basvurular/${id}`, {
        method: "DELETE",
      });
      if (yanit.ok) {
        basvurulariCek();
        setSeciliBasvuru(null);
      }
    } catch (hata) {
      console.error(hata);
    }
  };

  if (status === "loading" || yukleniyor) {
    return (
      <div className="min-h-screen text-white flex items-center justify-center">
        <div className="text-[#8b8296] text-sm">Yükleniyor...</div>
      </div>
    );
  }

  if (!adminMi) return null;

  return (
    <div className="min-h-screen text-white">
      {/* BAŞLIK */}
      <section className="relative pt-32 pb-8 px-6">
        <div className="relative max-w-6xl mx-auto">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-[#8b8296] hover:text-white transition mb-6 text-sm"
          >
            <ArrowLeft size={14} />
            Admin Paneline Dön
          </Link>

          <h1
            className="text-3xl md:text-4xl font-black text-white tracking-wide mb-2"
            style={{ fontFamily: "var(--font-cinzel)" }}
          >
            BAŞVURULAR
          </h1>
          <p className="text-[#8b8296] text-sm">
            Toplam {basvurular.length} başvuru
          </p>
        </div>
      </section>

      {/* FİLTRELER */}
      <section className="max-w-6xl mx-auto px-6 pb-6">
        <div className="p-5 rounded-2xl border border-white/5 bg-[#17111f]/60 backdrop-blur-xl">
          <div className="grid md:grid-cols-4 gap-3">
            <div>
              <label className="block text-[#8b8296] text-xs font-medium mb-2">
                <Filter size={11} className="inline mr-1" />
                TÜR
              </label>
              <select
                value={filtreTur}
                onChange={(e) => setFiltreTur(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-white/20 outline-none text-white text-sm"
              >
                <option value="tumu">Tümü</option>
                <option value="Whitelist Başvurusu">Whitelist</option>
                <option value="Seherbaz Başvurusu">Seherbaz</option>
                <option value="Bakanlık Başvurusu">Bakanlık</option>
                <option value="Profesör Başvurusu">Profesör</option>
                <option value="Ölüm Yiyen Başvurusu">Ölüm Yiyen</option>
              </select>
            </div>

            <div>
              <label className="block text-[#8b8296] text-xs font-medium mb-2">
                <Filter size={11} className="inline mr-1" />
                DURUM
              </label>
              <select
                value={filtreDurum}
                onChange={(e) => setFiltreDurum(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-white/20 outline-none text-white text-sm"
              >
                <option value="tumu">Tümü</option>
                <option value="beklemede">Beklemede</option>
                <option value="onaylandi">Onaylandı</option>
                <option value="reddedildi">Reddedildi</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-[#8b8296] text-xs font-medium mb-2">
                <Search size={11} className="inline mr-1" />
                ARAMA
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={arama}
                  onChange={(e) => setArama(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && basvurulariCek()}
                  placeholder="Discord ID ara..."
                  className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-white/20 outline-none text-white text-sm"
                />
                <button
                  onClick={basvurulariCek}
                  className="px-4 py-2 rounded-lg bg-white text-[#0f0a14] font-semibold hover:bg-[#f0e6d2] transition text-sm"
                >
                  Ara
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LİSTE */}
      <section className="max-w-6xl mx-auto px-6 pb-20 space-y-3">
        {basvurular.length === 0 ? (
          <div className="p-12 rounded-2xl border border-white/5 bg-[#17111f]/60 backdrop-blur-xl text-center">
            <FileText className="mx-auto text-[#8b8296] mb-4" size={40} />
            <p className="text-[#8b8296] text-sm">Başvuru bulunamadı.</p>
          </div>
        ) : (
          basvurular.map((basvuru) => (
            <div
              key={basvuru.id}
              className="p-5 rounded-2xl border border-white/5 bg-[#17111f]/60 backdrop-blur-xl hover:border-white/10 transition"
            >
              <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 mb-2 flex-wrap">
                    <h3 className="text-base font-semibold text-white">
                      {basvuru.tur}
                    </h3>
                    {basvuru.durum === "beklemede" && (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium border border-yellow-500/30 text-yellow-400 bg-yellow-500/10 flex items-center gap-1">
                        <Clock size={10} />
                        Beklemede
                      </span>
                    )}
                    {basvuru.durum === "onaylandi" && (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium border border-green-500/30 text-green-400 bg-green-500/10 flex items-center gap-1">
                        <CheckCircle2 size={10} />
                        Onaylandı
                      </span>
                    )}
                    {basvuru.durum === "reddedildi" && (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium border border-red-500/30 text-red-400 bg-red-500/10 flex items-center gap-1">
                        <XCircle size={10} />
                        Reddedildi
                      </span>
                    )}
                  </div>
                  <p className="text-[#8b8296] text-xs">
                    Discord ID: {basvuru.discordId}
                  </p>
                  <p className="text-[#6b6276] text-xs mt-0.5">
                    {new Date(basvuru.createdAt).toLocaleString("tr-TR")}
                  </p>
                </div>

                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => setSeciliBasvuru(basvuru)}
                    className="px-3 py-1.5 rounded-lg border border-white/10 text-[#8b8296] hover:text-white hover:bg-white/5 transition flex items-center gap-1.5 text-xs"
                  >
                    <Eye size={13} />
                    Detay
                  </button>
                  <button
                    onClick={() => sil(basvuru.id)}
                    className="px-3 py-1.5 rounded-lg border border-white/10 text-[#d97777] hover:bg-white/5 transition flex items-center gap-1.5 text-xs"
                  >
                    <Trash2 size={13} />
                    Sil
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </section>

      {/* DETAY MODAL */}
      {seciliBasvuru && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 rounded-2xl border border-white/10 bg-[#17111f]">
            <div className="flex items-center justify-between mb-6">
              <h2
                className="text-xl font-bold text-white"
                style={{ fontFamily: "var(--font-cinzel)" }}
              >
                {seciliBasvuru.tur}
              </h2>
              <button
                onClick={() => setSeciliBasvuru(null)}
                className="text-[#8b8296] hover:text-white transition"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3 mb-6">
              {Object.entries(seciliBasvuru.veriler).map(([anahtar, deger]) => (
                <div
                  key={anahtar}
                  className="p-4 rounded-lg border border-white/5 bg-white/[0.02]"
                >
                  <p className="text-xs text-[#8b8296] font-medium uppercase mb-1">
                    {anahtar}
                  </p>
                  <p className="text-[#f0e6d2] whitespace-pre-wrap text-sm">
                    {deger}
                  </p>
                </div>
              ))}
            </div>

            {seciliBasvuru.durum !== "beklemede" && (
              <div
                className={`p-4 rounded-lg mb-6 border ${
                  seciliBasvuru.durum === "onaylandi"
                    ? "border-green-500/30 bg-green-500/5"
                    : "border-red-500/30 bg-red-500/5"
                }`}
              >
                <p className="text-sm">
                  <strong className="text-white">Durum:</strong>{" "}
                  <span
                    className={
                      seciliBasvuru.durum === "onaylandi"
                        ? "text-green-400"
                        : "text-red-400"
                    }
                  >
                    {seciliBasvuru.durum === "onaylandi"
                      ? "Onaylandı"
                      : "Reddedildi"}
                  </span>
                </p>
                {seciliBasvuru.mulakat && (
                  <p className="text-sm mt-1">
                    <strong className="text-white">Mülakat:</strong>{" "}
                    <span className="text-[#f0e6d2]">
                      {seciliBasvuru.mulakat}
                    </span>
                  </p>
                )}
              </div>
            )}

            {seciliBasvuru.durum === "beklemede" && (
              <div className="space-y-2">
                <button
                  onClick={() => {
                    const tarih = prompt(
                      "Mülakat tarihi (Örn: 14 Ekim 2026 / 20:00):"
                    );
                    if (tarih) {
                      durumGuncelle(seciliBasvuru.id, "onaylandi", tarih);
                    }
                  }}
                  disabled={islemYukleniyor}
                  className="w-full py-3 rounded-lg bg-green-500/20 border border-green-500/40 text-green-400 hover:bg-green-500/30 font-semibold transition flex items-center justify-center gap-2 disabled:opacity-50 text-sm"
                >
                  <CheckCircle2 size={16} />
                  {islemYukleniyor ? "İşleniyor..." : "Onayla ve Mülakat Ver"}
                </button>
                <button
                  onClick={() => {
                    if (
                      confirm(
                        "Bu başvuruyu reddetmek istediğinden emin misin?"
                      )
                    ) {
                      durumGuncelle(seciliBasvuru.id, "reddedildi");
                    }
                  }}
                  disabled={islemYukleniyor}
                  className="w-full py-3 rounded-lg bg-red-500/20 border border-red-500/40 text-red-400 hover:bg-red-500/30 font-semibold transition flex items-center justify-center gap-2 disabled:opacity-50 text-sm"
                >
                  <XCircle size={16} />
                  {islemYukleniyor ? "İşleniyor..." : "Reddet"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}