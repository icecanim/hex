"use client";

import { useEffect, useState } from "react";
import { ScrollText, AlertTriangle } from "lucide-react";

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

export default function Kurallar() {
  const [kategoriler, setKategoriler] = useState<Kategori[]>([]);
  const [yukleniyor, setYukleniyor] = useState(true);

  useEffect(() => {
    fetch("/api/kurallar")
      .then((r) => r.json())
      .then((data) => {
        if (data.kategoriler) setKategoriler(data.kategoriler);
        setYukleniyor(false);
      })
      .catch(() => setYukleniyor(false));
  }, []);

  return (
    <div className="min-h-screen text-white">
      {/* BAŞLIK */}
      <section className="relative pt-32 pb-12 px-6">
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
            <ScrollText className="text-white" size={24} />
          </div>
          <h1
            className="text-4xl md:text-6xl font-black text-white tracking-widest mb-3"
            style={{ fontFamily: "var(--font-cinzel)" }}
          >
            KURALLAR
          </h1>
          <p className="text-[#8b8296]">
            Loxford Roleplay Sunucu Kuralları ve Yönetmeliği
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 pb-20 space-y-4">
        {yukleniyor ? (
          <div className="p-12 rounded-2xl border border-white/5 bg-[#17111f]/60 backdrop-blur-xl text-center">
            <p className="text-[#8b8296] text-sm">Yükleniyor...</p>
          </div>
        ) : kategoriler.length === 0 ? (
          <div className="p-12 rounded-2xl border border-white/5 bg-[#17111f]/60 backdrop-blur-xl text-center">
            <p className="text-[#8b8296] text-sm">Henüz kural eklenmemiş.</p>
          </div>
        ) : (
          <>
            {kategoriler.map((kat, index) => (
              <div
                key={kat.id}
                className="p-6 rounded-2xl border border-white/5 bg-[#17111f]/60 backdrop-blur-xl"
              >
                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </span>
                  {kat.baslik}
                </h2>
                <ul className="space-y-2.5">
                  {kat.maddeler.map((m) => (
                    <li key={m.id} className="flex items-start gap-2.5">
                      <span className="text-[#6b6276] mt-0.5 text-sm">▸</span>
                      <span className="text-[#f0e6d2] text-sm leading-relaxed">
                        {m.icerik}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div className="p-6 rounded-2xl border border-red-500/20 bg-red-500/5 backdrop-blur-xl">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="text-red-400" size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-red-400 mb-1.5">
                    Önemli Uyarı
                  </h3>
                  <p className="text-[#8b8296] text-sm leading-relaxed">
                    Kuralları bilmemek mazeret değildir. Sunucuya giren her
                    oyuncu bu kuralları kabul etmiş sayılır. Herhangi bir kural
                    ihlalinde ceza sistemi uygulanır.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  );
}