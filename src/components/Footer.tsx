import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[#0f0a14]/60 backdrop-blur-xl mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-3 gap-10 mb-10">
          {/* SOL - LOGO + SLOGAN */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg overflow-hidden flex items-center justify-center">
                <Image
                  src="/loxford-logo.png"
                  alt="Loxford"
                  width={36}
                  height={36}
                  className="object-contain"
                />
              </div>
              <span
                className="text-lg font-bold tracking-wider text-white"
                style={{ fontFamily: "var(--font-cinzel)" }}
              >
                LOXFORD
              </span>
            </div>
            <p className="text-[#8b8296] text-sm leading-relaxed">
              Hikayeni yaz. Mirasını bırak.
            </p>
          </div>

          {/* ORTA - LİNKLER */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4">
              Hızlı Erişim
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/"
                  className="text-[#8b8296] hover:text-white transition"
                >
                  Ana Sayfa
                </Link>
              </li>
              <li>
                <Link
                  href="/kurallar"
                  className="text-[#8b8296] hover:text-white transition"
                >
                  Kurallar
                </Link>
              </li>
              <li>
                <Link
                  href="/basvuru"
                  className="text-[#8b8296] hover:text-white transition"
                >
                  Başvuru
                </Link>
              </li>
              <li>
                <Link
                  href="/market"
                  className="text-[#8b8296] hover:text-white transition"
                >
                  Market
                </Link>
              </li>
            </ul>
          </div>

          {/* SAĞ - SOSYAL */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4">Bağlantı</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://discord.gg/loxford"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#8b8296] hover:text-white transition"
                >
                  Discord
                </a>
              </li>
              <li>
                <a
                  href="https://steamcommunity.com/groups/loxford"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#8b8296] hover:text-white transition"
                >
                  Steam Grubu
                </a>
              </li>
              <li>
                <a
                  href="https://youtube.com/@loxfordrp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#8b8296] hover:text-white transition"
                >
                  YouTube
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* ALT - COPYRIGHT */}
        <div className="pt-8 border-t border-white/5 text-center">
          <p className="text-[#6b6276] text-xs">
            © {new Date().getFullYear()} Loxford Roleplay. Tüm hakları
            saklıdır.
          </p>
        </div>
      </div>
    </footer>
  );
}