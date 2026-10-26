"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Megaphone,
  Send,
  AlertCircle,
  CheckCircle2,
  History,
  Trash2,
} from "lucide-react";

type Duyuru = {
  id: string;
  baslik: string;
  icerik: string;
  gonderen: string;
  createdAt: string;
};

export default function AdminDuyurular() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [adminMi, setAdminMi] = useState(false);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [baslik, setBaslik] = useState("");
  const [icerik, setIcerik] = useState("");
  const [gonderiliyor, setGonderiliyor] = useState(false);
  const [mesaj, setMesaj] = useState<{
    tip: "basari" | "hata";
    metin: string;
  } | null>(null);
  const [duyurular, setDuyurular] = useState<Duyuru[]>([]);

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
            duyurulariCek();
            setYukleniyor(false);
          } else {
            router.push("/panel");
          }
        })
        .catch(() => router.push("/panel"));
    }
  }, [status, router]);

  const duyurulariCek = () => {
    fetch("/api/admin/duyuru")
      .then((r) => r.json())
      .then((d) => {
        if (d.duyurular) setDuyurular(d.duyurular);
      })
      .catch(() => {});
  };

  const duyuruGonder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!baslik || !icerik) return;

    setGonderiliyor(true);
    setMesaj(null);

    try {
      const yanit = await fetch("/api/admin/duyuru", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ baslik, icerik }),
      });

      const data = await yanit.json();

      if (yanit.ok && data.basarili) {
        setMesaj({
          tip: "basari",
          metin: "Duyuru hem Discord'a hem siteye gönderildi!",
        });
        setBaslik("");
        setIcerik("");
        duyurulariCek();
      } else {
        setMesaj({
          tip: "hata",
          metin: data.hata || "Duyuru gönderilemedi.",
        });
      }
    } catch (hata) {
      setMesaj({
        tip: "hata",
        metin: "Bir hata oluştu. Tekrar deneyin.",
      });
    } finally {
      setGonderiliyor(false);
    }
  };

  const duyuruSil = async (id: string) => {
    if (!confirm("Bu duyuruyu silmek istediğinden emin misin?")) return;

    try {
      const yanit = await fetch(`/api/admin/duyuru/${id}`, {
        method: "DELETE",
      });

      if (yanit.ok) {
        duyurulariCek();
      } else {
        alert("Duyuru silinemedi.");
      }
    } catch (hata) {
      console.error(hata);
      alert("Bir hata oluştu.");
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
              <Megaphone className="text-white" size={20} />
            </div>
            <h1
              className="text-3xl md:text-4xl font-black text-white tracking-wide"
              style={{ fontFamily: "var(--font-cinzel)" }}
            >
              DUYURULAR
            </h1>
          </div>
          <p className="text-[#8b8296] text-sm">
            Discord'a ve siteye duyuru gönder.
          </p>
        </div>
      </section>

      {/* FORM */}
      <section className="max-w-4xl mx-auto px-6 pb-6">
        <div className="p-6 rounded-2xl border border-white/5 bg-[#17111f]/60 backdrop-blur-xl">
          <div className="p-3 rounded-lg border border-yellow-500/20 bg-yellow-500/5 mb-5 flex items-start gap-2.5">
            <AlertCircle
              className="text-yellow-400 flex-shrink-0 mt-0.5"
              size={16}
            />
            <div className="text-xs text-yellow-200/90">
              Duyuru hem Discord'daki <b>#duyurular</b> kanalına hem de{" "}
              <b>sitedeki /duyurular</b> sayfasına gönderilecek.
            </div>
          </div>

          {mesaj && (
            <div
              className={`p-3 rounded-lg mb-5 flex items-start gap-2.5 text-xs ${
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

          <form onSubmit={duyuruGonder} className="space-y-4">
            <div>
              <label className="block text-[#8b8296] text-xs font-medium mb-2">
                Duyuru Başlığı
              </label>
              <input
                required
                type="text"
                value={baslik}
                onChange={(e) => setBaslik(e.target.value)}
                placeholder="Örn: Yeni Sezon Güncellemesi"
                className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 focus:border-white/20 outline-none text-white text-sm"
                maxLength={100}
              />
              <p className="text-[#6b6276] text-xs mt-1">
                {baslik.length}/100
              </p>
            </div>

            <div>
              <label className="block text-[#8b8296] text-xs font-medium mb-2">
                Duyuru İçeriği
              </label>
              <textarea
                required
                rows={7}
                value={icerik}
                onChange={(e) => setIcerik(e.target.value)}
                placeholder="Duyuru detaylarını buraya yaz..."
                className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 focus:border-white/20 outline-none text-white text-sm resize-none"
                maxLength={2000}
              />
              <p className="text-[#6b6276] text-xs mt-1">
                {icerik.length}/2000
              </p>
            </div>

            <button
              type="submit"
              disabled={gonderiliyor || !baslik || !icerik}
              className="w-full py-3 rounded-lg bg-white text-[#0f0a14] font-semibold hover:bg-[#f0e6d2] transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              <Send size={16} />
              {gonderiliyor ? "Gönderiliyor..." : "Duyuruyu Gönder"}
            </button>
          </form>
        </div>
      </section>

      {/* ÖNİZLEME */}
      {(baslik || icerik) && (
        <section className="max-w-4xl mx-auto px-6 pb-6">
          <div className="p-5 rounded-2xl border border-white/5 bg-[#17111f]/60 backdrop-blur-xl">
            <h3 className="text-xs text-[#8b8296] font-medium mb-3 uppercase">
              Önizleme
            </h3>
            <div className="p-5 rounded-lg border-l-2 border-white/20 bg-white/[0.02]">
              <h4 className="text-lg font-bold text-white mb-2">
                {baslik || "Başlık..."}
              </h4>
              <p className="text-[#8b8296] whitespace-pre-wrap text-sm">
                {icerik || "İçerik..."}
              </p>
              <p className="text-[#6b6276] text-xs mt-4">
                Loxford Roleplay • {new Date().toLocaleDateString("tr-TR")}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* GEÇMİŞ */}
      <section className="max-w-4xl mx-auto px-6 pb-20">
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <History size={16} />
          Geçmiş Duyurular ({duyurular.length})
        </h3>

        {duyurular.length === 0 ? (
          <div className="p-8 rounded-2xl border border-white/5 bg-[#17111f]/60 backdrop-blur-xl text-center">
            <p className="text-[#8b8296] text-sm">
              Henüz duyuru gönderilmedi.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {duyurular.map((d) => (
              <div
                key={d.id}
                className="p-4 rounded-2xl border border-white/5 bg-[#17111f]/60 backdrop-blur-xl hover:border-white/10 transition"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-white text-sm">
                      {d.baslik}
                    </h4>
                    <span className="text-[#6b6276] text-xs">
                      {new Date(d.createdAt).toLocaleString("tr-TR")}
                    </span>
                  </div>
                  <button
                    onClick={() => duyuruSil(d.id)}
                    className="px-2.5 py-1.5 rounded-lg border border-white/10 text-[#d97777] hover:bg-white/5 transition flex items-center gap-1.5 text-xs"
                  >
                    <Trash2 size={12} />
                    Sil
                  </button>
                </div>
                <p className="text-[#8b8296] text-xs whitespace-pre-wrap">
                  {d.icerik}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}