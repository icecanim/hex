"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Settings,
  Wand2,
  Swords,
  Landmark,
  BookOpen,
  Skull,
  CheckCircle2,
  XCircle,
  Shield,
} from "lucide-react";

type Ayar = {
  id: string;
  tur: string;
  acik: boolean;
};

const turBilgileri: Record<
  string,
  { isim: string; ikon: any; aciklama: string }
> = {
  whitelist: {
    isim: "Whitelist",
    ikon: Wand2,
    aciklama: "Sunucuya giriş için zorunlu başvuru",
  },
  seherbaz: {
    isim: "Seherbaz",
    ikon: Swords,
    aciklama: "Karanlık büyücülere karşı savaşan birlik",
  },
  bakanlik: {
    isim: "Bakanlık",
    ikon: Landmark,
    aciklama: "Büyücülük Bakanlığı başvurusu",
  },
  profesor: {
    isim: "Profesör",
    ikon: BookOpen,
    aciklama: "Hogwarts'ta ders verme başvurusu",
  },
  "olum-yiyen": {
    isim: "Ölüm Yiyen",
    ikon: Skull,
    aciklama: "Karanlık taraf başvurusu",
  },
  yetkili: {
    isim: "Yetkili Başvurusu",
    ikon: Shield,
    aciklama: "Sunucuda moderatör/yetkili olmak için başvuru",
  },
};

export default function BasvuruAyarlar() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [adminMi, setAdminMi] = useState(false);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [ayarlar, setAyarlar] = useState<Ayar[]>([]);
  const [islemde, setIslemde] = useState<string | null>(null);

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
            ayarlariCek();
            setYukleniyor(false);
          } else {
            router.push("/panel");
          }
        })
        .catch(() => router.push("/panel"));
    }
  }, [status, router]);

  const ayarlariCek = () => {
    fetch("/api/admin/basvuru-ayar")
      .then((r) => r.json())
      .then((data) => {
        if (data.ayarlar) setAyarlar(data.ayarlar);
      })
      .catch(() => {});
  };

  const toggleAyar = async (tur: string, mevcutDurum: boolean) => {
    if (
      !confirm(
        `${turBilgileri[tur]?.isim} başvurusunu ${
          mevcutDurum ? "KAPATMAK" : "AÇMAK"
        } istediğinden emin misin?${
          !mevcutDurum ? "\n\n⚠️ Açınca otomatik duyuru gönderilecek!" : ""
        }`
      )
    )
      return;

    setIslemde(tur);

    try {
      const yanit = await fetch("/api/admin/basvuru-ayar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tur, acik: !mevcutDurum }),
      });

      if (yanit.ok) {
        ayarlariCek();
      } else {
        alert("İşlem başarısız.");
      }
    } catch (hata) {
      console.error(hata);
      alert("Bir hata oluştu.");
    } finally {
      setIslemde(null);
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
      <section className="relative pt-32 pb-8 px-6">
        <div className="relative max-w-4xl mx-auto">
          <Link
            href="/admin/basvurular"
            className="inline-flex items-center gap-2 text-[#8b8296] hover:text-white transition mb-6 text-sm"
          >
            <ArrowLeft size={14} />
            Başvurulara Dön
          </Link>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
              <Settings className="text-white" size={20} />
            </div>
            <h1
              className="text-3xl md:text-4xl font-black text-white tracking-wide"
              style={{ fontFamily: "var(--font-cinzel)" }}
            >
              BAŞVURU AYARLARI
            </h1>
          </div>
          <p className="text-[#8b8296] text-sm">
            Hangi başvuru türlerinin açık olacağını buradan yönet.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 pb-20 space-y-3">
        {ayarlar.map((ayar) => {
          const bilgi = turBilgileri[ayar.tur];
          if (!bilgi) return null;

          const Ikon = bilgi.ikon;
          const islemYukleniyor = islemde === ayar.tur;

          return (
            <div
              key={ayar.id}
              className="p-5 rounded-2xl border border-white/5 bg-[#17111f]/60 backdrop-blur-xl"
            >
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                    <Ikon className="text-white" size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white">
                      {bilgi.isim}
                    </h3>
                    <p className="text-[#8b8296] text-xs">
                      {bilgi.aciklama}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => toggleAyar(ayar.tur, ayar.acik)}
                  disabled={islemYukleniyor}
                  className={`px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 text-sm border ${
                    ayar.acik
                      ? "border-green-500/40 bg-green-500/10 text-green-400 hover:bg-green-500/20"
                      : "border-red-500/40 bg-red-500/10 text-red-400 hover:bg-red-500/20"
                  } disabled:opacity-50`}
                >
                  {islemYukleniyor ? (
                    "İşleniyor..."
                  ) : ayar.acik ? (
                    <>
                      <CheckCircle2 size={14} />
                      Açık
                    </>
                  ) : (
                    <>
                      <XCircle size={14} />
                      Kapalı
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}