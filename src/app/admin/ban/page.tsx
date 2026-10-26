"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Ban as BanIcon,
  Plus,
  Trash2,
  Shield,
  Clock,
  Search,
  X,
  AlertCircle,
} from "lucide-react";

type Ban = {
  id: string;
  discordId: string | null;
  steamId: string | null;
  sebep: string;
  banlayan: string;
  banBitis: string | null;
  kalici: boolean;
  kaldirildi: boolean;
  kaldiranId: string | null;
  kaldirmaTarihi: string | null;
  createdAt: string;
};

export default function AdminBan() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [adminMi, setAdminMi] = useState(false);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [banlar, setBanlar] = useState<Ban[]>([]);
  const [arama, setArama] = useState("");
  const [filtre, setFiltre] = useState<"aktif" | "kaldirilan" | "tumu">("aktif");
  const [modalAcik, setModalAcik] = useState(false);
  const [islemde, setIslemde] = useState(false);

  const [form, setForm] = useState({
    discordId: "",
    steamId: "",
    sebep: "",
    sure: "24",
    kalici: false,
  });

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
            banlariCek();
            setYukleniyor(false);
          } else {
            router.push("/panel");
          }
        })
        .catch(() => router.push("/panel"));
    }
  }, [status, router]);

  const banlariCek = () => {
    fetch("/api/admin/ban")
      .then((r) => r.json())
      .then((data) => {
        if (data.banlar) setBanlar(data.banlar);
      })
      .catch(() => {});
  };

  const banAt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.discordId && !form.steamId) {
      alert("Discord ID veya Steam ID zorunlu.");
      return;
    }
    if (!form.sebep) {
      alert("Sebep zorunlu.");
      return;
    }

    setIslemde(true);

    try {
      const yanit = await fetch("/api/admin/ban", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (yanit.ok) {
        setModalAcik(false);
        setForm({
          discordId: "",
          steamId: "",
          sebep: "",
          sure: "24",
          kalici: false,
        });
        banlariCek();
      } else {
        alert("Ban atılamadı.");
      }
    } catch (hata) {
      alert("Bir hata oluştu.");
    } finally {
      setIslemde(false);
    }
  };

  const banKaldir = async (id: string) => {
    if (!confirm("Bu banı kaldırmak istediğinden emin misin?")) return;

    try {
      const yanit = await fetch(`/api/admin/ban/${id}`, {
        method: "DELETE",
      });
      if (yanit.ok) banlariCek();
    } catch (hata) {
      console.error(hata);
    }
  };

  if (status === "loading" || yukleniyor) {
    return (
      <div className="min-h-screen text-white flex items-center justify-center">
        <div className="text-[#8b8296] text-sm">Yükleniyor...</div>
      </div>
    );
  }

  if (!adminMi) return null;

  const filtreliBanlar = banlar.filter((b) => {
    if (filtre === "aktif" && b.kaldirildi) return false;
    if (filtre === "kaldirilan" && !b.kaldirildi) return false;

    if (arama) {
      const ara = arama.toLowerCase();
      const discordId = (b.discordId || "").toLowerCase();
      const steamId = (b.steamId || "").toLowerCase();
      const sebep = (b.sebep || "").toLowerCase();
      if (
        !discordId.includes(ara) &&
        !steamId.includes(ara) &&
        !sebep.includes(ara)
      ) {
        return false;
      }
    }
    return true;
  });

  const aktifBanSayisi = banlar.filter((b) => !b.kaldirildi).length;

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

          <div className="flex items-center justify-between gap-4 flex-wrap mb-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                <BanIcon className="text-white" size={20} />
              </div>
              <h1
                className="text-3xl md:text-4xl font-black text-white tracking-wide"
                style={{ fontFamily: "var(--font-cinzel)" }}
              >
                BAN YÖNETİMİ
              </h1>
            </div>

            <button
              onClick={() => setModalAcik(true)}
              style={{ color: "#0f0a14" }}
              className="px-5 py-2.5 rounded-lg !bg-[#f0e6d2] hover:!bg-white font-bold transition flex items-center gap-2 text-sm"
            >
              <Plus size={16} />
              Yeni Ban
            </button>
          </div>
          <p className="text-[#8b8296] text-sm">
            Toplam <strong className="text-white">{aktifBanSayisi}</strong>{" "}
            aktif ban
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
                placeholder="Discord ID, Steam ID veya sebep..."
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
                  setFiltre(e.target.value as "aktif" | "kaldirilan" | "tumu")
                }
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-white/20 outline-none text-white text-sm"
              >
                <option value="aktif">Aktif Banlar</option>
                <option value="kaldirilan">Kaldırılan Banlar</option>
                <option value="tumu">Tümü</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* LİSTE */}
      <section className="max-w-6xl mx-auto px-6 pb-20 space-y-2">
        {filtreliBanlar.length === 0 ? (
          <div className="p-12 rounded-2xl border border-white/5 bg-[#17111f]/60 backdrop-blur-xl text-center">
            <BanIcon className="mx-auto text-[#8b8296] mb-4" size={40} />
            <p className="text-[#8b8296] text-sm">Ban bulunamadı.</p>
          </div>
        ) : (
          filtreliBanlar.map((ban) => {
            const banBitis = ban.banBitis
              ? new Date(ban.banBitis).toLocaleString("tr-TR")
              : null;

            return (
              <div
                key={ban.id}
                className={`p-5 rounded-2xl border backdrop-blur-xl ${
                  ban.kaldirildi
                    ? "border-white/5 bg-[#17111f]/40 opacity-60"
                    : "border-red-500/20 bg-[#17111f]/60"
                }`}
              >
                <div className="flex items-start justify-between gap-4 flex-wrap mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <h3 className="text-base font-semibold text-white">
                        {ban.discordId || ban.steamId}
                      </h3>
                      {ban.kalici ? (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium border border-red-500/40 text-red-400 bg-red-500/10">
                          KALICI
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium border border-yellow-500/30 text-yellow-400 bg-yellow-500/10">
                          SÜRELİ
                        </span>
                      )}
                      {ban.kaldirildi && (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium border border-green-500/30 text-green-400 bg-green-500/10">
                          KALDIRILDI
                        </span>
                      )}
                    </div>

                    <p className="text-[#f0e6d2] text-sm mb-2">
                      <strong className="text-[#8b8296]">Sebep:</strong>{" "}
                      {ban.sebep}
                    </p>

                    {ban.discordId && (
                      <p className="text-[#8b8296] text-xs">
                        Discord: {ban.discordId}
                      </p>
                    )}
                    {ban.steamId && (
                      <p className="text-[#8b8296] text-xs">
                        Steam: {ban.steamId}
                      </p>
                    )}

                    <div className="flex items-center gap-3 text-[#6b6276] text-xs mt-2 flex-wrap">
                      <span className="flex items-center gap-1">
                        <Clock size={11} />
                        {new Date(ban.createdAt).toLocaleString("tr-TR")}
                      </span>
                      {banBitis && (
                        <span className="flex items-center gap-1">
                          Bitiş: {banBitis}
                        </span>
                      )}
                    </div>
                  </div>

                  {!ban.kaldirildi && (
                    <button
                      onClick={() => banKaldir(ban.id)}
                      className="px-3 py-2 rounded-lg border border-white/10 text-[#6bcb77] hover:bg-white/5 transition flex items-center gap-1.5 text-xs"
                    >
                      <Trash2 size={13} />
                      Kaldır
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </section>

      {/* YENİ BAN MODAL */}
      {modalAcik && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur">
          <div className="w-full max-w-lg p-7 rounded-2xl border border-white/10 bg-[#17111f] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2
                className="text-xl font-bold text-white flex items-center gap-2"
                style={{ fontFamily: "var(--font-cinzel)" }}
              >
                <BanIcon size={20} />
                YENİ BAN
              </h2>
              <button
                onClick={() => setModalAcik(false)}
                className="text-[#8b8296] hover:text-white transition"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={banAt} className="space-y-4">
              <div>
                <label className="block text-[#8b8296] text-xs font-medium mb-2">
                  Discord ID (opsiyonel)
                </label>
                <input
                  type="text"
                  value={form.discordId}
                  onChange={(e) =>
                    setForm({ ...form, discordId: e.target.value })
                  }
                  placeholder="Örn: 970981288423080056"
                  className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 focus:border-white/20 outline-none text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-[#8b8296] text-xs font-medium mb-2">
                  Steam ID (opsiyonel)
                </label>
                <input
                  type="text"
                  value={form.steamId}
                  onChange={(e) =>
                    setForm({ ...form, steamId: e.target.value })
                  }
                  placeholder="Örn: STEAM_0:1:12345678"
                  className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 focus:border-white/20 outline-none text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-[#8b8296] text-xs font-medium mb-2">
                  Sebep
                </label>
                <textarea
                  required
                  rows={3}
                  value={form.sebep}
                  onChange={(e) => setForm({ ...form, sebep: e.target.value })}
                  placeholder="Ban sebebini yazın..."
                  className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 focus:border-white/20 outline-none text-white text-sm resize-none"
                />
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg border border-white/10 bg-white/[0.02]">
                <input
                  type="checkbox"
                  id="kalici"
                  checked={form.kalici}
                  onChange={(e) =>
                    setForm({ ...form, kalici: e.target.checked })
                  }
                  className="w-4 h-4 accent-white"
                />
                <label htmlFor="kalici" className="text-white text-sm">
                  Kalıcı ban
                </label>
              </div>

              {!form.kalici && (
                <div>
                  <label className="block text-[#8b8296] text-xs font-medium mb-2">
                    Süre (saat)
                  </label>
                  <input
                    type="number"
                    value={form.sure}
                    onChange={(e) =>
                      setForm({ ...form, sure: e.target.value })
                    }
                    placeholder="Örn: 24"
                    className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 focus:border-white/20 outline-none text-white text-sm"
                  />
                  <p className="text-[#6b6276] text-xs mt-1">
                    Örn: 24 = 1 gün, 168 = 1 hafta
                  </p>
                </div>
              )}

              <div className="p-3 rounded-lg border border-yellow-500/20 bg-yellow-500/5">
                <div className="flex items-start gap-2">
                  <AlertCircle
                    className="text-yellow-400 flex-shrink-0 mt-0.5"
                    size={14}
                  />
                  <p className="text-yellow-200/90 text-xs">
                    Ban atıldığında Discord ID varsa otomatik DM gönderilir.
                  </p>
                </div>
              </div>

              <button
                type="submit"
                disabled={islemde}
                style={{ color: "#0f0a14" }}
                className="w-full py-3 rounded-lg !bg-[#f0e6d2] hover:!bg-white font-bold transition disabled:opacity-50 text-sm"
              >
                {islemde ? "İşleniyor..." : "Ban At"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}