"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ScrollText,
  Plus,
  Trash2,
  Save,
  X,
  Edit2,
} from "lucide-react";

type Madde = {
  id: string;
  icerik: string;
  sira: number;
};

type Kategori = {
  id: string;
  baslik: string;
  sira: number;
  maddeler: Madde[];
};

export default function KurallarEditor() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [adminMi, setAdminMi] = useState(false);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [kategoriler, setKategoriler] = useState<Kategori[]>([]);
  const [yeniKategori, setYeniKategori] = useState("");
  const [yeniMadde, setYeniMadde] = useState<Record<string, string>>({});
  const [duzenlenen, setDuzenlenen] = useState<string | null>(null);
  const [duzenlenenDeger, setDuzenlenenDeger] = useState("");

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
            kurallariCek();
            setYukleniyor(false);
          } else {
            router.push("/panel");
          }
        })
        .catch(() => router.push("/panel"));
    }
  }, [status, router]);

  const kurallariCek = () => {
    fetch("/api/admin/kurallar")
      .then((r) => r.json())
      .then((data) => {
        if (data.kategoriler) setKategoriler(data.kategoriler);
      });
  };

  const apiCagir = async (govde: any) => {
    const yanit = await fetch("/api/admin/kurallar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(govde),
    });
    if (yanit.ok) kurallariCek();
    return yanit.ok;
  };

  const kategoriEkle = async () => {
    if (!yeniKategori.trim()) return;
    await apiCagir({
      aksiyon: "kategori-ekle",
      veri: { baslik: yeniKategori },
    });
    setYeniKategori("");
  };

  const kategoriSil = async (id: string) => {
    if (
      !confirm(
        "Bu kategoriyi ve tüm maddelerini silmek istediğinden emin misin?"
      )
    )
      return;
    await apiCagir({ aksiyon: "kategori-sil", id });
  };

  const maddeEkle = async (kategoriId: string) => {
    const icerik = yeniMadde[kategoriId];
    if (!icerik?.trim()) return;
    await apiCagir({
      aksiyon: "madde-ekle",
      veri: { kategoriId, icerik },
    });
    setYeniMadde({ ...yeniMadde, [kategoriId]: "" });
  };

  const maddeSil = async (id: string) => {
    if (!confirm("Bu maddeyi silmek istediğinden emin misin?")) return;
    await apiCagir({ aksiyon: "madde-sil", id });
  };

  const maddeGuncelle = async (id: string) => {
    if (!duzenlenenDeger.trim()) return;
    const basarili = await apiCagir({
      aksiyon: "madde-guncelle",
      id,
      veri: { icerik: duzenlenenDeger },
    });
    if (basarili) {
      setDuzenlenen(null);
      setDuzenlenenDeger("");
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
        <div className="relative max-w-5xl mx-auto">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-[#8b8296] hover:text-white transition mb-6 text-sm"
          >
            <ArrowLeft size={14} />
            Admin Paneline Dön
          </Link>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
              <ScrollText className="text-white" size={20} />
            </div>
            <h1
              className="text-3xl md:text-4xl font-black text-white tracking-wide"
              style={{ fontFamily: "var(--font-cinzel)" }}
            >
              KURALLAR YÖNETİMİ
            </h1>
          </div>
          <p className="text-[#8b8296] text-sm">
            Kategoriler ve maddeleri buradan yönetebilirsin.
          </p>
        </div>
      </section>

      {/* YENİ KATEGORİ */}
      <section className="max-w-5xl mx-auto px-6 pb-6">
        <div className="p-5 rounded-2xl border border-white/5 bg-[#17111f]/60 backdrop-blur-xl">
          <h2 className="text-sm font-semibold text-white mb-3">
            Yeni Kategori Ekle
          </h2>
          <div className="flex gap-2">
            <input
              type="text"
              value={yeniKategori}
              onChange={(e) => setYeniKategori(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && kategoriEkle()}
              placeholder="Kategori adı (Örn: Genel Kurallar)"
              className="flex-1 px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 focus:border-white/20 outline-none text-white text-sm"
            />
            <button
              onClick={kategoriEkle}
              className="px-5 py-2.5 rounded-lg bg-white text-[#0f0a14] font-semibold hover:bg-[#f0e6d2] transition flex items-center gap-1.5 text-sm"
            >
              <Plus size={16} />
              Ekle
            </button>
          </div>
        </div>
      </section>

      {/* KATEGORİLER */}
      <section className="max-w-5xl mx-auto px-6 pb-20 space-y-4">
        {kategoriler.map((kat) => (
          <div
            key={kat.id}
            className="p-5 rounded-2xl border border-white/5 bg-[#17111f]/60 backdrop-blur-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-white">
                {kat.sira}. {kat.baslik}
              </h3>
              <button
                onClick={() => kategoriSil(kat.id)}
                className="px-2.5 py-1.5 rounded-lg border border-white/10 text-[#d97777] hover:bg-white/5 transition flex items-center gap-1.5 text-xs"
              >
                <Trash2 size={12} />
                Sil
              </button>
            </div>

            {/* Maddeler */}
            <ul className="space-y-1.5 mb-3">
              {kat.maddeler.map((m) => (
                <li
                  key={m.id}
                  className="flex items-start gap-2 p-2.5 rounded-lg bg-white/[0.02] group"
                >
                  {duzenlenen === m.id ? (
                    <>
                      <input
                        type="text"
                        value={duzenlenenDeger}
                        onChange={(e) => setDuzenlenenDeger(e.target.value)}
                        onKeyDown={(e) =>
                          e.key === "Enter" && maddeGuncelle(m.id)
                        }
                        className="flex-1 px-2.5 py-1.5 rounded-lg bg-black/40 border border-white/20 focus:border-white/40 outline-none text-white text-sm"
                        autoFocus
                      />
                      <button
                        onClick={() => maddeGuncelle(m.id)}
                        className="p-1.5 rounded text-green-400 hover:bg-green-500/10"
                      >
                        <Save size={14} />
                      </button>
                      <button
                        onClick={() => {
                          setDuzenlenen(null);
                          setDuzenlenenDeger("");
                        }}
                        className="p-1.5 rounded text-[#8b8296] hover:bg-white/5"
                      >
                        <X size={14} />
                      </button>
                    </>
                  ) : (
                    <>
                      <span className="text-[#6b6276] mt-0.5 text-xs">▸</span>
                      <span className="text-[#f0e6d2] flex-1 text-sm">
                        {m.icerik}
                      </span>
                      <button
                        onClick={() => {
                          setDuzenlenen(m.id);
                          setDuzenlenenDeger(m.icerik);
                        }}
                        className="p-1.5 rounded text-[#8b8296] hover:text-white hover:bg-white/5 opacity-0 group-hover:opacity-100 transition"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => maddeSil(m.id)}
                        className="p-1.5 rounded text-[#d97777] hover:bg-white/5 opacity-0 group-hover:opacity-100 transition"
                      >
                        <Trash2 size={14} />
                      </button>
                    </>
                  )}
                </li>
              ))}
            </ul>

            {/* Yeni Madde */}
            <div className="flex gap-2">
              <input
                type="text"
                value={yeniMadde[kat.id] || ""}
                onChange={(e) =>
                  setYeniMadde({ ...yeniMadde, [kat.id]: e.target.value })
                }
                onKeyDown={(e) => e.key === "Enter" && maddeEkle(kat.id)}
                placeholder="Yeni madde ekle..."
                className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-white/20 outline-none text-white text-sm"
              />
              <button
                onClick={() => maddeEkle(kat.id)}
                className="px-4 py-2 rounded-lg bg-white/10 border border-white/10 text-white hover:bg-white/15 transition flex items-center gap-1.5 text-sm"
              >
                <Plus size={14} />
                Ekle
              </button>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}