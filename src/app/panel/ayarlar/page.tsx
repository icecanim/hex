"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, User, Bell, Shield, LogOut } from "lucide-react";

export default function Ayarlar() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/giris");
    }
  }, [status, router]);

  if (status === "loading" || !session) {
    return (
      <div className="min-h-screen text-white flex items-center justify-center">
        <div className="text-amber-400 text-xl">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white">
      <section className="relative pt-32 pb-8 px-6">
        <div className="relative max-w-4xl mx-auto">
          <Link
            href="/panel"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-amber-400 transition mb-6"
          >
            <ArrowLeft size={16} />
            Panele Dön
          </Link>

          <h1 className="text-4xl md:text-5xl font-black text-amber-400 mb-2">
            AYARLAR
          </h1>
          <p className="text-gray-400">
            Hesap ve profil ayarlarını buradan yönetebilirsin.
          </p>
          <div className="mt-6 w-24 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 pb-6">
        <div className="p-8 rounded-3xl border border-amber-500/30 bg-black/60 backdrop-blur">
          <h2 className="text-xl font-bold text-amber-400 mb-6 flex items-center gap-2">
            <User size={20} />
            Profil Bilgileri
          </h2>

          <div className="flex items-center gap-6 flex-wrap">
            {session.user?.image && (
              <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-amber-500/40">
                <Image
                  src={session.user.image}
                  alt={session.user.name || "Kullanıcı"}
                  width={96}
                  height={96}
                />
              </div>
            )}
            <div className="flex-1 space-y-3">
              <div>
                <label className="text-xs text-gray-500 uppercase">
                  Kullanıcı Adı
                </label>
                <p className="text-white text-lg font-semibold">
                  {session.user?.name}
                </p>
              </div>
              <div>
                <label className="text-xs text-gray-500 uppercase">
                  E-posta
                </label>
                <p className="text-gray-300">{session.user?.email}</p>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 rounded-lg bg-amber-500/10 border border-amber-500/30 text-sm text-gray-300">
            <p>
              <strong className="text-amber-400">Not:</strong> Profil bilgileri
              Discord hesabından alınır. Değiştirmek için Discord ayarlarını
              kullanmalısın.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 pb-20 space-y-4">
        <div className="p-6 rounded-2xl border border-amber-500/20 bg-black/60 backdrop-blur">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
                <Bell className="text-amber-400" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-white">Bildirimler</h3>
                <p className="text-gray-400 text-sm">
                  Duyuru ve başvuru bildirimlerini al
                </p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-semibold border border-gray-500/40 text-gray-400">
              Yakında
            </span>
          </div>
        </div>

        <div className="p-6 rounded-2xl border border-amber-500/20 bg-black/60 backdrop-blur">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
                <Shield className="text-amber-400" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-white">Güvenlik</h3>
                <p className="text-gray-400 text-sm">
                  Hesap güvenlik ayarları
                </p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-semibold border border-gray-500/40 text-gray-400">
              Yakında
            </span>
          </div>
        </div>

        <div className="p-6 rounded-2xl border border-amber-500/20 bg-black/60 backdrop-blur">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#5865F2]/20 border border-[#5865F2]/40 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 127.14 96.36"
                  className="w-6 h-6 fill-[#5865F2]"
                >
                  <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-white">Discord Bağlantısı</h3>
                <p className="text-green-400 text-sm">
                  ✅ Bağlı ({session.user?.name})
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-2xl border border-red-500/30 bg-red-500/5 backdrop-blur">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center justify-center">
                <LogOut className="text-red-400" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-white">Çıkış Yap</h3>
                <p className="text-gray-400 text-sm">
                  Hesabından güvenli şekilde çıkış yap
                </p>
              </div>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="px-5 py-2 rounded-lg bg-red-500 hover:bg-red-400 text-white font-semibold transition"
            >
              Çıkış Yap
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}