import { useState } from "react";
import { ArrowRight, IndianRupee, MapPin, Search, ShieldCheck, Users } from "lucide-react";

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
    <section className="mx-auto max-w-3xl">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.14em] text-[#C9A24B]">Search stays</p>
        <h1 className="font-display mt-2 text-3xl text-[#F4F1EA]">Find your next stay.</h1>
        <p className="mt-2 max-w-lg text-sm leading-6 text-[#8A8680]">
          Search real listings by location and preferences, then investigate a stay before
          making a decision.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="overflow-hidden rounded-xl border border-white/[0.08] bg-[#1B1E24]"
      >
        <div className="p-6 sm:p-8">
          <p className="text-sm font-medium text-[#EDEAE3]">Where are you looking?</p>
          <p className="mt-1 text-xs text-[#6E6A62]">Start with the city and preferred locality.</p>

          <div className="mt-5 grid gap-3 md:grid-cols-[0.8fr_1.2fr]">
            <Field id="city" label="City" icon={MapPin} value={city} onChange={setCity} placeholder="e.g. Chandigarh" required />
            <Field id="area" label="Preferred area" icon={Search} value={area} onChange={setArea} placeholder="e.g. Sector 15, near university..." required />
          </div>
        </div>

        <div className="mx-6 h-px bg-white/[0.06] sm:mx-8" />

        <div className="p-6 sm:p-8">
          <p className="text-sm font-medium text-[#EDEAE3]">Refine your search</p>
          <p className="mt-1 text-xs text-[#6E6A62]">Optional preferences to narrow down the results.</p>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="budget" className="mb-2.5 block text-xs text-[#9B968C]">
                Maximum monthly budget
              </label>
              <div className="relative">
                <IndianRupee size={16} strokeWidth={1.7} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#6E6A62]" />
                <input
                  id="budget"
                  type="number"
                  min="0"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="e.g. 12000"
                  className="h-14 w-full rounded-md border border-white/[0.08] bg-[#14161A] pl-11 pr-4 text-sm text-[#EDEAE3] outline-none transition placeholder:text-[#5A564F] focus:border-[#C9A24B]/50"
                />
              </div>
              <p className="mt-2 text-[11px] text-[#6E6A62]">Leave empty for any budget.</p>
            </div>

            <div>
              <div className="mb-2.5 flex items-center justify-between">
                <label htmlFor="lookingFor" className="text-xs text-[#9B968C]">Looking for</label>
                <Users size={14} className="text-[#5A564F]" />
              </div>
              <select
                id="lookingFor"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="h-14 w-full appearance-none rounded-md border border-white/[0.08] bg-[#14161A] px-4 text-sm text-[#EDEAE3] outline-none transition focus:border-[#C9A24B]/50"
              >
                <option value="female">Girls PG</option>
                <option value="male">Boys PG</option>
                <option value="coed">Co-ed PG</option>
                <option value="couple">Couple / Family friendly</option>
                <option value="">Any</option>
              </select>
              <p className="mt-2 text-[11px] text-[#6E6A62]">Choose your preferred stay type.</p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/[0.06] bg-[#17191E] p-6 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <ShieldCheck size={16} className="mt-0.5 text-[#C9A24B]" />
              <div>
                <p className="text-xs font-medium text-[#D8D4CB]">Investigate before you decide</p>
                <p className="mt-1 max-w-xs text-[11px] leading-5 text-[#6E6A62]">
                  Search results can be investigated using public web, news, and neighborhood data.
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex h-14 shrink-0 items-center justify-center gap-2 rounded-md bg-[#C9A24B] px-7 text-sm font-medium text-[#14161A] transition hover:bg-[#D6B26A] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#14161A]/30 border-t-[#14161A]" />
                  <span>Finding stays...</span>
                </>
              ) : (
                <>
                  <Search size={16} />
                  <span>Find Safe Stays</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      <div className="mt-5 flex flex-col items-center justify-between gap-2 text-[11px] text-[#6E6A62] sm:flex-row">
        <span>Search uses available public listing information</span>
        <span className="tracking-[0.1em]">2 free searches · No account required</span>
      </div>
    </section>
  );
}

function Field({ id, label, icon: Icon, value, onChange, placeholder, required = false }) {
  return (
    <div>
      <label htmlFor={id} className="mb-2.5 block text-xs text-[#9B968C]">{label}</label>
      <div className="relative">
        <Icon size={16} strokeWidth={1.7} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#6E6A62]" />
        <input
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          className="h-14 w-full rounded-md border border-white/[0.08] bg-[#14161A] pl-11 pr-4 text-sm text-[#EDEAE3] outline-none transition placeholder:text-[#5A564F] focus:border-[#C9A24B]/50"
        />
      </div>
    </div>
  );
}

export default SearchForm;
