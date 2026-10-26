"use client";

import { useEffect, useState } from "react";
import { Megaphone, Calendar } from "lucide-react";

type Duyuru = {
  id: string;
  baslik: string;
  icerik: string;
  gonderen: string;
  createdAt: string;
};

export default function Duyurular() {
  const [duyurular, setDuyurular] = useState<Duyuru[]>([]);
  const [yukleniyor, setYukleniyor] = useState(true);

  useEffect(() => {
    fetch("/api/duyurular")
      .then((r) => r.json())
      .then((data) => {
        if (data.duyurular) setDuyurular(data.duyurular);
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
            <Megaphone className="text-white" size={24} />
          </div>
          <h1
            className="text-4xl md:text-6xl font-black text-white tracking-widest mb-3"
            style={{ fontFamily: "var(--font-cinzel)" }}
          >
            DUYURULAR
          </h1>
          <p className="text-[#8b8296]">
            Loxford Roleplay Güncelleme ve Bildirimler
          </p>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-6 pb-20 space-y-4">
        {yukleniyor ? (
          <div className="p-12 rounded-2xl border border-white/5 bg-[#17111f]/60 backdrop-blur-xl text-center">
            <p className="text-[#8b8296] text-sm">Yükleniyor...</p>
          </div>
        ) : duyurular.length === 0 ? (
          <div className="p-12 rounded-2xl border border-white/5 bg-[#17111f]/60 backdrop-blur-xl text-center">
            <Megaphone className="mx-auto text-[#6b6276] mb-4" size={40} />
            <p className="text-[#8b8296] text-sm">
              Henüz yayınlanmış bir duyuru bulunmuyor.
            </p>
          </div>
        ) : (
          duyurular.map((duyuru) => (
            <div
              key={duyuru.id}
              className="p-6 rounded-2xl border border-white/5 bg-[#17111f]/60 backdrop-blur-xl hover:border-white/10 transition"
            >
              <div className="flex items-center gap-2.5 mb-3 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium border border-white/10 text-[#8b8296] bg-white/5">
                  Duyuru
                </span>
                <span className="text-xs text-[#6b6276] flex items-center gap-1.5">
                  <Calendar size={11} />
                  {new Date(duyuru.createdAt).toLocaleString("tr-TR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <h2 className="text-xl font-bold text-white mb-3">
                {duyuru.baslik}
              </h2>
              <p className="text-[#f0e6d2] leading-relaxed whitespace-pre-wrap text-sm">
                {duyuru.icerik}
              </p>
              <div className="mt-4 pt-4 border-t border-white/5">
                <p className="text-xs text-[#6b6276]">
                  Loxford Roleplay Yönetimi
                </p>
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
}