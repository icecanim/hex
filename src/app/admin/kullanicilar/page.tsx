"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Users,
  Search,
  Shield,
  Crown,
  Swords,
  Sparkles,
  Wand2,
  User as UserIcon,
} from "lucide-react";

type Kullanici = {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  discordId: string | null;
  createdAt: string;
};

type Admin = {
  id: string;
  discordId: string;
  isim: string | null;
  rol: string | null;
};

const rolRenkleri: Record<string, { renk: string; ikon: any; label: string }> = {
  kurucu: { renk: "text-red-400", ikon: Crown, label: "Kurucu" },
  "baş admin": { renk: "text-orange-400", ikon: Swords, label: "Baş Admin" },
  admin: { renk: "text-blue-400", ikon: Shield, label: "Admin" },
  moderatör: { renk: "text-green-400", ikon: Sparkles, label: "Moderatör" },
  yetkili: { renk: "text-purple-400", ikon: Wand2, label: "Yetkili" },
};

export default function AdminKullanicilar() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [adminMi, setAdminMi] = useState(false);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [kullanicilar, setKullanicilar] = useState<Kullanici[]>([]);
  const [adminler, setAdminler] = useState<Admin[]>([]);
  const [arama, setArama] = useState("");
  const [filtre, setFiltre] = useState<"tumu" | "yetkili" | "oyuncu">("tumu");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/giris");
      return;
    }
    if (status === "authenticated") {
      fetch("/api/admin/kontrol")
        .then((r) => r.json())
        .then((data) => {
          if (data.adminMi) {
            setAdminMi(true);
            fetch("/api/admin/kullanicilar")
              .then((r) => r.json())
              .then((k) => {
                if (k.kullanicilar) setKullanicilar(k.kullanicilar);
                if (k.adminler) setAdminler(k.adminler);
                setYukleniyor(false);
              })
              .catch(() => setYukleniyor(false));
          } else {
            router.push("/panel");
          }
        })
        .catch(() => router.push("/panel"));
    }
  }, [status, router]);

  if (status === "loading" || yukleniyor) {
    return (
      <div className="min-h-screen text-white flex items-center justify-center">
        <div className="text-[#8b8296] text-sm">Yükleniyor...</div>
      </div>
    );
  }

  if (!adminMi) return null;

  const adminMap = new Map<string, Admin>();
  adminler.forEach((a) => {
    const key = String(a.discordId || "").trim();
    if (key) adminMap.set(key, a);
  });

  const filtreliKullanicilar = kullanicilar.filter((k) => {
    const key = String(k.discordId || "").trim();
    const admin = adminMap.get(key);
    const yetkiliMi = !!admin;

    if (filtre === "yetkili" && !yetkiliMi) return false;
    if (filtre === "oyuncu" && yetkiliMi) return false;

    if (arama) {
      const ara = arama.toLowerCase();
      const isim = (k.name || "").toLowerCase();
      const email = (k.email || "").toLowerCase();
      const discordId = (k.discordId || "").toLowerCase();
      if (
        !isim.includes(ara) &&
        !email.includes(ara) &&
        !discordId.includes(ara)
      ) {
        return false;
      }
    }

    return true;
  });

  const yetkiliSayisi = kullanicilar.filter((k) => {
    const key = String(k.discordId || "").trim();
    return adminMap.has(key);
  }).length;

  return (
    <div className="min-h-screen text-white">
      {/* BAŞLIK */}
      <section className="relative pt-32 pb-8 px-6">
        <div className="relative max-w-6xl mx-auto">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-[#8b8296] hover:text-white transition mb-6 text-sm"
          >
            <ArrowLeft size={14} />
            Admin Paneline Dön
          </Link>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
              <Users className="text-white" size={20} />
            </div>
            <h1
              className="text-3xl md:text-4xl font-black text-white tracking-wide"
              style={{ fontFamily: "var(--font-cinzel)" }}
            >
              KULLANICILAR
            </h1>
          </div>
          <p className="text-[#8b8296] text-sm">
            Toplam{" "}
            <strong className="text-white">{kullanicilar.length}</strong>{" "}
            kullanıcı,{" "}
            <strong className="text-white">{yetkiliSayisi}</strong> yetkili
          </p>
        </div>
      </section>

      {/* FİLTRELER */}
      <section className="max-w-6xl mx-auto px-6 pb-6">
        <div className="p-5 rounded-2xl border border-white/5 bg-[#17111f]/60 backdrop-blur-xl">
          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <label className="block text-[#8b8296] text-xs font-medium mb-2">
                <Search size={11} className="inline mr-1" />
                ARAMA
              </label>
              <input
                type="text"
                value={arama}
                onChange={(e) => setArama(e.target.value)}
                placeholder="İsim, e-posta veya Discord ID..."
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-white/20 outline-none text-white text-sm"
              />
            </div>

            <div>
              <label className="block text-[#8b8296] text-xs font-medium mb-2">
                FİLTRE
              </label>
              <select
                value={filtre}
                onChange={(e) =>
                  setFiltre(e.target.value as "tumu" | "yetkili" | "oyuncu")
                }
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-white/20 outline-none text-white text-sm"
              >
                <option value="tumu">Tümü</option>
                <option value="yetkili">Sadece Yetkililer</option>
                <option value="oyuncu">Sadece Oyuncular</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* LİSTE */}
      <section className="max-w-6xl mx-auto px-6 pb-20 space-y-2">
        {filtreliKullanicilar.length === 0 ? (
          <div className="p-12 rounded-2xl border border-white/5 bg-[#17111f]/60 backdrop-blur-xl text-center">
            <Users className="mx-auto text-[#8b8296] mb-4" size={40} />
            <p className="text-[#8b8296] text-sm">Kullanıcı bulunamadı.</p>
          </div>
        ) : (
          filtreliKullanicilar.map((kullanici) => {
            const key = String(kullanici.discordId || "").trim();
            const admin = adminMap.get(key);
            const rol = admin?.rol?.toLowerCase().trim() || "";
            const rolBilgi = rolRenkleri[rol] || null;
            const RolIkon = rolBilgi?.ikon;

            return (
              <div
                key={kullanici.id}
                className="p-4 rounded-2xl border border-white/5 bg-[#17111f]/60 backdrop-blur-xl hover:border-white/10 transition"
              >
                <div className="flex items-center gap-4 flex-wrap">
                  {kullanici.image ? (
                    <Image
                      src={kullanici.image}
                      alt={kullanici.name || "Kullanıcı"}
                      width={44}
                      height={44}
                      className="rounded-full border border-white/10"
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-full border border-white/10 bg-white/5 flex items-center justify-center">
                      <UserIcon className="text-[#8b8296]" size={20} />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base font-semibold text-white truncate">
                        {kullanici.name || "İsimsiz"}
                      </h3>
                      {rolBilgi && RolIkon && (
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium border border-white/10 bg-white/5 ${rolBilgi.renk} flex items-center gap-1`}
                        >
                          <RolIkon size={10} />
                          {rolBilgi.label}
                        </span>
                      )}
                    </div>
                    <p className="text-[#8b8296] text-xs truncate">
                      {kullanici.email || "E-posta yok"}
                    </p>
                    <p className="text-[#6b6276] text-xs mt-0.5">
                      Discord ID: {kullanici.discordId || "Yok"}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-[#6b6276] text-xs">
                      {new Date(kullanici.createdAt).toLocaleDateString(
                        "tr-TR"
                      )}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </section>
    </div>
  );
}