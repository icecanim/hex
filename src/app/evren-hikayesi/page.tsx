"use client";

import { useEffect, useState } from "react";
import { BookOpen } from "lucide-react";

export default function EvrenHikayesi() {
  const [yukleniyor, setYukleniyor] = useState(true);
  const [baslik, setBaslik] = useState("");
  const [altbaslik, setAltbaslik] = useState("");
  const [icerik, setIcerik] = useState("");

  useEffect(() => {
    fetch("/api/icerik")
      .then((r) => r.json())
      .then((data) => {
        if (data.icerikler) {
          setBaslik(
            data.icerikler["evren-hikayesi-baslik"] || "Evren Hikayesi"
          );
          setAltbaslik(data.icerikler["evren-hikayesi-altbaslik"] || "");
          setIcerik(data.icerikler["evren-hikayesi"] || "");
        }
        setYukleniyor(false);
      })
      .catch(() => setYukleniyor(false));
  }, []);

  const paragraflar = icerik
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  return (
    <div className="min-h-screen text-white">
      {/* BAŞLIK */}
      <section className="relative pt-32 pb-12 px-6">
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
            <BookOpen className="text-white" size={24} />
          </div>
          <h1
            className="text-4xl md:text-6xl font-black text-white tracking-widest mb-3"
            style={{ fontFamily: "var(--font-cinzel)" }}
          >
            EVREN HİKAYESİ
          </h1>
          <p className="text-[#8b8296]">
            Loxford Roleplay Evreni ve Lore'u
          </p>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-6 pb-20">
        {yukleniyor ? (
          <div className="p-12 rounded-2xl border border-white/5 bg-[#17111f]/60 backdrop-blur-xl text-center">
            <p className="text-[#8b8296] text-sm">Yükleniyor...</p>
          </div>
        ) : (
          <div className="p-8 md:p-10 rounded-2xl border border-white/5 bg-[#17111f]/60 backdrop-blur-xl">
            {baslik && (
              <h2
                className="text-2xl md:text-3xl font-bold text-white mb-2 text-center"
                style={{ fontFamily: "var(--font-cinzel)" }}
              >
                {baslik}
              </h2>
            )}
            {altbaslik && (
              <p className="text-center text-[#6b6276] text-xs italic mb-8">
                {altbaslik}
              </p>
            )}

            <div className="space-y-5 text-[#f0e6d2] leading-relaxed text-sm md:text-base">
              {paragraflar.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}