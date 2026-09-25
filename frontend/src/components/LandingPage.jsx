import { ArrowRight, ShieldCheck, Search, MapPin } from "lucide-react";

const FontImport = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600&display=swap');
    .font-display { font-family: 'Fraunces', serif; }
    .font-sans { font-family: 'Inter', sans-serif; }
  `}</style>
);

export default function LandingPage({ onStart }) {
  return (
    <div className="min-h-screen bg-[#14161A] font-sans text-[#EDEAE3]">
      <FontImport />

      <header className="border-b border-white/[0.06]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6 lg:px-10">
          <div className="flex items-center gap-2.5 text-lg font-medium tracking-tight">
            <ShieldCheck size={20} strokeWidth={1.6} className="text-[#C9A24B]" />
            <span className="font-display">
              Safe<span className="text-[#C9A24B]">Stay</span>
            </span>
          </div>
          <span className="hidden text-xs tracking-wide text-[#8A8680] sm:block">
            Stay informed before you stay
          </span>
        </div>
      </header>

      <main>
        {/* HERO */}
        <section className="mx-auto max-w-6xl px-6 py-24 lg:px-10">
          <div className="grid gap-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <h1 className="font-display text-5xl font-medium leading-[1.12] tracking-tight text-[#F4F1EA] sm:text-6xl">
                Find a place.
                <br />
                Know before you
                <br />
                move in.
              </h1>

              <p className="mt-7 max-w-lg text-[15px] leading-7 text-[#9B968C]">
                Search PGs and rooms by location, budget, and preference.
                Investigate any listing using public information before you
                make your move.
              </p>

              <div className="mt-10 flex flex-wrap items-center gap-6">
                <button
                  type="button"
                  onClick={onStart}
                  className="inline-flex items-center gap-2 rounded-md bg-[#C9A24B] px-6 py-3.5 text-sm font-medium text-[#14161A] transition-colors hover:bg-[#D6B26A]"
                >
                  Find Safe Stays
                  <ArrowRight size={16} />
                </button>
                <p className="text-xs uppercase tracking-[0.14em] text-[#6E6A62]">
                  2 free searches · No account required
                </p>
              </div>
            </div>

            {/* Right: a single, quiet sample panel — no motion, no glow */}
            <div className="rounded-xl border border-white/[0.08] bg-[#1B1E24] p-6">
              <div className="flex items-start justify-between border-b border-white/[0.06] pb-4">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.14em] text-[#6E6A62]">
                    Sample investigation
                  </p>
                  <p className="font-display mt-1 text-lg text-[#F4F1EA]">
                    Neelam PG, Sector 15
                  </p>
                </div>
                <span className="rounded-full border border-[#6E9277]/40 bg-[#6E9277]/10 px-3 py-1 text-[11px] font-medium text-[#8FB596]">
                  Verified
                </span>
              </div>

              <div className="mt-4 space-y-2.5 text-sm">
                <Row label="Rating" value="4.7 · 38 reviews" />
                <Row label="Public reports" value="None found" />
                <Row label="Nearby" value="Market, medical store, transit" />
              </div>

              <p className="mt-4 border-t border-white/[0.06] pt-4 text-xs leading-5 text-[#75716A]">
                No complaints or news mentions found for this address, based
                on available public search results.
              </p>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="border-y border-white/[0.06] bg-[#17191E] py-20">
          <div className="mx-auto max-w-6xl px-6 lg:px-10">
            <p className="text-xs uppercase tracking-[0.14em] text-[#C9A24B]">How it works</p>
            <h2 className="font-display mt-3 max-w-xl text-3xl text-[#F4F1EA] sm:text-4xl">
              From search to stay.
            </h2>

            <div className="mt-12 grid gap-px overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.06] md:grid-cols-3">
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
          <h2 className="font-display text-3xl text-[#F4F1EA] sm:text-4xl">
            Your next stay deserves a closer look.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-[#9B968C]">
            Explore available stays and investigate the ones that interest you.
          </p>
          <button
            type="button"
            onClick={onStart}
            className="mt-9 inline-flex items-center gap-2 rounded-md border border-white/[0.12] px-6 py-3.5 text-sm font-medium text-[#F4F1EA] transition-colors hover:border-[#C9A24B]/50 hover:text-[#C9A24B]"
          >
            Start exploring
            <ArrowRight size={16} />
          </button>
        </section>
      </main>

      <footer className="border-t border-white/[0.06] px-6 py-8 text-xs text-[#6E6A62] lg:px-10">
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
      <span className="text-[#75716A]">{label}</span>
      <span className="text-[#D8D4CB]">{value}</span>
    </div>
  );
}

function Step({ n, icon, title, text }) {
  return (
    <div className="bg-[#17191E] p-7">
      <div className="flex items-center justify-between">
        <span className="text-xs tracking-[0.14em] text-[#5A564F]">{n}</span>
        <span className="text-[#C9A24B]">{icon}</span>
      </div>
      <h3 className="mt-8 text-base font-medium text-[#F4F1EA]">{title}</h3>
      <p className="mt-2.5 text-sm leading-6 text-[#8A8680]">{text}</p>
    </div>
  );
}
