import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { ShieldCheck, LogOut, ArrowLeft } from "lucide-react";

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


/* =========================================================
   FONTS
========================================================= */

const FontImport = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600&display=swap');

    .font-display {
      font-family: 'Fraunces', serif;
    }

    .font-sans {
      font-family: 'Inter', sans-serif;
    }
  `}</style>
);


/* =========================================================
   SAFE STAY LOGO
========================================================= */

function SafeStayLogo({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Go to SafeStay home"
      className="flex min-w-0 shrink-0 items-center gap-2.5 text-lg font-medium tracking-tight"
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-black/10 bg-white dark:border-white/10 dark:bg-white/[0.05]">
        <ShieldCheck
          size={19}
          strokeWidth={1.7}
          className="text-[#C9A24B]"
        />
      </div>

      <div className="min-w-0 text-left">
        <div className="truncate font-display text-lg leading-none text-[#1B1E24] dark:text-[#EDEAE3]">
          Safe<span className="text-[#C9A24B]">Stay</span>
        </div>

        <div className="mt-1 hidden text-[8px] font-medium tracking-[0.16em] text-[#8A8680] sm:block dark:text-[#6E6A62]">
          STAY INFORMED
        </div>
      </div>
    </button>
  );
}


/* =========================================================
   TOP BAR
========================================================= */

function TopBar({ children, onLogoClick }) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-black/10 bg-[#F5F1E8]/95 backdrop-blur-xl dark:border-white/10 dark:bg-[#14161A]/95">
      <div className="mx-auto flex min-h-[64px] w-full max-w-7xl items-center justify-between gap-3 px-3 py-3 sm:px-6 lg:px-8">

        {/* LEFT SIDE */}
        <div className="min-w-0 shrink">
          <SafeStayLogo onClick={onLogoClick} />
        </div>

        {/* RIGHT SIDE */}
        <div className="flex min-w-0 shrink-0 items-center gap-2">

          {/* Header actions */}
          <div className="flex min-w-0 max-w-[calc(100vw-100px)] items-center gap-2 overflow-x-auto scrollbar-none">
            {children}
          </div>

          {/* Theme toggle */}
          <div className="shrink-0">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}


/* =========================================================
   LOGIN BUTTON
========================================================= */

function LoginButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="shrink-0 rounded-xl border border-[#C9A24B]/40 px-3 py-2 text-sm font-medium text-[#9C7A1F] transition hover:border-[#C9A24B]/60 hover:bg-[#C9A24B]/[0.08] active:scale-[0.98] dark:border-[#C9A24B]/30 dark:text-[#D6B26A] dark:hover:bg-[#C9A24B]/[0.06] sm:px-4"
    >
      Login
    </button>
  );
}


/* =========================================================
   SIGN OUT BUTTON
========================================================= */

function SignOutButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex shrink-0 items-center gap-2 rounded-xl border border-black/10 px-3 py-2 text-sm text-[#5A564F] transition hover:border-black/20 hover:text-[#1B1E24] active:scale-[0.98] dark:border-white/[0.08] dark:text-[#9B968C] dark:hover:border-white/[0.16] dark:hover:text-[#EDEAE3] sm:px-4"
    >
      <LogOut size={15} />

      <span className="hidden sm:inline">
        Sign out
      </span>
    </button>
  );
}


/* =========================================================
   BACK TO RESULTS BUTTON
========================================================= */

function BackToResultsButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex shrink-0 items-center gap-1.5 rounded-xl border border-black/10 px-3 py-2 text-sm text-[#5A564F] transition hover:border-black/20 hover:text-[#1B1E24] active:scale-[0.98] dark:border-white/[0.08] dark:text-[#9B968C] dark:hover:border-white/[0.16] dark:hover:text-[#EDEAE3] sm:px-4"
    >
      <ArrowLeft size={15} />

      <span className="hidden sm:inline">
        Back to Results
      </span>

      <span className="sm:hidden">
        Back
      </span>
    </button>
  );
}


/* =========================================================
   NEW SEARCH BUTTON
========================================================= */

function NewSearchButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="shrink-0 rounded-xl border border-black/10 px-3 py-2 text-sm text-[#5A564F] transition hover:border-black/20 hover:text-[#1B1E24] active:scale-[0.98] dark:border-white/[0.08] dark:text-[#9B968C] dark:hover:border-white/[0.16] dark:hover:text-[#EDEAE3] sm:px-4"
    >
      <span className="hidden sm:inline">
        New Search
      </span>

      <span className="sm:hidden">
        New
      </span>
    </button>
  );
}


/* =========================================================
   ERROR BANNER
========================================================= */

function ErrorBanner({ message }) {
  if (!message) return null;

  return (
    <div className="mb-6 rounded-xl border border-[#A3392E]/25 bg-[#A3392E]/[0.06] px-4 py-4 text-sm leading-6 text-[#A3392E] dark:border-[#B5564A]/30 dark:bg-[#B5564A]/10 dark:text-[#D69187] sm:px-5">
      {message}
    </div>
  );
}


/* =========================================================
   APP
========================================================= */

export default function App() {

  const [screen, setScreen] = useState("landing");

  const [user, setUser] = useState(null);

  const [listings, setListings] = useState([]);

  const [selectedListing, setSelectedListing] = useState(null);

  const [investigationResult, setInvestigationResult] = useState(null);

  const [searchLoading, setSearchLoading] = useState(false);

  const [investigatingId, setInvestigatingId] = useState(null);

  const [error, setError] = useState("");

  const [cityMismatchWarning, setCityMismatchWarning] =
    useState(false);

  const [remainingSearches, setRemainingSearches] =
    useState(getRemainingSearches());

  const [authIntent, setAuthIntent] =
    useState("login");


  /* =======================================================
     AUTH LISTENER
  ======================================================= */

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        setUser(currentUser);

        setRemainingSearches(
          currentUser
            ? null
            : getRemainingSearches()
        );
      }
    );

    return unsubscribe;
  }, []);


  /* =======================================================
     AUTH NAVIGATION
  ======================================================= */

  function goToAuth(intent) {
    setAuthIntent(intent);
    setScreen("auth");
  }


  /* =======================================================
     START SEARCH
  ======================================================= */

  function handleStartSearch() {
    setError("");

    if (user || canSearch()) {
      setScreen("search");
      return;
    }

    goToAuth("signup");
  }


  /* =======================================================
     GO HOME
  ======================================================= */

  function handleGoHome() {
    setError("");
    setScreen("landing");
  }


  /* =======================================================
     GO TO SEARCH
  ======================================================= */

  function handleGoToSearch() {
    setError("");

    if (user || canSearch()) {
      setScreen("search");
      return;
    }

    goToAuth("signup");
  }


  /* =======================================================
     SEARCH
  ======================================================= */

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

      setCityMismatchWarning(
        !!data.cityMismatch
      );

      if (!user) {

        const newCount =
          incrementSearchCount();

        setRemainingSearches(
          Math.max(
            FREE_SEARCH_LIMIT - newCount,
            0
          )
        );
      }

      setScreen("results");

    } catch (err) {

      console.error("Search failed:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while searching."
      );

    } finally {

      setSearchLoading(false);
    }
  }


  /* =======================================================
     LISTING KEY
  ======================================================= */

  function listingKey(listing) {
    return (
      listing.place_id ||
      listing.id ||
      listing.name
    );
  }


  /* =======================================================
     INVESTIGATE
  ======================================================= */

  async function handleInvestigate(listing) {

    setError("");

    const key = listingKey(listing);

    try {

      setInvestigatingId(key);

      setSelectedListing(listing);

      const result =
        await investigatePG(listing);

      setInvestigationResult(result);

      setScreen("details");

    } catch (err) {

      console.error(
        "Investigation failed:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while investigating this stay."
      );

    } finally {

      setInvestigatingId(null);
    }
  }


  /* =======================================================
     SIGN OUT
  ======================================================= */

  async function handleSignOut() {

    setError("");

    try {

      await signOut(auth);

      setUser(null);

      setListings([]);

      setSelectedListing(null);

      setInvestigationResult(null);

      setRemainingSearches(
        getRemainingSearches()
      );

      goToAuth("login");

    } catch (err) {

      console.error(
        "Sign out failed:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to sign out."
      );
    }
  }


  /* =======================================================
     AUTHENTICATED
  ======================================================= */

  function handleAuthenticated() {

    setError("");

    setScreen("search");
  }


  /* =======================================================
     LANDING
  ======================================================= */

  if (screen === "landing") {

    return (
      <>
        <FontImport />

        <LandingPage
          onStart={handleStartSearch}
        />
      </>
    );
  }


  /* =======================================================
     AUTH
  ======================================================= */

  if (screen === "auth") {

    return (
      <>
        <FontImport />

        <AuthScreen
          initialMode={authIntent}
          onAuthenticated={handleAuthenticated}
          onBack={handleGoHome}
        />
      </>
    );
  }


  /* =======================================================
     SEARCH SCREEN
  ======================================================= */

  if (screen === "search") {

    return (
      <div className="min-h-screen overflow-x-hidden bg-[#F7F5F0] font-sans text-[#1B1E24] dark:bg-[#14161A] dark:text-[#EDEAE3]">

        <FontImport />

        <TopBar
          onLogoClick={handleGoHome}
        >

          {!user && (
            <>
              <span className="hidden shrink-0 text-sm text-[#8A8680] sm:block dark:text-[#6E6A62]">
                {remainingSearches ??
                  getRemainingSearches()}{" "}

                {(remainingSearches ??
                  getRemainingSearches()) === 1
                  ? "search"
                  : "searches"}{" "}
                left
              </span>

              <LoginButton
                onClick={() =>
                  goToAuth("login")
                }
              />
            </>
          )}

          {user && (
            <>
              <span className="hidden max-w-[220px] truncate text-sm text-[#8A8680] md:block dark:text-[#6E6A62]">
                {user.email}
              </span>

              <SignOutButton
                onClick={handleSignOut}
              />
            </>
          )}

        </TopBar>


        <main className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 sm:py-16 lg:px-10">

          <div className="mb-8 text-center sm:mb-10">

            <p className="mb-3 text-xs uppercase tracking-[0.14em] text-[#9C7A1F] dark:text-[#C9A24B]">
              Find with confidence
            </p>

            <h1 className="font-display text-3xl leading-tight text-[#1B1E24] sm:text-4xl md:text-5xl dark:text-[#F4F1EA]">
              Find a stay you can trust.
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-[#5A564F] dark:text-[#8A8680]">
              Search PGs and rooms, then investigate listings
              for potential trust and fraud signals before
              you decide.
            </p>

          </div>


          <ErrorBanner message={error} />

          <SearchForm
            onSearch={handleSearch}
            loading={searchLoading}
          />

        </main>

      </div>
    );
  }


  /* =======================================================
     RESULTS SCREEN
  ======================================================= */

  if (screen === "results") {

    return (
      <div className="min-h-screen overflow-x-hidden bg-[#F7F5F0] font-sans text-[#1B1E24] dark:bg-[#14161A] dark:text-[#EDEAE3]">

        <FontImport />

        <TopBar
          onLogoClick={handleGoHome}
        >

          {!user ? (
            <LoginButton
              onClick={() =>
                goToAuth("login")
              }
            />
          ) : (
            <SignOutButton
              onClick={handleSignOut}
            />
          )}

          <NewSearchButton
            onClick={handleGoToSearch}
          />

        </TopBar>


        <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-10">

          <ErrorBanner message={error} />


          {cityMismatchWarning && (
            <div className="mb-6 rounded-xl border border-[#C9A24B]/30 bg-[#C9A24B]/[0.08] px-4 py-4 text-sm leading-6 text-[#7A5F16] dark:border-[#C9A24B]/30 dark:bg-[#C9A24B]/10 dark:text-[#D6B26A] sm:px-5">
              These results didn't clearly match the city you
              entered — showing the closest matches for the
              area instead. Double-check the address on any
              listing before relying on it.
            </div>
          )}


          <div className="mb-7 sm:mb-8">

            <p className="text-xs uppercase tracking-[0.14em] text-[#9C7A1F] dark:text-[#C9A24B]">
              Search results
            </p>

            <h1 className="font-display mt-2 text-2xl leading-tight text-[#1B1E24] sm:text-3xl dark:text-[#F4F1EA]">
              Places found for you
            </h1>

            <p className="mt-2 text-sm text-[#5A564F] dark:text-[#8A8680]">
              Choose a listing to investigate its trust signals.
            </p>

          </div>


          {listings.length === 0 ? (

            <div className="rounded-2xl border border-black/10 bg-white p-6 text-center dark:border-white/[0.08] dark:bg-[#1B1E24] sm:p-10">

              <p className="text-[#5A564F] dark:text-[#9B968C]">
                No listings found.
              </p>

              <button
                type="button"
                onClick={handleGoToSearch}
                className="mt-5 rounded-xl bg-[#C9A24B] px-5 py-3 text-sm font-medium text-[#14161A] transition hover:bg-[#D6B26A] active:scale-[0.98]"
              >
                Try another search
              </button>

            </div>

          ) : (

            <div className="grid min-w-0 gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">

              {listings.map(
                (listing, index) => {

                  const key =
                    listingKey(listing) ||
                    `listing-${index}`;

                  return (
                    <ListingCard
                      key={key}
                      listing={listing}
                      onInvestigate={
                        handleInvestigate
                      }
                      isLoading={
                        investigatingId === key
                      }
                      disabled={
                        investigatingId !== null
                      }
                    />
                  );
                }
              )}

            </div>

          )}

        </main>

      </div>
    );
  }


  /* =======================================================
     DETAILS SCREEN
  ======================================================= */

  if (screen === "details") {

    return (
      <div className="min-h-screen overflow-x-hidden bg-[#F7F5F0] font-sans text-[#1B1E24] dark:bg-[#14161A] dark:text-[#EDEAE3]">

        <FontImport />

        <TopBar
          onLogoClick={handleGoHome}
        >

          {!user ? (
            <LoginButton
              onClick={() =>
                goToAuth("login")
              }
            />
          ) : (
            <SignOutButton
              onClick={handleSignOut}
            />
          )}

          <BackToResultsButton
            onClick={() =>
              setScreen("results")
            }
          />

        </TopBar>


        <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-10">

          <ErrorBanner message={error} />

          {investigationResult ? (

            <ListingDetails
              investigation={investigationResult}
            />

          ) : (

            <div className="rounded-2xl border border-black/10 bg-white p-6 text-center dark:border-white/[0.08] dark:bg-[#1B1E24] sm:p-10">

              <p className="text-[#5A564F] dark:text-[#9B968C]">
                No investigation data available.
              </p>

            </div>

          )}

        </main>

      </div>
    );
  }


  return null;
}