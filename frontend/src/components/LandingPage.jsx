import { ArrowRight, ShieldCheck, Search, MapPin } from "lucide-react";
import ThemeToggle from "./ThemeToggle.jsx";

const FontImport = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600&display=swap');
    .font-display { font-family: 'Fraunces', serif; }
    .font-sans { font-family: 'Inter', sans-serif; }
  `}</style>
);

export default function LandingPage({ onStart }) {
  return (
    // FIX: page background is now a richer, slightly deeper cream (#F2EBDC
    // vs the previous near-white #F7F5F0) so cards and sections have
    // something to visually sit ON TOP OF, instead of blending in.
    <div className="min-h-screen bg-[#F2EBDC] font-sans text-[#1B1E24] dark:bg-[#14161A] dark:text-[#EDEAE3]">
      <FontImport />

      <header className="border-b border-[#E0D5BC] dark:border-white/[0.06]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6 lg:px-10">
          <div className="flex items-center gap-2.5 text-lg font-medium tracking-tight">
            <ShieldCheck size={20} strokeWidth={1.6} className="text-[#C9A24B]" />
            <span className="font-display">
              Safe<span className="text-[#C9A24B]">Stay</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden text-xs tracking-wide text-[#6B6354] sm:block dark:text-[#8A8680]">
              Stay informed before you stay
            </span>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main>
        {/* HERO */}
        <section className="mx-auto max-w-6xl px-6 py-24 lg:px-10">
          <div className="grid gap-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <h1 className="font-display text-5xl font-medium leading-[1.12] tracking-tight text-[#1B1E24] dark:text-[#F4F1EA] sm:text-6xl">
                Find a place.
                <br />
                Know before you
                <br />
                move in.
              </h1>

              <p className="mt-7 max-w-lg text-[15px] leading-7 text-[#6B6354] dark:text-[#9B968C]">
                Search PGs and rooms by location, budget, and preference.
                Investigate any listing using public information before you
                make your move.
              </p>

              <div className="mt-10 flex flex-wrap items-center gap-6">
                <button
                  type="button"
                  onClick={onStart}
                  className="inline-flex items-center gap-2 rounded-md bg-[#C9A24B] px-6 py-3.5 text-sm font-medium text-[#14161A] shadow-[0_2px_8px_rgba(201,162,75,0.35)] transition-colors hover:bg-[#B8923F]"
                >
                  Find Safe Stays
                  <ArrowRight size={16} />
                </button>
                <p className="text-xs uppercase tracking-[0.14em] text-[#8A8168] dark:text-[#6E6A62]">
                  2 free searches · No account required
                </p>
              </div>
            </div>

            {/* FIX: real border color (not faint black opacity) + a soft
                shadow so this card actually lifts off the page background */}
            <div className="rounded-xl border border-[#E0D5BC] bg-white p-6 shadow-[0_4px_20px_rgba(90,80,50,0.08)] dark:border-white/[0.08] dark:bg-[#1B1E24] dark:shadow-none">
              <div className="flex items-start justify-between border-b border-[#EDE6D4] pb-4 dark:border-white/[0.06]">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.14em] text-[#8A8168] dark:text-[#6E6A62]">
                    Sample investigation
                  </p>
                  <p className="font-display mt-1 text-lg text-[#1B1E24] dark:text-[#F4F1EA]">
                    Neelam PG, Sector 15
                  </p>
                </div>
                <span className="rounded-full border border-[#4A7A54]/30 bg-[#4A7A54]/[0.08] px-3 py-1 text-[11px] font-medium text-[#3D6645] dark:border-[#6E9277]/40 dark:bg-[#6E9277]/10 dark:text-[#8FB596]">
                  Verified
                </span>
              </div>

              <div className="mt-4 space-y-2.5 text-sm">
                <Row label="Rating" value="4.7 · 38 reviews" />
                <Row label="Public reports" value="None found" />
                <Row label="Nearby" value="Market, medical store, transit" />
              </div>

              <p className="mt-4 border-t border-[#EDE6D4] pt-4 text-xs leading-5 text-[#6B6354] dark:border-white/[0.06] dark:text-[#75716A]">
                No complaints or news mentions found for this address, based
                on available public search results.
              </p>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS — FIX: a visibly distinct section tone (not the
            same near-white as the cards), so it reads as its own band */}
        <section className="border-y border-[#E0D5BC] bg-[#EAE2CC] dark:border-white/[0.06] dark:bg-[#17191E] py-20">
          <div className="mx-auto max-w-6xl px-6 lg:px-10">
            <p className="text-xs uppercase tracking-[0.14em] text-[#9C7A1F] dark:text-[#C9A24B]">How it works</p>
            <h2 className="font-display mt-3 max-w-xl text-3xl text-[#1B1E24] dark:text-[#F4F1EA] sm:text-4xl">
              From search to stay.
            </h2>

            <div className="mt-12 grid gap-px overflow-hidden rounded-xl border border-[#DCD1B4] bg-[#DCD1B4] dark:border-white/[0.06] dark:bg-white/[0.06] md:grid-cols-3">
              <Step
                n="01"
                icon={<Search size={18} />}
                title="Find a stay"
                text="Search PGs and rooms by city, area, budget, and preference."
              />
              <Step
                n="02"
                icon={<ShieldCheck size={18} />}
                title="Investigate it"
                text="Open a listing and check available public information, news, and neighborhood context."
              />
              <Step
                n="03"
                icon={<MapPin size={18} />}
                title="Decide with confidence"
                text="Review the evidence before you contact or visit a property."
              />
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="mx-auto max-w-3xl px-6 py-24 text-center lg:px-10">
          <h2 className="font-display text-3xl text-[#1B1E24] dark:text-[#F4F1EA] sm:text-4xl">
            Your next stay deserves a closer look.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-[#6B6354] dark:text-[#9B968C]">
            Explore available stays and investigate the ones that interest you.
          </p>
          <button
            type="button"
            onClick={onStart}
            className="mt-9 inline-flex items-center gap-2 rounded-md border border-[#C9A24B]/50 bg-white px-6 py-3.5 text-sm font-medium text-[#1B1E24] shadow-sm transition-colors hover:border-[#C9A24B] hover:text-[#9C7A1F] dark:border-white/[0.12] dark:bg-transparent dark:text-[#F4F1EA] dark:shadow-none dark:hover:border-[#C9A24B]/50 dark:hover:text-[#C9A24B]"
          >
            Start exploring
            <ArrowRight size={16} />
          </button>
        </section>
      </main>

      <footer className="border-t border-[#E0D5BC] bg-[#EAE2CC] px-6 py-8 text-xs text-[#8A8168] dark:border-white/[0.06] dark:bg-[#14161A] dark:text-[#6E6A62] lg:px-10">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <span>© {new Date().getFullYear()} SafeStay</span>
          <span className="tracking-[0.1em]">Investigate before you decide.</span>
        </div>
      </footer>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between text-[13px]">
      <span className="text-[#8A8168] dark:text-[#75716A]">{label}</span>
      <span className="text-[#1B1E24] dark:text-[#D8D4CB]">{value}</span>
    </div>
  );
}

function Step({ n, icon, title, text }) {
  return (
    <div className="bg-white p-7 dark:bg-[#17191E]">
      <div className="flex items-center justify-between">
        <span className="text-xs tracking-[0.14em] text-[#B0A585] dark:text-[#5A564F]">{n}</span>
        <span className="text-[#C9A24B]">{icon}</span>
      </div>
      <h3 className="mt-8 text-base font-medium text-[#1B1E24] dark:text-[#F4F1EA]">{title}</h3>
      <p className="mt-2.5 text-sm leading-6 text-[#6B6354] dark:text-[#8A8680]">{text}</p>
    </div>
  );
}