import { useState } from "react";
import {
  ArrowRight,
  IndianRupee,
  MapPin,
  Search,
  ShieldCheck,
  Users,
  SlidersHorizontal,
} from "lucide-react";

function SearchForm({ onSearch, loading }) {
  const [city, setCity] = useState("");
  const [area, setArea] = useState("");
  const [budget, setBudget] = useState("");
  const [gender, setGender] = useState("female");

  function handleSubmit(event) {
    event.preventDefault();
    onSearch({ city, area, budget, gender });
  }

  return (
    <section className="mx-auto max-w-4xl">
      {/* HEADER */}
      <div className="mb-8">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#C9A24B]/25 bg-[#C9A24B]/[0.07] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#9C7A1F] dark:border-[#C9A24B]/20 dark:text-[#C9A24B]">
          <Search size={11} />
          Find a stay
        </div>

        <h1 className="font-display text-3xl leading-tight tracking-tight text-[#1B1E24] dark:text-[#F4F1EA] sm:text-4xl">
          Where are you looking?
        </h1>

        <p className="mt-3 max-w-xl text-sm leading-6 text-[#5A564F] dark:text-[#8A8680]">
          Tell us where you want to stay and what you're looking for.
          We'll find available listings you can investigate.
        </p>
      </div>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="overflow-hidden rounded-2xl border border-[#DDD5C7] bg-white shadow-[0_8px_35px_rgba(75,65,45,0.06)] dark:border-white/[0.07] dark:bg-[#1B1E24] dark:shadow-none"
      >
        {/* LOCATION */}
        <div className="p-6 sm:p-8">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#C9A24B]/10">
              <MapPin
                size={17}
                className="text-[#B18A32] dark:text-[#D6B26A]"
              />
            </div>

            <div>
              <h2 className="text-sm font-semibold text-[#1B1E24] dark:text-[#EDEAE3]">
                Choose your location
              </h2>

              <p className="mt-1 text-xs text-[#8A8680] dark:text-[#6E6A62]">
                Start with a city and your preferred locality.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <Field
              id="city"
              label="City"
              icon={MapPin}
              value={city}
              onChange={setCity}
              placeholder="e.g. Chandigarh"
              required
            />

            <Field
              id="area"
              label="Preferred area"
              icon={Search}
              value={area}
              onChange={setArea}
              placeholder="e.g. Sector 15"
              required
            />
          </div>
        </div>

        {/* DIVIDER */}
        <div className="mx-6 h-px bg-[#EDE7DC] dark:bg-white/[0.06] sm:mx-8" />

        {/* PREFERENCES */}
        <div className="p-6 sm:p-8">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#C9A24B]/10">
              <SlidersHorizontal
                size={16}
                className="text-[#B18A32] dark:text-[#D6B26A]"
              />
            </div>

            <div>
              <h2 className="text-sm font-semibold text-[#1B1E24] dark:text-[#EDEAE3]">
                Refine your search
              </h2>

              <p className="mt-1 text-xs text-[#8A8680] dark:text-[#6E6A62]">
                These preferences help narrow down the results.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {/* BUDGET */}
            <div>
              <label
                htmlFor="budget"
                className="mb-2.5 block text-xs font-medium text-[#5A564F] dark:text-[#9B968C]"
              >
                Monthly budget
                <span className="ml-1 font-normal text-[#A9A093]">
                  optional
                </span>
              </label>

              <div className="relative">
                <IndianRupee
                  size={15}
                  strokeWidth={1.7}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#8A8680] dark:text-[#6E6A62]"
                />

                <input
                  id="budget"
                  type="number"
                  min="0"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="e.g. 12000"
                  className="h-14 w-full rounded-xl border border-[#DED7CB] bg-[#FAF9F6] pl-11 pr-4 text-sm text-[#1B1E24] outline-none transition-all placeholder:text-[#B0AAA0] hover:border-[#CFC6B6] focus:border-[#C9A24B]/70 focus:bg-white focus:ring-4 focus:ring-[#C9A24B]/[0.08] dark:border-white/[0.08] dark:bg-[#14161A] dark:text-[#EDEAE3] dark:placeholder:text-[#5A564F] dark:hover:border-white/[0.13] dark:focus:border-[#C9A24B]/50 dark:focus:bg-[#14161A]"
                />
              </div>

              <p className="mt-2 text-[10px] leading-4 text-[#9A9285] dark:text-[#6E6A62]">
                Used to find relevant listings. Public rent information is
                shown during investigation when available.
              </p>
            </div>

            {/* GENDER */}
            <div>
              <label
                htmlFor="lookingFor"
                className="mb-2.5 block text-xs font-medium text-[#5A564F] dark:text-[#9B968C]"
              >
                Looking for
              </label>

              <div className="relative">
                <Users
                  size={15}
                  className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-[#8A8680] dark:text-[#6E6A62]"
                />

                <select
                  id="lookingFor"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="h-14 w-full cursor-pointer appearance-none rounded-xl border border-[#DED7CB] bg-[#FAF9F6] pl-11 pr-10 text-sm text-[#1B1E24] outline-none transition-all hover:border-[#CFC6B6] focus:border-[#C9A24B]/70 focus:bg-white focus:ring-4 focus:ring-[#C9A24B]/[0.08] dark:border-white/[0.08] dark:bg-[#14161A] dark:text-[#EDEAE3] dark:hover:border-white/[0.13] dark:focus:border-[#C9A24B]/50"
                >
                  <option value="female">Girls PG</option>
                  <option value="male">Boys PG</option>
                  <option value="coed">Co-ed PG</option>
                  <option value="couple">Couple / Family friendly</option>
                  <option value="">Any</option>
                </select>

                <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#8A8680]">
                  <svg
                    width="12"
                    height="7"
                    viewBox="0 0 12 7"
                    fill="none"
                  >
                    <path
                      d="M1 1L6 6L11 1"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>

              <p className="mt-2 text-[10px] leading-4 text-[#9A9285] dark:text-[#6E6A62]">
                Choose the type of stay you're looking for.
              </p>
            </div>
          </div>
        </div>

        {/* ACTION AREA */}
        <div className="border-t border-[#E8E1D6] bg-[#F8F6F1] p-6 dark:border-white/[0.06] dark:bg-[#17191E] sm:px-8 sm:py-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#4A7A54]/10">
                <ShieldCheck
                  size={15}
                  className="text-[#4A7A54] dark:text-[#6E9277]"
                />
              </div>

              <div>
                <p className="text-xs font-semibold text-[#403C35] dark:text-[#D8D4CB]">
                  Investigate before you decide
                </p>

                <p className="mt-1 max-w-sm text-[10px] leading-4 text-[#8A8680] dark:text-[#6E6A62]">
                  Once you find a stay, SafeStay can check available public
                  web, news, and neighborhood information.
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group flex h-14 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#1B1E24] px-7 text-sm font-medium text-white shadow-[0_4px_14px_rgba(27,30,36,0.12)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#292D34] hover:shadow-[0_7px_20px_rgba(27,30,36,0.18)] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-[#EDEAE3] dark:text-[#1B1E24] dark:hover:bg-white"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white dark:border-[#1B1E24]/30 dark:border-t-[#1B1E24]" />
                  <span>Finding stays...</span>
                </>
              ) : (
                <>
                  <Search size={16} />
                  <span>Find Safe Stays</span>
                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* FOOT NOTE */}
      <div className="mt-5 flex flex-col gap-2 text-[10px] text-[#8A8680] dark:text-[#6E6A62] sm:flex-row sm:items-center sm:justify-between">
        <span>Results use available public listing information.</span>

        <span className="tracking-[0.08em]">
          2 FREE SEARCHES · NO ACCOUNT REQUIRED
        </span>
      </div>
    </section>
  );
}

function Field({
  id,
  label,
  icon: Icon,
  value,
  onChange,
  placeholder,
  required = false,
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2.5 flex items-center gap-1 text-xs font-medium text-[#5A564F] dark:text-[#9B968C]"
      >
        {label}

        {required && (
          <span className="text-[#C9A24B]" aria-hidden="true">
            *
          </span>
        )}
      </label>

      <div className="relative">
        <Icon
          size={15}
          strokeWidth={1.7}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#8A8680] dark:text-[#6E6A62]"
        />

        <input
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          className="h-14 w-full rounded-xl border border-[#DED7CB] bg-[#FAF9F6] pl-11 pr-4 text-sm text-[#1B1E24] outline-none transition-all placeholder:text-[#B0AAA0] hover:border-[#CFC6B6] focus:border-[#C9A24B]/70 focus:bg-white focus:ring-4 focus:ring-[#C9A24B]/[0.08] dark:border-white/[0.08] dark:bg-[#14161A] dark:text-[#EDEAE3] dark:placeholder:text-[#5A564F] dark:hover:border-white/[0.13] dark:focus:border-[#C9A24B]/50 dark:focus:bg-[#14161A]"
        />
      </div>
    </div>
  );
}

export default SearchForm;