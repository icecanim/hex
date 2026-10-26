"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Wand2,
  CheckCircle2,
  AlertCircle,
  X,
  Lock,
  ArrowLeft,
} from "lucide-react";

export default function WhitelistBasvuru() {
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();

  const [form, setForm] = useState({
    ad: "",
    yas: "",
    gmodSaat: "",
    karakter: "",
    oncekiRol: "",
    oncekiRolDetay: "",
    aktifSaat: "",
  });

  const [gonderildi, setGonderildi] = useState(false);
  const [yukleniyor, setYukleniyor] = useState(false);
  const [kontrolYukleniyor, setKontrolYukleniyor] = useState(true);
  const [basvuruVar, setBasvuruVar] = useState<any>(null);
  const [banli, setBanli] = useState(false);
  const [banBilgi, setBanBilgi] = useState<any>(null);
  const [modalAcik, setModalAcik] = useState(false);

  useEffect(() => {
    if (sessionStatus === "loading") return;
    if (sessionStatus === "unauthenticated") {
      router.push("/giris");
      return;
    }

    fetch("/api/basvuru/kontrol?tur=Whitelist Başvurusu")
      .then((r) => r.json())
      .then((data) => {
        if (data.banli) {
          setBanli(true);
          setBanBilgi(data);
        }
        if (data.basvuruVar) setBasvuruVar(data.basvuru);
        setKontrolYukleniyor(false);
      })
      .catch(() => setKontrolYukleniyor(false));
  }, [sessionStatus, router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (basvuruVar) {
      setModalAcik(true);
      return;
    }

    setYukleniyor(true);

    try {
      const yanit = await fetch("/api/basvuru", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tur: "Whitelist Başvurusu",
          veriler: {
            "Discord ID": (session?.user as any)?.discordId || "",
            "Adınız": form.ad,
            "Yaşınız": form.yas,
            "GMod Saatiniz": form.gmodSaat,
            "Karakter": form.karakter,
            "Daha Önce Rol": form.oncekiRol,
            "Önceki Rol Detay": form.oncekiRolDetay || "-",
            "Aktif Saat": form.aktifSaat,
          },
        }),
      });

      const data = await yanit.json();

      if (yanit.ok && data.basarili) {
        setGonderildi(true);
      } else if (yanit.status === 409) {
        if (data.banBitis) {
          setBanli(true);
          setBanBilgi(data);
        } else {
          setModalAcik(true);
        }
        setBasvuruVar(data.mevcutBasvuru);
      } else {
        alert(data.hata || "Başvuru gönderilemedi.");
      }
    } catch (hata) {
      alert("Sunucuya bağlanılamadı.");
    } finally {
      setYukleniyor(false);
    }
  };

  if (sessionStatus === "loading" || kontrolYukleniyor) {
    return (
      <div className="min-h-screen text-white flex items-center justify-center">
        <div className="text-[#8b8296] text-sm">Yükleniyor...</div>
      </div>
    );
  }

  // BANLI
  if (banli) {
    const banBitisTarihi = banBilgi?.banBitis
      ? new Date(banBilgi.banBitis).toLocaleString("tr-TR")
      : "Bilinmiyor";

    return (
      <div className="min-h-screen text-white flex items-center justify-center px-6">
        <div className="max-w-lg w-full p-10 rounded-2xl border border-red-500/20 bg-[#17111f]/60 backdrop-blur-xl text-center">
          <Lock className="mx-auto text-red-400 mb-6" size={48} />
          <h1
            className="text-3xl font-black text-white mb-4 tracking-wide"
            style={{ fontFamily: "var(--font-cinzel)" }}
          >
            BANLANDINIZ
          </h1>
          <p className="text-[#8b8296] text-sm mb-6">
            Tekrar eden başvuru spam'ı nedeniyle geçici olarak banlandınız.
          </p>
          <div className="p-4 rounded-lg border border-red-500/20 bg-red-500/5 text-left mb-6">
            <p className="text-xs text-[#8b8296] mb-2">
              <strong className="text-red-400">Sebep:</strong>{" "}
              {banBilgi?.banSebep || "Başvuru spam"}
            </p>
            <p className="text-xs text-[#8b8296]">
              <strong className="text-red-400">Ban Bitiş:</strong>{" "}
              {banBitisTarihi}
            </p>
          </div>
          <Link
            href="/"
            className="inline-block px-5 py-2.5 rounded-lg bg-white text-[#0f0a14] font-semibold hover:bg-[#f0e6d2] transition text-sm"
          >
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    );
  }

  // GÖNDERİLDİ
  if (gonderildi) {
    return (
      <div className="min-h-screen text-white flex items-center justify-center px-6">
        <div className="max-w-lg w-full p-10 rounded-2xl border border-green-500/20 bg-[#17111f]/60 backdrop-blur-xl text-center">
          <CheckCircle2 className="mx-auto text-green-400 mb-6" size={48} />
          <h1
            className="text-3xl font-black text-white mb-4 tracking-wide"
            style={{ fontFamily: "var(--font-cinzel)" }}
          >
            Başvurun Alındı
          </h1>
          <p className="text-[#8b8296] text-sm mb-8">
            Başvurun yetkililer tarafından incelenecek. Sonuç Discord üzerinden
            bildirilecektir.
          </p>
          <Link
            href="/basvuru"
            className="inline-block px-5 py-2.5 rounded-lg bg-white text-[#0f0a14] font-semibold hover:bg-[#f0e6d2] transition text-sm"
          >
            Başvurulara Dön
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white">
      {/* BAŞLIK */}
      <section className="relative pt-32 pb-12 px-6">
        <div className="relative max-w-3xl mx-auto">
          <Link
            href="/basvuru"
            className="inline-flex items-center gap-2 text-[#8b8296] hover:text-white transition mb-6 text-sm"
          >
            <ArrowLeft size={14} />
            Başvurulara Dön
          </Link>

          <div className="text-center">
            <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
              <Wand2 className="text-white" size={24} />
            </div>
            <h1
              className="text-3xl md:text-4xl font-black text-white tracking-widest mb-3"
              style={{ fontFamily: "var(--font-cinzel)" }}
            >
              WHITELIST
            </h1>
            <p className="text-[#8b8296] text-sm">
              Sunucuya giriş için zorunlu başvuru
            </p>
          </div>
        </div>
      </section>

      {/* FORM */}
      <section className="max-w-3xl mx-auto px-6 pb-20">
        {basvuruVar && (
          <div className="p-4 rounded-lg border border-yellow-500/20 bg-yellow-500/5 mb-5 flex items-start gap-2.5">
            <AlertCircle
              className="text-yellow-400 flex-shrink-0 mt-0.5"
              size={16}
            />
            <div className="text-xs text-yellow-200/90">
              Bu türe zaten başvurdunuz. Tekrar göndermeye çalışırsanız uyarı
              alırsınız.
            </div>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="p-6 md:p-8 rounded-2xl border border-white/5 bg-[#17111f]/60 backdrop-blur-xl space-y-5"
        >
          <div>
            <label className="block text-[#8b8296] text-xs font-medium mb-2">
              Adınız (IC İsim)
            </label>
            <input
              required
              type="text"
              name="ad"
              value={form.ad}
              onChange={handleChange}
              placeholder="Örn: Harry Potter"
              className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 focus:border-white/20 outline-none text-white text-sm"
            />
          </div>

          <div>
            <label className="block text-[#8b8296] text-xs font-medium mb-2">
              Yaşınız
            </label>
            <input
              required
              type="number"
              name="yas"
              value={form.yas}
              onChange={handleChange}
              placeholder="Örn: 18"
              className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 focus:border-white/20 outline-none text-white text-sm"
            />
          </div>

          <div>
            <label className="block text-[#8b8296] text-xs font-medium mb-2">
              Garry's Mod Saatiniz
            </label>
            <input
              required
              type="number"
              name="gmodSaat"
              value={form.gmodSaat}
              onChange={handleChange}
              placeholder="Örn: 1500"
              className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 focus:border-white/20 outline-none text-white text-sm"
            />
          </div>

          <div>
            <label className="block text-[#8b8296] text-xs font-medium mb-2">
              Başvurmak İstediğiniz Karakter
            </label>
            <input
              required
              type="text"
              name="karakter"
              value={form.karakter}
              onChange={handleChange}
              placeholder="Örn: Hermione Granger"
              className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 focus:border-white/20 outline-none text-white text-sm"
            />
          </div>

          <div>
            <label className="block text-[#8b8296] text-xs font-medium mb-2">
              Daha Önce Herhangi Bir Rolde Bulundunuz mu?
            </label>
            <input
              required
              type="text"
              name="oncekiRol"
              value={form.oncekiRol}
              onChange={handleChange}
              placeholder="Evet / Hayır"
              className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 focus:border-white/20 outline-none text-white text-sm"
            />
          </div>

          <div>
            <label className="block text-[#8b8296] text-xs font-medium mb-2">
              Daha Önce Bulunduğunuz Roller
            </label>
            <textarea
              rows={3}
              name="oncekiRolDetay"
              value={form.oncekiRolDetay}
              onChange={handleChange}
              placeholder="Örn: Seherbaz (3 ay), Profesör (2 ay)"
              className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 focus:border-white/20 outline-none text-white text-sm resize-none"
            />
          </div>

          <div>
            <label className="block text-[#8b8296] text-xs font-medium mb-2">
              Günde Kaç Saat Aktif Olabilirsiniz?
            </label>
            <input
              required
              type="text"
              name="aktifSaat"
              value={form.aktifSaat}
              onChange={handleChange}
              placeholder="Örn: 4-6 saat"
              className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 focus:border-white/20 outline-none text-white text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={yukleniyor}
            className="w-full py-3 rounded-lg bg-white text-[#0f0a14] font-semibold hover:bg-[#f0e6d2] transition disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            {yukleniyor ? "Gönderiliyor..." : "Başvuruyu Gönder"}
          </button>
        </form>
      </section>

      {/* MODAL */}
      {modalAcik && basvuruVar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur">
          <div className="w-full max-w-lg p-7 rounded-2xl border border-white/10 bg-[#17111f]">
            <div className="flex items-center justify-between mb-5">
              <h2
                className="text-xl font-bold text-yellow-400 flex items-center gap-2"
                style={{ fontFamily: "var(--font-cinzel)" }}
              >
                <AlertCircle size={20} />
                ZATEN BAŞVURDUNUZ
              </h2>
              <button
                onClick={() => setModalAcik(false)}
                className="text-[#8b8296] hover:text-white transition"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-4 rounded-lg border border-white/5 bg-white/[0.02] mb-5">
              <p className="text-xs text-[#8b8296] mb-1">Başvuru Türü</p>
              <p className="text-white font-medium text-sm mb-3">
                {basvuruVar.tur}
              </p>

              <p className="text-xs text-[#8b8296] mb-1">Durum</p>
              <p className="text-white font-medium text-sm mb-3">
                {basvuruVar.durum === "beklemede" && "Beklemede"}
                {basvuruVar.durum === "onaylandi" && "Onaylandı"}
                {basvuruVar.durum === "reddedildi" && "Reddedildi"}
              </p>

              {basvuruVar.mulakat && (
                <>
                  <p className="text-xs text-[#8b8296] mb-1">
                    Mülakat Tarihi
                  </p>
                  <p className="text-white font-medium text-sm mb-3">
                    {basvuruVar.mulakat}
                  </p>
                </>
              )}

              <p className="text-xs text-[#8b8296] mb-1">Başvuru Tarihi</p>
              <p className="text-white font-medium text-sm">
                {new Date(basvuruVar.createdAt).toLocaleString("tr-TR")}
              </p>
            </div>

            <div className="p-3 rounded-lg border border-red-500/20 bg-red-500/5 mb-5">
              <p className="text-red-400 text-xs">
                Tekrar başvuru göndermeye çalışırsanız uyarı alırsınız. 3.
                denemede 24 saat banlanırsınız.
              </p>
            </div>

            <button
              onClick={() => setModalAcik(false)}
              className="w-full py-2.5 rounded-lg bg-white text-[#0f0a14] font-semibold hover:bg-[#f0e6d2] transition text-sm"
            >
              Anladım, Kapat
            </button>
          </div>
        </div>
      )}
    </div>
  );
}