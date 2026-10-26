"use client";

import { useEffect, useState } from "react";
import { UsersRound } from "lucide-react";

type Uye = {
  id: string;
  isim: string;
  rol: string;
  ikon: string;
  renk: string;
  sira: number;
};

export default function Ekip() {
  const [uyeler, setUyeler] = useState<Uye[]>([]);
  const [yukleniyor, setYukleniyor] = useState(true);

  useEffect(() => {
    fetch("/api/ekip")
      .then((r) => r.json())
      .then((data) => {
        if (data.uyeler) setUyeler(data.uyeler);
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
            <UsersRound className="text-white" size={24} />
          </div>
          <h1
            className="text-4xl md:text-6xl font-black text-white tracking-widest mb-3"
            style={{ fontFamily: "var(--font-cinzel)" }}
          >
            EKİBİMİZ
          </h1>
          <p className="text-[#8b8296]">Loxford Roleplay Yetkili Kadrosu</p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-20">
        {yukleniyor ? (
          <div className="p-12 rounded-2xl border border-white/5 bg-[#17111f]/60 backdrop-blur-xl text-center">
            <p className="text-[#8b8296] text-sm">Yükleniyor...</p>
          </div>
        ) : uyeler.length === 0 ? (
          <div className="p-12 rounded-2xl border border-white/5 bg-[#17111f]/60 backdrop-blur-xl text-center">
            <p className="text-[#8b8296] text-sm">
              Henüz ekip üyesi eklenmemiş.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {uyeler.map((u) => (
              <div
                key={u.id}
                className="group p-6 rounded-2xl border border-white/5 bg-[#17111f]/60 backdrop-blur-xl hover:border-white/10 hover:bg-[#1f1729]/60 transition text-center"
              >
                <div
                  className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${u.renk} flex items-center justify-center text-2xl shadow-lg group-hover:scale-105 transition`}
                >
                  {u.ikon}
                </div>
                <h3 className="text-base font-semibold text-white mb-1">
                  {u.isim}
                </h3>
                <p className="text-[#8b8296] text-xs">{u.rol}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}