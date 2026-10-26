"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";

const ipuclari = [
  "Sunucuya bağlanmak için IP'yi kopyala",
  "Whitelist başvurusu yapmayı unutma",
  "Karakterini oluştur ve hikayeni yaz",
  "Seherbaz olmak ister misin?",
  "Bakanlıkta görev almak ister misin?",
  "Discord sunucumuza katıl",
  "Hogwarts seni bekliyor",
  "Büyücülük dünyasına adım at",
];

export default function LoadingScreen({
  onFinish,
}: {
  onFinish: () => void;
}) {
  const { data: session } = useSession();
  const [yuzde, setYuzde] = useState(0);
  const [ipucuIndex, setIpucuIndex] = useState(0);
  const [kapaniyor, setKapaniyor] = useState(false);

  // Yükleme çubuğu
  useEffect(() => {
    const sure = 2500;
    const adim = 50;
    const toplamAdim = sure / adim;
    let mevcutAdim = 0;

    const interval = setInterval(() => {
      mevcutAdim++;
      const yeniYuzde = Math.min(
        100,
        Math.floor((mevcutAdim / toplamAdim) * 100)
      );
      setYuzde(yeniYuzde);

      if (mevcutAdim >= toplamAdim) {
        clearInterval(interval);
      }
    }, adim);

    return () => clearInterval(interval);
  }, []);

  // İpucu değiştirme
  useEffect(() => {
    const interval = setInterval(() => {
      setIpucuIndex((prev) => (prev + 1) % ipuclari.length);
    }, 700);

    return () => clearInterval(interval);
  }, []);

  // Bittiğinde kapat
  useEffect(() => {
    if (yuzde >= 100) {
      setTimeout(() => {
        setKapaniyor(true);
        setTimeout(onFinish, 500);
      }, 300);
    }
  }, [yuzde, onFinish]);

  const atla = () => {
    setKapaniyor(true);
    setTimeout(onFinish, 300);
  };

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center transition-opacity duration-500 ${
        kapaniyor ? "opacity-0" : "opacity-100"
      }`}
      style={{
        backgroundImage: "url('/hogwarts-bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Hafif karartma */}
      <div className="absolute inset-0 bg-[#0f0a14]/85" />

      {/* İçerik */}
      <div className="relative z-10 flex flex-col items-center px-6 w-full max-w-2xl">
        {/* LOGO */}
        <div className="relative mb-8">
          <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-[#17111f]/80 border border-white/10 flex items-center justify-center shadow-2xl">
            <Image
              src="/loxford-logo.png"
              alt="Loxford"
              width={96}
              height={96}
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* BAŞLIK */}
        <h1
          className="text-4xl md:text-5xl font-black text-white tracking-widest mb-3 text-center"
          style={{ fontFamily: "var(--font-cinzel)" }}
        >
          LOXFORD
        </h1>
        <p className="text-[#8b8296] text-sm mb-14 text-center">
          Büyücülük dünyasının kapıları açılıyor...
        </p>

        {/* YÜKLEME ÇUBUĞU */}
        <div className="w-full max-w-md mb-6">
          <div className="flex justify-between items-center mb-3 text-xs text-[#8b8296]">
            <span>Yükleniyor...</span>
            <span className="text-white font-medium">{yuzde}%</span>
          </div>
          <div className="h-1 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-100 ease-linear"
              style={{ width: `${yuzde}%` }}
            />
          </div>
        </div>

        {/* İPUCU */}
        <div className="h-10 flex items-center justify-center text-center">
          <p
            key={ipucuIndex}
            className="text-[#8b8296] text-sm"
            style={{ opacity: 0.9 }}
          >
            {ipuclari[ipucuIndex]}
          </p>
        </div>

        {/* HOŞ GELDİN */}
        {session?.user && yuzde >= 80 && (
          <div className="mt-8">
            <p
              className="text-2xl md:text-3xl font-black text-white text-center"
              style={{ fontFamily: "var(--font-cinzel)" }}
            >
              Hoş Geldin, {session.user.name?.split(" ")[0]}
            </p>
          </div>
        )}
      </div>

      {/* ATLA */}
      <button
        onClick={atla}
        className="absolute bottom-8 right-8 px-4 py-2 rounded-lg border border-white/10 text-[#8b8296] hover:text-white hover:bg-white/5 transition text-sm"
      >
        Atla →
      </button>
    </div>
  );
}