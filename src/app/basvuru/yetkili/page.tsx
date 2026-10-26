"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Shield,
  CheckCircle2,
  AlertCircle,
  X,
  Lock,
  ArrowLeft,
} from "lucide-react";

export default function YetkiliBasvuru() {
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();

  const [form, setForm] = useState({
    ad: "",
    icAd: "",
    yas: "",
    uyariAldi: "",
    banGecmisi: "",
    gmodSaat: "",
    steamId: "",
    darkrpBilgi: "",
    aktifSaat: "",
    aktifZaman: "",
    yetkiliBilgi: "",
    nedenYetkili: "",
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

    fetch("/api/basvuru/kontrol?tur=Yetkili Başvurusu")
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
          tur: "Yetkili Başvurusu",
          veriler: {
            "Discord ID": (session?.user as any)?.discordId || "",
            "Adınız Nedir": form.ad,
            "IC Adınız Nedir": form.icAd,
            "Yaşınız Nedir": form.yas,
            "Oyun İçi Uyarı Aldınız mı?": form.uyariAldi,
            "Ban Geçmişi": form.banGecmisi,
            "Toplam GMod Saatiniz": form.gmodSaat,
            "Steam ID": form.steamId,
            "DarkRP Bilginiz": form.darkrpBilgi,
            "Günde Kaç Saat Aktif Olabilirsiniz": form.aktifSaat,
            "Hangi Saatlerde Aktif Olabilirsiniz": form.aktifZaman,
            "Yetkili Olma Konusunda Bilginiz": form.yetkiliBilgi,
            "Neden Yetkili Olmak İstiyorsunuz": form.nedenYetkili,
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
            style={{ color: "#0f0a14" }}
            className="inline-block px-5 py-2.5 rounded-lg !bg-[#f0e6d2] hover:!bg-white font-bold transition text-sm"
          >
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    );
  }

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
            Yetkili başvurun yetkililer tarafından incelenecek. Sonuç Discord
            üzerinden bildirilecektir.
          </p>
          <Link
            href="/basvuru"
            style={{ color: "#0f0a14" }}
            className="inline-block px-5 py-2.5 rounded-lg !bg-[#f0e6d2] hover:!bg-white font-bold transition text-sm"
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
              <Shield className="text-white" size={24} />
            </div>
            <h1
              className="text-3xl md:text-4xl font-black text-white tracking-widest mb-3"
              style={{ fontFamily: "var(--font-cinzel)" }}
            >
              YETKİLİ BAŞVURUSU
            </h1>
            <p className="text-[#8b8296] text-sm">
              Sunucuda moderatör/yetkili olmak için başvur
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
              Adınız Nedir?
            </label>
            <input
              required
              type="text"
              name="ad"
              value={form.ad}
              onChange={handleChange}
              placeholder="Gerçek adınız"
              className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 focus:border-white/20 outline-none text-white text-sm"
            />
          </div>

          <div>
            <label className="block text-[#8b8296] text-xs font-medium mb-2">
              IC Adınız Nedir?
            </label>
            <input
              required
              type="text"
              name="icAd"
              value={form.icAd}
              onChange={handleChange}
              placeholder="Karakterinizin tam adı"
              className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 focus:border-white/20 outline-none text-white text-sm"
            />
          </div>

          <div>
            <label className="block text-[#8b8296] text-xs font-medium mb-2">
              Yaşınız Nedir?
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
              Oyun İçi Uyarı Aldınız mı? Neden? (Warn/Sözlü Uyarı)
            </label>
            <textarea
              required
              rows={3}
              name="uyariAldi"
              value={form.uyariAldi}
              onChange={handleChange}
              placeholder="Aldıysanız nedenini yazın, almadıysanız 'Hayır' yazın"
              className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 focus:border-white/20 outline-none text-white text-sm resize-none"
            />
          </div>

          <div>
            <label className="block text-[#8b8296] text-xs font-medium mb-2">
              Sunucumuzda Daha Önce Yasaklanma Cezası Aldınız mı? Aldıysanız Neden?
            </label>
            <textarea
              required
              rows={3}
              name="banGecmisi"
              value={form.banGecmisi}
              onChange={handleChange}
              placeholder="Aldıysanız nedenini yazın, almadıysanız 'Hayır' yazın"
              className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 focus:border-white/20 outline-none text-white text-sm resize-none"
            />
          </div>

          <div>
            <label className="block text-[#8b8296] text-xs font-medium mb-2">
              Toplam GMod Saatiniz?
            </label>
            <input
              required
              type="number"
              name="gmodSaat"
              value={form.gmodSaat}
              onChange={handleChange}
              placeholder="Örn: 2000"
              className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 focus:border-white/20 outline-none text-white text-sm"
            />
          </div>

          <div>
            <label className="block text-[#8b8296] text-xs font-medium mb-2">
              Steam ID
            </label>
            <input
              required
              type="text"
              name="steamId"
              value={form.steamId}
              onChange={handleChange}
              placeholder="STEAM_0:1:12345678"
              className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 focus:border-white/20 outline-none text-white text-sm"
            />
          </div>

          <div>
            <label className="block text-[#8b8296] text-xs font-medium mb-2">
              DarkRP Bilginiz?
            </label>
            <textarea
              required
              rows={3}
              name="darkrpBilgi"
              value={form.darkrpBilgi}
              onChange={handleChange}
              placeholder="DarkRP hakkında ne kadar bilginiz var?"
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

          <div>
            <label className="block text-[#8b8296] text-xs font-medium mb-2">
              Hangi Saatlerde Aktif Olabilirsiniz?
            </label>
            <input
              required
              type="text"
              name="aktifZaman"
              value={form.aktifZaman}
              onChange={handleChange}
              placeholder="Örn: 18:00 - 23:00"
              className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 focus:border-white/20 outline-none text-white text-sm"
            />
          </div>

          <div>
            <label className="block text-[#8b8296] text-xs font-medium mb-2">
              Yetkili Olma Konusunda Bilginiz Ne Düzeyde?
            </label>
            <textarea
              required
              rows={3}
              name="yetkiliBilgi"
              value={form.yetkiliBilgi}
              onChange={handleChange}
              placeholder="Daha önce yetkili oldunuz mu? Hangi komutları biliyorsunuz?"
              className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 focus:border-white/20 outline-none text-white text-sm resize-none"
            />
          </div>

          <div>
            <label className="block text-[#8b8296] text-xs font-medium mb-2">
              Neden Yetkili Olmak İstiyorsunuz?
            </label>
            <textarea
              required
              rows={4}
              name="nedenYetkili"
              value={form.nedenYetkili}
              onChange={handleChange}
              placeholder="Detaylı açıklayın..."
              className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 focus:border-white/20 outline-none text-white text-sm resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={yukleniyor}
            style={{ color: "#0f0a14" }}
            className="w-full py-3 rounded-lg !bg-[#f0e6d2] hover:!bg-white font-bold transition disabled:opacity-50 disabled:cursor-not-allowed text-sm"
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
              style={{ color: "#0f0a14" }}
              className="w-full py-2.5 rounded-lg !bg-[#f0e6d2] hover:!bg-white font-bold transition text-sm"
            >
              Anladım, Kapat
            </button>
          </div>
        </div>
      )}
    </div>
  );
}