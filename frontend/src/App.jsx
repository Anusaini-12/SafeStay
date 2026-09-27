import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { ShieldCheck, LogOut } from "lucide-react";

import { auth } from "./firebase.js";
import { searchPGs, investigatePG } from "./api/safestayApi.js";

import LandingPage from "./components/LandingPage.jsx";
import SearchForm from "./components/SearchForm.jsx";
import ListingCard from "./components/ListingCard.jsx";
import ListingDetails from "./components/ListingDetails.jsx";
import AuthScreen from "./components/AuthScreen.jsx";
import ThemeToggle from "./components/ThemeToggle.jsx";

import {
  canSearch,
  getRemainingSearches,
  incrementSearchCount,
  FREE_SEARCH_LIMIT,
} from "./utils/searchLimits.js";

const FontImport = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600&display=swap');
    .font-display { font-family: 'Fraunces', serif; }
    .font-sans { font-family: 'Inter', sans-serif; }
  `}</style>
);

function SafeStayLogo({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Go to SafeStay home"
      className="flex items-center gap-2.5 text-lg font-medium tracking-tight"
    >
      <ShieldCheck size={19} strokeWidth={1.6} className="text-[#C9A24B]" />
      <span className="font-display text-[#1B1E24] dark:text-[#EDEAE3]">
        Safe<span className="text-[#C9A24B]">Stay</span>
      </span>
    </button>
  );
}

// ThemeToggle sits at the end of every top bar's children, so it always
// shows up next to whichever auth buttons are visible on that screen.
function TopBar({ onLogoClick, children }) {
  return (
    <header className="border-b border-black/10 bg-white dark:border-white/[0.06] dark:bg-[#14161A]">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 lg:px-10">
        <SafeStayLogo onClick={onLogoClick} />
        <div className="flex items-center gap-3">
          {children}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

function LoginButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-md border border-[#C9A24B]/40 px-4 py-2 text-sm font-medium text-[#9C7A1F] transition hover:border-[#C9A24B]/60 hover:bg-[#C9A24B]/[0.08] dark:border-[#C9A24B]/30 dark:text-[#D6B26A] dark:hover:bg-[#C9A24B]/[0.06]"
    >
      Login
    </button>
  );
}

function SignOutButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-2 rounded-md border border-black/10 px-4 py-2 text-sm text-[#5A564F] transition hover:border-black/20 hover:text-[#1B1E24] dark:border-white/[0.08] dark:text-[#9B968C] dark:hover:border-white/[0.16] dark:hover:text-[#EDEAE3]"
    >
      <LogOut size={15} />
      <span>Sign out</span>
    </button>
  );
}

function ErrorBanner({ message }) {
  if (!message) return null;
  return (
    <div className="mb-6 rounded-lg border border-[#A3392E]/25 bg-[#A3392E]/[0.06] px-5 py-4 text-sm text-[#A3392E] dark:border-[#B5564A]/30 dark:bg-[#B5564A]/10 dark:text-[#D69187]">
      {message}
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState("landing");
  const [user, setUser] = useState(null);

  const [listings, setListings] = useState([]);
  const [selectedListing, setSelectedListing] = useState(null);
  const [investigationResult, setInvestigationResult] = useState(null);

  const [searchLoading, setSearchLoading] = useState(false);
  const [investigatingId, setInvestigatingId] = useState(null);

  const [error, setError] = useState("");
  const [cityMismatchWarning, setCityMismatchWarning] = useState(false);
  const [remainingSearches, setRemainingSearches] = useState(getRemainingSearches());
  const [authIntent, setAuthIntent] = useState("login");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setRemainingSearches(currentUser ? null : getRemainingSearches());
    });
    return unsubscribe;
  }, []);

  function goToAuth(intent) {
    setAuthIntent(intent);
    setScreen("auth");
  }

  function handleStartSearch() {
    setError("");
    if (user || canSearch()) {
      setScreen("search");
      return;
    }
    goToAuth("signup");
  }

  function handleGoHome() {
    setError("");
    setScreen("landing");
  }

  function handleGoToSearch() {
    setError("");
    if (user || canSearch()) {
      setScreen("search");
      return;
    }
    goToAuth("signup");
  }

  async function handleSearch(formData) {
    setError("");
    setCityMismatchWarning(false);
    if (!user && !canSearch()) {
      goToAuth("signup");
      return;
    }

    try {
      setSearchLoading(true);
      const data = await searchPGs(formData);
      setListings(data.listings || []);
      setCityMismatchWarning(!!data.cityMismatch);

      if (!user) {
        const newCount = incrementSearchCount();
        setRemainingSearches(Math.max(FREE_SEARCH_LIMIT - newCount, 0));
      }

      setScreen("results");
    } catch (err) {
      console.error("Search failed:", err);
      setError(err instanceof Error ? err.message : "Something went wrong while searching.");
    } finally {
      setSearchLoading(false);
    }
  }

  function listingKey(listing) {
    return listing.place_id || listing.id || listing.name;
  }

  async function handleInvestigate(listing) {
    setError("");
    const key = listingKey(listing);

    try {
      setInvestigatingId(key);
      setSelectedListing(listing);
      const result = await investigatePG(listing);
      setInvestigationResult(result);
      setScreen("details");
    } catch (err) {
      console.error("Investigation failed:", err);
      setError(err instanceof Error ? err.message : "Something went wrong while investigating this stay.");
    } finally {
      setInvestigatingId(null);
    }
  }

  async function handleSignOut() {
    setError("");
    try {
      await signOut(auth);
      setUser(null);
      setListings([]);
      setSelectedListing(null);
      setInvestigationResult(null);
      setRemainingSearches(getRemainingSearches());
      goToAuth("login");
    } catch (err) {
      console.error("Sign out failed:", err);
      setError(err instanceof Error ? err.message : "Unable to sign out.");
    }
  }

  function handleAuthenticated() {
    setError("");
    setScreen("search");
  }

  if (screen === "landing") {
    return <LandingPage onStart={handleStartSearch} />;
  }

  if (screen === "auth") {
    return (
      <AuthScreen initialMode={authIntent} onAuthenticated={handleAuthenticated} onBack={handleGoHome} />
    );
  }

  if (screen === "search") {
    return (
      <div className="min-h-screen bg-[#F7F5F0] font-sans text-[#1B1E24] dark:bg-[#14161A] dark:text-[#EDEAE3]">
        <FontImport />
        <TopBar onLogoClick={handleGoHome}>
          {!user && (
            <>
              <span className="hidden text-sm text-[#8A8680] sm:block dark:text-[#6E6A62]">
                {remainingSearches ?? getRemainingSearches()}{" "}
                {(remainingSearches ?? getRemainingSearches()) === 1 ? "search" : "searches"} left
              </span>
              <LoginButton onClick={() => goToAuth("login")} />
            </>
          )}
          {user && (
            <>
              <span className="hidden max-w-[220px] truncate text-sm text-[#8A8680] sm:block dark:text-[#6E6A62]">
                {user.email}
              </span>
              <SignOutButton onClick={handleSignOut} />
            </>
          )}
        </TopBar>

        <main className="mx-auto max-w-4xl px-6 py-16 lg:px-10">
          <div className="mb-10 text-center">
            <p className="mb-3 text-xs uppercase tracking-[0.14em] text-[#9C7A1F] dark:text-[#C9A24B]">
              Find with confidence
            </p>
            <h1 className="font-display text-4xl text-[#1B1E24] dark:text-[#F4F1EA] sm:text-5xl">
              Find a stay you can trust.
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-[#5A564F] dark:text-[#8A8680]">
              Search PGs and rooms, then investigate listings for potential trust and fraud
              signals before you decide.
            </p>
          </div>

          <ErrorBanner message={error} />
          <SearchForm onSearch={handleSearch} loading={searchLoading} />
        </main>
      </div>
    );
  }

  if (screen === "results") {
    return (
      <div className="min-h-screen bg-[#F7F5F0] font-sans text-[#1B1E24] dark:bg-[#14161A] dark:text-[#EDEAE3]">
        <FontImport />
        <TopBar onLogoClick={handleGoHome}>
          {!user ? <LoginButton onClick={() => goToAuth("login")} /> : <SignOutButton onClick={handleSignOut} />}
          <button
            type="button"
            onClick={handleGoToSearch}
            className="rounded-md border border-black/10 px-4 py-2 text-sm text-[#5A564F] transition hover:border-black/20 hover:text-[#1B1E24] dark:border-white/[0.08] dark:text-[#9B968C] dark:hover:border-white/[0.16] dark:hover:text-[#EDEAE3]"
          >
            New Search
          </button>
        </TopBar>

        <main className="mx-auto max-w-6xl px-6 py-10 lg:px-10">
          <ErrorBanner message={error} />

          {cityMismatchWarning && (
            <div className="mb-6 rounded-lg border border-[#C9A24B]/30 bg-[#C9A24B]/[0.08] px-5 py-4 text-sm text-[#7A5F16] dark:border-[#C9A24B]/30 dark:bg-[#C9A24B]/10 dark:text-[#D6B26A]">
              These results didn't clearly match the city you entered — showing the closest
              matches for the area instead. Double-check the address on any listing before
              relying on it.
            </div>
          )}

          <div className="mb-8">
            <p className="text-xs uppercase tracking-[0.14em] text-[#9C7A1F] dark:text-[#C9A24B]">Search results</p>
            <h1 className="font-display mt-2 text-2xl text-[#1B1E24] dark:text-[#F4F1EA]">Places found for you</h1>
            <p className="mt-2 text-sm text-[#5A564F] dark:text-[#8A8680]">Choose a listing to investigate its trust signals.</p>
          </div>

          {listings.length === 0 ? (
            <div className="rounded-xl border border-black/10 bg-white p-10 text-center dark:border-white/[0.08] dark:bg-[#1B1E24]">
              <p className="text-[#5A564F] dark:text-[#9B968C]">No listings found.</p>
              <button
                type="button"
                onClick={handleGoToSearch}
                className="mt-5 rounded-md bg-[#C9A24B] px-5 py-3 text-sm font-medium text-[#14161A] transition hover:bg-[#D6B26A]"
              >
                Try another search
              </button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {listings.map((listing, index) => {
                const key = listingKey(listing) || `listing-${index}`;
                return (
                  <ListingCard
                    key={key}
                    listing={listing}
                    onInvestigate={handleInvestigate}
                    isLoading={investigatingId === key}
                    disabled={investigatingId !== null}
                  />
                );
              })}
            </div>
          )}
        </main>
      </div>
    );
  }

  if (screen === "details") {
    return (
      <div className="min-h-screen bg-[#F7F5F0] font-sans text-[#1B1E24] dark:bg-[#14161A] dark:text-[#EDEAE3]">
        <FontImport />
        <TopBar onLogoClick={handleGoHome}>
          {!user ? <LoginButton onClick={() => goToAuth("login")} /> : <SignOutButton onClick={handleSignOut} />}
          <button
            type="button"
            onClick={() => setScreen("results")}
            className="rounded-md border border-black/10 px-4 py-2 text-sm text-[#5A564F] transition hover:border-black/20 hover:text-[#1B1E24] dark:border-white/[0.08] dark:text-[#9B968C] dark:hover:border-white/[0.16] dark:hover:text-[#EDEAE3]"
          >
            Back to Results
          </button>
        </TopBar>

        <main className="mx-auto max-w-6xl px-6 py-10 lg:px-10">
          <ErrorBanner message={error} />
          {investigationResult ? (
            <ListingDetails investigation={investigationResult} />
          ) : (
            <div className="rounded-xl border border-black/10 bg-white p-10 text-center dark:border-white/[0.08] dark:bg-[#1B1E24]">
              <p className="text-[#5A564F] dark:text-[#9B968C]">No investigation data available.</p>
            </div>
          )}
        </main>
      </div>
    );
  }

  return null;
}