import {
  ArrowRight,
  ShieldCheck,
  Search,
  MapPin,
  CheckCircle2,
  Star,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";
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
    <div className="min-h-screen bg-[#F5F1E8] font-sans text-[#1B1E24] dark:bg-[#14161A] dark:text-[#EDEAE3]">
      <FontImport />

      {/* HEADER */}
      <header className="border-b border-[#DED5C4] dark:border-white/[0.06]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5 lg:px-10">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#C9A24B]/30 bg-[#C9A24B]/10">
              <ShieldCheck
                size={17}
                strokeWidth={1.7}
                className="text-[#B18A32] dark:text-[#D6B26A]"
              />
            </div>

            <span className="font-display text-xl tracking-tight">
              Safe<span className="text-[#C9A24B]">Stay</span>
            </span>
          </div>

          <div className="flex items-center gap-5">
            <span className="hidden text-[11px] tracking-[0.08em] text-[#7D7567] sm:block dark:text-[#77736C]">
              STAY INFORMED BEFORE YOU STAY
            </span>

            <ThemeToggle />
          </div>
        </div>
      </header>

      <main>
        {/* HERO */}
        <section className="relative overflow-hidden">
          {/* subtle decorative glow */}
          <div className="pointer-events-none absolute -right-40 -top-40 h-96 w-96 rounded-full bg-[#C9A24B]/[0.07] blur-3xl dark:bg-[#C9A24B]/[0.035]" />

          <div className="relative mx-auto max-w-6xl px-6 py-20 lg:px-10 lg:py-28">
            <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
              {/* LEFT */}
              <div>
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#C9A24B]/25 bg-[#C9A24B]/[0.07] px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.14em] text-[#9C7A1F] dark:border-[#C9A24B]/20 dark:text-[#C9A24B]">
                  <Sparkles size={11} />
                  Before you move in
                </div>

                <h1 className="font-display text-[3.4rem] font-medium leading-[1.04] tracking-[-0.035em] text-[#1B1E24] dark:text-[#F4F1EA] sm:text-6xl lg:text-[4.6rem]">
                  Find a place.
                  <br />
                  <span className="text-[#9C7A1F] dark:text-[#C9A24B]">
                    Know it first.
                  </span>
                </h1>

                <p className="mt-7 max-w-xl text-[15px] leading-7 text-[#6B6354] dark:text-[#9B968C]">
                  Search PGs and rooms by location, budget, and preference.
                  Then investigate a listing using publicly available
                  information before you decide to visit or move in.
                </p>

                <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
                  <button
                    type="button"
                    onClick={onStart}
                    className="group inline-flex items-center justify-center gap-2 rounded-lg bg-[#1B1E24] px-6 py-3.5 text-sm font-medium text-white shadow-[0_5px_20px_rgba(27,30,36,0.15)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#292D34] hover:shadow-[0_8px_25px_rgba(27,30,36,0.2)] dark:bg-[#EDEAE3] dark:text-[#1B1E24] dark:hover:bg-white"
                  >
                    Find Safe Stays
                    <ArrowRight
                      size={16}
                      className="transition-transform group-hover:translate-x-0.5"
                    />
                  </button>

                  <span className="text-[11px] uppercase tracking-[0.12em] text-[#8A8168] dark:text-[#6E6A62]">
                    2 free searches · No account required
                  </span>
                </div>
              </div>

              {/* SAMPLE REPORT */}
              <div className="relative">
                <div className="absolute -inset-4 rounded-[2rem] bg-[#C9A24B]/[0.05] blur-2xl" />

                <div className="relative overflow-hidden rounded-2xl border border-[#DDD3C1] bg-white shadow-[0_15px_50px_rgba(75,65,45,0.10)] dark:border-white/[0.07] dark:bg-[#1B1E24] dark:shadow-[0_15px_50px_rgba(0,0,0,0.2)]">
                  {/* top bar */}
                  <div className="flex items-center justify-between border-b border-[#ECE5D8] px-5 py-4 dark:border-white/[0.06]">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#C9A24B]/10">
                        <ShieldCheck
                          size={14}
                          className="text-[#B18A32] dark:text-[#D6B26A]"
                        />
                      </div>

                      <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8A8168] dark:text-[#6E6A62]">
                        Sample investigation
                      </span>
                    </div>

                    <span className="text-[10px] text-[#B0A899] dark:text-[#5A564F]">
                      SafeStay report
                    </span>
                  </div>

                  <div className="p-6 sm:p-7">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-display text-xl text-[#1B1E24] dark:text-[#F4F1EA]">
                          Neelam PG
                        </p>

                        <div className="mt-1.5 flex items-center gap-1.5 text-xs text-[#8A8680] dark:text-[#77736C]">
                          <MapPin size={12} />
                          Sector 15
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 rounded-full border border-[#4A7A54]/25 bg-[#4A7A54]/[0.07] px-3 py-1.5 text-[10px] font-semibold text-[#3D6645] dark:border-[#6E9277]/30 dark:bg-[#6E9277]/[0.08] dark:text-[#8FB596]">
                        <CheckCircle2 size={12} />
                        Verified
                      </div>
                    </div>

                    <div className="mt-7 grid grid-cols-3 gap-3">
                      <MiniStat
                        icon={Star}
                        label="Rating"
                        value="4.7"
                      />
                      <MiniStat
                        label="Reviews"
                        value="38"
                      />
                      <MiniStat
                        label="Reports"
                        value="None"
                      />
                    </div>

                    <div className="mt-5 rounded-xl bg-[#F8F6F1] p-4 dark:bg-[#15171B]">
                      <div className="flex items-center gap-2">
                        <Search
                          size={13}
                          className="text-[#C9A24B]"
                        />
                        <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8A8168] dark:text-[#6E6A62]">
                          Investigation summary
                        </span>
                      </div>

                      <p className="mt-2 text-xs leading-5 text-[#5F594F] dark:text-[#9B968C]">
                        No major complaints or concerning news mentions were
                        found in the available public results.
                      </p>
                    </div>

                    <div className="mt-5 flex items-center justify-between border-t border-[#ECE5D8] pt-4 dark:border-white/[0.06]">
                      <span className="text-[10px] text-[#A29A8C] dark:text-[#625F59]">
                        3 sources checked
                      </span>

                      <span className="inline-flex items-center gap-1 text-[10px] font-medium text-[#9C7A1F] dark:text-[#C9A24B]">
                        View report
                        <ArrowUpRight size={11} />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* TRUST STRIP */}
        <section className="border-y border-[#DED5C4] bg-[#EEE8DB] dark:border-white/[0.06] dark:bg-[#17191E]">
          <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between lg:px-10">
            <div className="flex items-center gap-2.5">
              <ShieldCheck
                size={16}
                className="text-[#C9A24B]"
              />
              <span className="text-xs text-[#5F594F] dark:text-[#9B968C]">
                Public information, brought together in one place.
              </span>
            </div>

            <span className="text-[10px] uppercase tracking-[0.13em] text-[#9A917F] dark:text-[#625F59]">
              Web · News · Neighborhood
            </span>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="mx-auto max-w-6xl px-6 py-20 lg:px-10 lg:py-24">
          <div className="max-w-2xl">
            <p className="text-[10px] font-semibold uppercase tracking-[0.17em] text-[#9C7A1F] dark:text-[#C9A24B]">
              How it works
            </p>

            <h2 className="font-display mt-3 text-3xl leading-tight text-[#1B1E24] dark:text-[#F4F1EA] sm:text-4xl">
              A little research before a big decision.
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-6 text-[#6B6354] dark:text-[#8A8680]">
              SafeStay brings together the information you would otherwise
              have to search for yourself.
            </p>
          </div>

          <div className="mt-12 grid gap-0 overflow-hidden rounded-2xl border border-[#DDD3C1] dark:border-white/[0.07] md:grid-cols-3">
            <Step
              n="01"
              icon={<Search size={18} />}
              title="Find a stay"
              text="Search by city, area, budget, and preference to find relevant PGs and rooms."
            />

            <Step
              n="02"
              icon={<ShieldCheck size={18} />}
              title="Investigate it"
              text="Check available public information, news mentions, reviews, and nearby places."
            />

            <Step
              n="03"
              icon={<MapPin size={18} />}
              title="Make an informed choice"
              text="Read the evidence, understand the limitations, then decide what to do next."
            />
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="border-t border-[#DED5C4] bg-[#EEE8DB] dark:border-white/[0.06] dark:bg-[#17191E]">
          <div className="mx-auto max-w-3xl px-6 py-20 text-center lg:px-10 lg:py-24">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full border border-[#C9A24B]/30 bg-[#C9A24B]/10">
              <ShieldCheck
                size={18}
                className="text-[#B18A32] dark:text-[#D6B26A]"
              />
            </div>

            <h2 className="font-display mt-6 text-3xl leading-tight text-[#1B1E24] dark:text-[#F4F1EA] sm:text-4xl">
              Your next stay deserves a closer look.
            </h2>

            <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-[#6B6354] dark:text-[#9B968C]">
              Explore available stays and investigate the ones that interest
              you before you make your move.
            </p>

            <button
              type="button"
              onClick={onStart}
              className="group mt-8 inline-flex items-center gap-2 rounded-lg bg-[#C9A24B] px-6 py-3.5 text-sm font-medium text-[#17191D] shadow-[0_5px_18px_rgba(201,162,75,0.20)] transition-all hover:-translate-y-0.5 hover:bg-[#B8923F]"
            >
              Start exploring
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </button>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-[#DED5C4] bg-[#E8E0D1] px-6 py-7 text-xs text-[#8A8168] dark:border-white/[0.06] dark:bg-[#14161A] dark:text-[#6E6A62] lg:px-10">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} SafeStay</span>

          <span className="tracking-[0.08em]">
            Investigate before you decide.
          </span>
        </div>
      </footer>
    </div>
  );
}

function MiniStat({ icon: Icon, label, value }) {
  return (
    <div className="rounded-lg border border-[#E5DED1] bg-[#FCFBF8] px-3 py-3 dark:border-white/[0.06] dark:bg-[#202329]">
      <div className="flex items-center gap-1.5">
        {Icon && (
          <Icon
            size={11}
            className="fill-[#C9A24B] text-[#C9A24B]"
          />
        )}

        <span className="text-[9px] uppercase tracking-[0.1em] text-[#9A917F] dark:text-[#6E6A62]">
          {label}
        </span>
      </div>

      <p className="mt-1 text-sm font-medium text-[#1B1E24] dark:text-[#D8D4CB]">
        {value}
      </p>
    </div>
  );
}

function Step({ n, icon, title, text }) {
  return (
    <div className="group border-b border-[#DDD3C1] bg-white p-7 last:border-b-0 dark:border-white/[0.06] dark:bg-[#1B1E24] md:border-b-0 md:border-r md:last:border-r-0">
      <div className="flex items-center justify-between">
        <span className="font-display text-lg text-[#B5AA94] dark:text-[#5A564F]">
          {n}
        </span>

        <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#C9A24B]/20 bg-[#C9A24B]/[0.06] text-[#B18A32] transition-transform duration-300 group-hover:-translate-y-0.5 dark:text-[#D6B26A]">
          {icon}
        </span>
      </div>

      <h3 className="mt-9 text-base font-semibold text-[#1B1E24] dark:text-[#F4F1EA]">
        {title}
      </h3>

      <p className="mt-2.5 text-sm leading-6 text-[#6B6354] dark:text-[#8A8680]">
        {text}
      </p>
    </div>
  );
}