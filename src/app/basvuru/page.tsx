"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Wand2,
  Landmark,
  Swords,
  BookOpen,
  Skull,
  Lock,
  Shield,
} from "lucide-react";

type Durumlar = Record<string, boolean>;

export default function Basvuru() {
  const { data: session } = useSession();
  const [durumlar, setDurumlar] = useState<Durumlar>({});
  const [yukleniyor, setYukleniyor] = useState(true);

  useEffect(() => {
    fetch("/api/basvuru-durum")
      .then((r) => r.json())
      .then((data) => {
        if (data.durumlar) setDurumlar(data.durumlar);
        setYukleniyor(false);
      })
      .catch(() => setYukleniyor(false));
  }, []);

  const basvuruTürleri = [
    {
      key: "whitelist",
      baslik: "Whitelist",
      aciklama: "Sunucuya giriş için zorunlu başvuru.",
      ikon: Wand2,
      link: "/basvuru/whitelist",
      etiket: "Zorunlu",
    },
    {
      key: "bakanlik",
      baslik: "Bakanlık",
      aciklama: "Büyücülük Bakanlığı'nda görev almak için başvuru.",
      ikon: Landmark,
      link: "/basvuru/bakanlik",
      etiket: "Rol",
    },
    {
      key: "seherbaz",
      baslik: "Seherbaz",
      aciklama: "Karanlık büyücülere karşı savaşan birliğe katıl.",
      ikon: Swords,
      link: "/basvuru/seherbaz",
      etiket: "Rol",
    },
    {
      key: "profesor",
      baslik: "Profesör",
      aciklama: "Hogwarts'ta ders vermek için başvuru.",
      ikon: BookOpen,
      link: "/basvuru/profesor",
      etiket: "Rol",
    },
    {
      key: "olum-yiyen",
      baslik: "Ölüm Yiyen",
      aciklama: "Karanlık tarafın hizmetine gir.",
      ikon: Skull,
      link: "/basvuru/olum-yiyen",
      etiket: "Gizli",
    },
    {
      key: "yetkili",
      baslik: "Yetkili Başvurusu",
      aciklama: "Sunucuda moderatör/yetkili olmak için başvuru.",
      ikon: Shield,
      link: "/basvuru/yetkili",
      etiket: "Ekip",
    },
  ];

  return (
    <div className="min-h-screen text-white">
      {/* BAŞLIK */}
      <section className="relative pt-32 pb-12 px-6">
        <div className="relative max-w-4xl mx-auto text-center">
          <h1
            className="text-4xl md:text-6xl font-black text-white tracking-widest mb-3"
            style={{ fontFamily: "var(--font-cinzel)" }}
          >
            BAŞVURULAR
          </h1>
          <p className="text-[#8b8296]">Loxford Roleplay Başvuru Merkezi</p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 pb-20">
        {/* Discord uyarısı */}
        {!session?.user && (
          <div className="p-5 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl mb-8 text-center">
            <p className="text-[#8b8296] mb-4 text-sm">
              Başvuru yapmak için Discord ile giriş yapmalısın.
            </p>
            <Link
              href="/giris"
              style={{ color: "#0f0a14" }}
              className="inline-block px-5 py-2.5 rounded-lg !bg-[#f0e6d2] hover:!bg-white font-bold transition text-sm"
            >
              Discord ile Giriş Yap
            </Link>
          </div>
        )}

        {/* Bilgi kartı */}
        <div className="p-5 rounded-2xl border border-white/5 bg-[#17111f]/60 backdrop-blur-xl text-center mb-8">
          <p className="text-[#8b8296] text-sm">
            Başvuru yapmadan önce{" "}
            <Link
              href="/kurallar"
              className="text-white underline underline-offset-4 hover:text-[#f0e6d2]"
            >
              kuralları
            </Link>{" "}
            ve{" "}
            <Link
              href="/evren-hikayesi"
              className="text-white underline underline-offset-4 hover:text-[#f0e6d2]"
            >
              evren hikayesini
            </Link>{" "}
            okumanız önerilir.
          </p>
        </div>

        {/* BAŞVURU KARTLARI */}
        <div className="grid md:grid-cols-2 gap-4">
          {basvuruTürleri.map((tur) => {
            const Ikon = tur.ikon;
            const acik = durumlar[tur.key] === true;

            if (!acik) {
              return (
                <div
                  key={tur.key}
                  className="p-6 rounded-2xl border border-white/5 bg-[#17111f]/40 backdrop-blur-xl flex flex-col opacity-50 cursor-not-allowed"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                      <Ikon className="text-[#6b6276]" size={22} />
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium border border-white/10 text-[#8b8296] flex items-center gap-1">
                      <Lock size={10} />
                      Kapalı
                    </span>
                  </div>
                  <h3 className="text-base font-semibold text-[#8b8296] mb-1">
                    {tur.baslik}
                  </h3>
                  <p className="text-[#6b6276] text-xs flex-1">
                    {tur.aciklama}
                  </p>
                  <div className="mt-4 text-[#6b6276] text-xs">
                    Başvurular kapalı
                  </div>
                </div>
              );
            }

            return (
              <Link
                key={tur.key}
                href={tur.link}
                className="group p-6 rounded-2xl border border-white/5 bg-[#17111f]/60 backdrop-blur-xl hover:border-white/10 hover:bg-[#1f1729]/60 transition flex flex-col"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-105 transition">
                    <Ikon className="text-white" size={22} />
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-medium border border-white/10 text-[#8b8296] bg-white/5">
                    {tur.etiket}
                  </span>
                </div>
                <h3 className="text-base font-semibold text-white mb-1 group-hover:text-[#f0e6d2] transition">
                  {tur.baslik}
                </h3>
                <p className="text-[#8b8296] text-xs flex-1">
                  {tur.aciklama}
                </p>
                <div className="mt-4 text-white text-xs font-medium flex items-center gap-1">
                  Başvur →
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}