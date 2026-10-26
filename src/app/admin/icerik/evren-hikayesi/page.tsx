"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  Save,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export default function EvrenHikayesiEditor() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [adminMi, setAdminMi] = useState(false);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [kaydediliyor, setKaydediliyor] = useState(false);
  const [mesaj, setMesaj] = useState<{
    tip: "basari" | "hata";
    metin: string;
  } | null>(null);

  const [baslik, setBaslik] = useState("");
  const [altbaslik, setAltbaslik] = useState("");
  const [icerik, setIcerik] = useState("");

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
            fetch("/api/icerik")
              .then((r) => r.json())
              .then((i) => {
                if (i.icerikler) {
                  setBaslik(i.icerikler["evren-hikayesi-baslik"] || "");
                  setAltbaslik(i.icerikler["evren-hikayesi-altbaslik"] || "");
                  setIcerik(i.icerikler["evren-hikayesi"] || "");
                }
                setYukleniyor(false);
              })
              .catch(() => setYukleniyor(false));
          } else {
            router.push("/panel");
          }
        })
        .catch(() => {
          router.push("/panel");
        });
    }
  }, [status, router]);

  const kaydet = async (e: React.FormEvent) => {
    e.preventDefault();
    setKaydediliyor(true);
    setMesaj(null);

    try {
      const istekler = [
        { key: "evren-hikayesi-baslik", deger: baslik },
        { key: "evren-hikayesi-altbaslik", deger: altbaslik },
        { key: "evren-hikayesi", deger: icerik },
      ];

      for (const i of istekler) {
        const yanit = await fetch("/api/admin/icerik", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(i),
        });

        if (!yanit.ok) {
          throw new Error("Kaydedilemedi");
        }
      }

      setMesaj({
        tip: "basari",
        metin: "Evren hikayesi başarıyla güncellendi!",
      });
    } catch (hata) {
      setMesaj({
        tip: "hata",
        metin: "Kaydedilemedi. Tekrar deneyin.",
      });
    } finally {
      setKaydediliyor(false);
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
        <div className="relative max-w-4xl mx-auto">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-[#8b8296] hover:text-white transition mb-6 text-sm"
          >
            <ArrowLeft size={14} />
            Admin Paneline Dön
          </Link>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
              <BookOpen className="text-white" size={20} />
            </div>
            <h1
              className="text-3xl md:text-4xl font-black text-white tracking-wide"
              style={{ fontFamily: "var(--font-cinzel)" }}
            >
              EVREN HİKAYESİ
            </h1>
          </div>
          <p className="text-[#8b8296] text-sm">
            Evren hikayesini buradan düzenleyebilirsin.
          </p>
        </div>
      </section>

      {/* FORM */}
      <section className="max-w-4xl mx-auto px-6 pb-20">
        <form
          onSubmit={kaydet}
          className="p-6 rounded-2xl border border-white/5 bg-[#17111f]/60 backdrop-blur-xl space-y-5"
        >
          {mesaj && (
            <div
              className={`p-3 rounded-lg flex items-start gap-2.5 text-xs ${
                mesaj.tip === "basari"
                  ? "border border-green-500/30 bg-green-500/5 text-green-400"
                  : "border border-red-500/30 bg-red-500/5 text-red-400"
              }`}
            >
              {mesaj.tip === "basari" ? (
                <CheckCircle2 size={16} className="flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
              )}
              <span>{mesaj.metin}</span>
            </div>
          )}

          <div>
            <label className="block text-[#8b8296] text-xs font-medium mb-2">
              Ana Başlık
            </label>
            <input
              type="text"
              value={baslik}
              onChange={(e) => setBaslik(e.target.value)}
              placeholder="Örn: 1971 Yılı"
              className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 focus:border-white/20 outline-none text-white text-sm"
            />
          </div>

          <div>
            <label className="block text-[#8b8296] text-xs font-medium mb-2">
              Alt Başlık (İtalik)
            </label>
            <input
              type="text"
              value={altbaslik}
              onChange={(e) => setAltbaslik(e.target.value)}
              placeholder="Örn: Büyücülük dünyasının uzun yıllardır görmediği..."
              className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 focus:border-white/20 outline-none text-white text-sm"
            />
          </div>

          <div>
            <label className="block text-[#8b8296] text-xs font-medium mb-2">
              Hikaye İçeriği
            </label>
            <textarea
              rows={18}
              value={icerik}
              onChange={(e) => setIcerik(e.target.value)}
              placeholder="Hikayeyi buraya yaz..."
              className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 focus:border-white/20 outline-none text-white text-sm resize-none leading-relaxed"
            />
            <p className="text-[#6b6276] text-xs mt-1.5">
              İpucu: Paragrafları ayırmak için boş satır bırak (Enter 2 kez).
            </p>
          </div>

          <button
            type="submit"
            disabled={kaydediliyor}
            className="w-full py-3 rounded-lg bg-white text-[#0f0a14] font-semibold hover:bg-[#f0e6d2] transition flex items-center justify-center gap-2 disabled:opacity-50 text-sm"
          >
            <Save size={16} />
            {kaydediliyor ? "Kaydediliyor..." : "Kaydet"}
          </button>
        </form>
      </section>
    </div>
  );
}