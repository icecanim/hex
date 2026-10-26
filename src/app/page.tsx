import Image from "next/image";
import { Gamepad2, Mic, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen text-white">
      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-16">
        <div className="relative max-w-3xl w-full text-center">
          <div className="w-20 h-20 mx-auto mb-8 flex items-center justify-center">
            <Image
              src="/loxford-logo.png"
              alt="Loxford"
              width={80}
              height={80}
              className="object-contain"
              priority
            />
          </div>

          <h1
            className="text-5xl md:text-7xl font-black mb-5 text-white tracking-widest"
            style={{ fontFamily: "var(--font-cinzel)" }}
          >
            LOXFORD
          </h1>
          <p className="text-[#8b8296] text-base md:text-lg max-w-xl mx-auto mb-10 leading-relaxed">
            Büyücülük evreninin kapıları açılıyor. Sunucumuza bağlan, topluluğa
            katıl, hikayeni yaz.
          </p>

          <div className="inline-flex items-center gap-5 px-5 py-3 rounded-full border border-white/10 bg-white/5 backdrop-blur text-sm">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-[#8b8296]">IP:</span>
              <strong className="text-white">95.135.1.16:27015</strong>
            </span>
            <span className="w-px h-4 bg-white/10" />
            <span className="text-[#8b8296]">
              <strong className="text-green-400">112</strong> / 128 oyuncu
            </span>
          </div>
        </div>
      </section>

      {/* 2 KART */}
      <section className="max-w-4xl mx-auto px-6 -mt-16 relative z-10 grid md:grid-cols-2 gap-5 pb-24">
        {/* Kart 1 - GMod */}
        <div className="group p-7 rounded-2xl border border-white/5 bg-[#17111f]/60 backdrop-blur-xl hover:border-white/10 hover:bg-[#1f1729]/60 transition">
          <div className="w-12 h-12 mb-5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition">
            <Gamepad2 className="text-white" size={22} />
          </div>
          <h3 className="font-bold text-lg mb-2 text-white">Sunucuya Bağlan</h3>
          <p className="text-[#8b8296] text-sm mb-6 leading-relaxed">
            Garry's Mod Roleplay sunucumuza doğrudan katıl.
          </p>
          <button className="w-full py-2.5 rounded-lg border border-white/10 text-[#8b8296] hover:text-white hover:bg-white/5 transition font-medium text-sm flex items-center justify-center gap-2">
            Bağlan
            <ArrowRight size={14} />
          </button>
        </div>

        {/* Kart 2 - TS3 */}
        <div className="group p-7 rounded-2xl border border-white/5 bg-[#17111f]/60 backdrop-blur-xl hover:border-white/10 hover:bg-[#1f1729]/60 transition">
          <div className="w-12 h-12 mb-5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition">
            <Mic className="text-white" size={22} />
          </div>
          <h3 className="font-bold text-lg mb-2 text-white">TS3 Bağlan</h3>
          <p className="text-[#8b8296] text-sm mb-6 leading-relaxed">
            TeamSpeak 3 sunucumuza sesli katılım sağla.
          </p>
          <button className="w-full py-2.5 rounded-lg border border-white/10 text-[#8b8296] hover:text-white hover:bg-white/5 transition font-medium text-sm flex items-center justify-center gap-2">
            Bağlan
            <ArrowRight size={14} />
          </button>
        </div>
      </section>
    </div>
  );
}