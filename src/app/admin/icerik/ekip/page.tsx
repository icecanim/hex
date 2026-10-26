"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  UsersRound,
  Plus,
  Trash2,
  Save,
  Edit2,
  X,
} from "lucide-react";

type Uye = {
  id: string;
  isim: string;
  rol: string;
  ikon: string;
  renk: string;
  sira: number;
};

const renkSecenekleri = [
  { isim: "Kırmızı", deger: "from-red-500 to-red-700" },
  { isim: "Turuncu", deger: "from-orange-500 to-orange-700" },
  { isim: "Altın", deger: "from-amber-500 to-amber-700" },
  { isim: "Sarı", deger: "from-yellow-500 to-yellow-700" },
  { isim: "Yeşil", deger: "from-green-500 to-green-700" },
  { isim: "Mavi", deger: "from-blue-500 to-blue-700" },
  { isim: "Mor", deger: "from-purple-500 to-purple-700" },
  { isim: "Pembe", deger: "from-pink-500 to-pink-700" },
];

const ikonSecenekleri = [
  "👑",
  "⚔️",
  "🛡️",
  "🔮",
  "🪄",
  "🏛️",
  "🎓",
  "🦉",
  "🐍",
  "🦁",
];

export default function EkipEditor() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [adminMi, setAdminMi] = useState(false);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [uyeler, setUyeler] = useState<Uye[]>([]);

  const [yeniIsim, setYeniIsim] = useState("");
  const [yeniRol, setYeniRol] = useState("");
  const [yeniIkon, setYeniIkon] = useState("👤");
  const [yeniRenk, setYeniRenk] = useState("from-amber-500 to-amber-700");

  const [duzenlenen, setDuzenlenen] = useState<string | null>(null);
  const [editIsim, setEditIsim] = useState("");
  const [editRol, setEditRol] = useState("");
  const [editIkon, setEditIkon] = useState("");
  const [editRenk, setEditRenk] = useState("");

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
            uyeleriCek();
            setYukleniyor(false);
          } else {
            router.push("/panel");
          }
        })
        .catch(() => router.push("/panel"));
    }
  }, [status, router]);

  const uyeleriCek = () => {
    fetch("/api/admin/ekip")
      .then((r) => r.json())
      .then((data) => {
        if (data.uyeler) setUyeler(data.uyeler);
      });
  };

  const apiCagir = async (govde: any) => {
    const yanit = await fetch("/api/admin/ekip", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(govde),
    });
    if (yanit.ok) uyeleriCek();
    return yanit.ok;
  };

  const uyeEkle = async () => {
    if (!yeniIsim.trim() || !yeniRol.trim()) return;
    await apiCagir({
      aksiyon: "ekle",
      veri: {
        isim: yeniIsim,
        rol: yeniRol,
        ikon: yeniIkon,
        renk: yeniRenk,
      },
    });
    setYeniIsim("");
    setYeniRol("");
    setYeniIkon("👤");
    setYeniRenk("from-amber-500 to-amber-700");
  };

  const uyeSil = async (id: string) => {
    if (!confirm("Bu üyeyi silmek istediğinden emin misin?")) return;
    await apiCagir({ aksiyon: "sil", id });
  };

  const duzenlemeyeBasla = (u: Uye) => {
    setDuzenlenen(u.id);
    setEditIsim(u.isim);
    setEditRol(u.rol);
    setEditIkon(u.ikon);
    setEditRenk(u.renk);
  };

  const guncelle = async (id: string) => {
    if (!editIsim.trim() || !editRol.trim()) return;
    const basarili = await apiCagir({
      aksiyon: "guncelle",
      id,
      veri: {
        isim: editIsim,
        rol: editRol,
        ikon: editIkon,
        renk: editRenk,
      },
    });
    if (basarili) setDuzenlenen(null);
  };

  if (status === "loading" || yukleniyor) {
    return (
      <div className="min-h-screen text-white flex items-center justify-center">
        <div className="text-[#8b8296] text-sm">Yükleniyor...</div>
      </div>
    );
  }

  if (!adminMi) return null;

  return (
    <div className="min-h-screen text-white">
      {/* BAŞLIK */}
      <section className="relative pt-32 pb-8 px-6">
        <div className="relative max-w-5xl mx-auto">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-[#8b8296] hover:text-white transition mb-6 text-sm"
          >
            <ArrowLeft size={14} />
            Admin Paneline Dön
          </Link>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
              <UsersRound className="text-white" size={20} />
            </div>
            <h1
              className="text-3xl md:text-4xl font-black text-white tracking-wide"
              style={{ fontFamily: "var(--font-cinzel)" }}
            >
              EKİP YÖNETİMİ
            </h1>
          </div>
          <p className="text-[#8b8296] text-sm">
            Ekip üyelerini buradan yönetebilirsin.
          </p>
        </div>
      </section>

      {/* YENİ ÜYE */}
      <section className="max-w-5xl mx-auto px-6 pb-6">
        <div className="p-5 rounded-2xl border border-white/5 bg-[#17111f]/60 backdrop-blur-xl">
          <h2 className="text-sm font-semibold text-white mb-3">
            Yeni Üye Ekle
          </h2>
          <div className="grid md:grid-cols-4 gap-2 mb-3">
            <input
              type="text"
              value={yeniIsim}
              onChange={(e) => setYeniIsim(e.target.value)}
              placeholder="İsim (Örn: Kurucu)"
              className="px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 focus:border-white/20 outline-none text-white text-sm"
            />
            <input
              type="text"
              value={yeniRol}
              onChange={(e) => setYeniRol(e.target.value)}
              placeholder="Rol (Örn: Founder)"
              className="px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 focus:border-white/20 outline-none text-white text-sm"
            />
            <select
              value={yeniIkon}
              onChange={(e) => setYeniIkon(e.target.value)}
              className="px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 focus:border-white/20 outline-none text-white text-sm"
            >
              {ikonSecenekleri.map((ik) => (
                <option key={ik} value={ik} className="bg-[#17111f]">
                  {ik}
                </option>
              ))}
            </select>
            <select
              value={yeniRenk}
              onChange={(e) => setYeniRenk(e.target.value)}
              className="px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 focus:border-white/20 outline-none text-white text-sm"
            >
              {renkSecenekleri.map((r) => (
                <option
                  key={r.deger}
                  value={r.deger}
                  className="bg-[#17111f]"
                >
                  {r.isim}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={uyeEkle}
            className="w-full py-2.5 rounded-lg bg-white text-[#0f0a14] font-semibold hover:bg-[#f0e6d2] transition flex items-center justify-center gap-1.5 text-sm"
          >
            <Plus size={16} />
            Ekle
          </button>
        </div>
      </section>

      {/* ÜYE LİSTESİ */}
      <section className="max-w-5xl mx-auto px-6 pb-20 space-y-3">
        {uyeler.map((u) => (
          <div
            key={u.id}
            className="p-5 rounded-2xl border border-white/5 bg-[#17111f]/60 backdrop-blur-xl"
          >
            {duzenlenen === u.id ? (
              <div className="space-y-3">
                <div className="grid md:grid-cols-4 gap-2">
                  <input
                    type="text"
                    value={editIsim}
                    onChange={(e) => setEditIsim(e.target.value)}
                    className="px-3 py-2 rounded-lg bg-white/5 border border-white/20 focus:border-white/40 outline-none text-white text-sm"
                  />
                  <input
                    type="text"
                    value={editRol}
                    onChange={(e) => setEditRol(e.target.value)}
                    className="px-3 py-2 rounded-lg bg-white/5 border border-white/20 focus:border-white/40 outline-none text-white text-sm"
                  />
                  <select
                    value={editIkon}
                    onChange={(e) => setEditIkon(e.target.value)}
                    className="px-3 py-2 rounded-lg bg-white/5 border border-white/20 text-white text-sm"
                  >
                    {ikonSecenekleri.map((ik) => (
                      <option key={ik} value={ik} className="bg-[#17111f]">
                        {ik}
                      </option>
                    ))}
                  </select>
                  <select
                    value={editRenk}
                    onChange={(e) => setEditRenk(e.target.value)}
                    className="px-3 py-2 rounded-lg bg-white/5 border border-white/20 text-white text-sm"
                  >
                    {renkSecenekleri.map((r) => (
                      <option
                        key={r.deger}
                        value={r.deger}
                        className="bg-[#17111f]"
                      >
                        {r.isim}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => guncelle(u.id)}
                    className="flex-1 py-2 rounded-lg bg-green-500/20 border border-green-500/40 text-green-400 hover:bg-green-500/30 font-semibold transition flex items-center justify-center gap-1.5 text-sm"
                  >
                    <Save size={14} />
                    Kaydet
                  </button>
                  <button
                    onClick={() => setDuzenlenen(null)}
                    className="px-3 py-2 rounded-lg border border-white/10 text-[#8b8296] hover:bg-white/5 text-sm"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4 flex-wrap">
                <div
                  className={`w-14 h-14 rounded-xl bg-gradient-to-br ${u.renk} flex items-center justify-center text-2xl shadow-lg flex-shrink-0`}
                >
                  {u.ikon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-white">
                    {u.isim}
                  </h3>
                  <p className="text-[#8b8296] text-xs">{u.rol}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => duzenlemeyeBasla(u)}
                    className="px-3 py-1.5 rounded-lg border border-white/10 text-[#8b8296] hover:text-white hover:bg-white/5 transition flex items-center gap-1.5 text-xs"
                  >
                    <Edit2 size={12} />
                    Düzenle
                  </button>
                  <button
                    onClick={() => uyeSil(u.id)}
                    className="px-3 py-1.5 rounded-lg border border-white/10 text-[#d97777] hover:bg-white/5 transition flex items-center gap-1.5 text-xs"
                  >
                    <Trash2 size={12} />
                    Sil
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </section>
    </div>
  );
}