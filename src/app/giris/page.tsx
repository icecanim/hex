"use client";

import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";

export default function Giris() {
  const [yukleniyor, setYukleniyor] = useState(false);

  const handleDiscordLogin = async () => {
    setYukleniyor(true);
    await signIn("discord", { callbackUrl: "/" });
  };

  return (
    <div className="min-h-screen text-white flex items-center justify-center px-6">
      <div className="max-w-md w-full p-10 rounded-3xl border border-amber-500/30 bg-black/60 backdrop-blur-md text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-amber-400 transition mb-6 text-sm"
        >
          <ArrowLeft size={16} />
          Ana Sayfaya Dön
        </Link>

        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl overflow-hidden bg-black border border-amber-500/40 flex items-center justify-center">
          <Image
            src="/loxford-logo.png"
            alt="Loxford"
            width={80}
            height={80}
            className="object-contain"
          />
        </div>

        <h1 className="text-3xl font-black text-amber-400 mb-2">
          LOXFORD ROLEPLAY
        </h1>
        <p className="text-gray-400 text-sm mb-8">
          Discord Hesabınızla Giriş Yapın
        </p>

        <button
          onClick={handleDiscordLogin}
          disabled={yukleniyor}
          className="w-full py-4 rounded-lg bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold transition flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 127.14 96.36"
            className="w-6 h-6 fill-current"
          >
            <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z" />
          </svg>
          {yukleniyor ? "Giriş yapılıyor..." : "Discord ile Giriş Yap"}
        </button>

        <p className="text-xs text-gray-500 mt-6">
          Giriş yaparak{" "}
          <Link href="/kurallar" className="text-amber-400 underline">
            kuralları
          </Link>{" "}
          kabul etmiş sayılırsınız.
        </p>
      </div>
    </div>
  );
}