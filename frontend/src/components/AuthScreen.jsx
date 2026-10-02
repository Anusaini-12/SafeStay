import { useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebase.js";
import {
  ShieldCheck,
  ArrowLeft,
  LockKeyhole,
  Search,
  CheckCircle2,
} from "lucide-react";
import ThemeToggle from "./ThemeToggle.jsx";

function AuthScreen({ onAuthenticated, onBack, initialMode = "login" }) {
  const [mode, setMode] = useState(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isSignup = mode === "signup";

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    if (isSignup && password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      if (isSignup) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }

      onAuthenticated();
    } catch (err) {
      const code = err?.code || "";

      if (code === "auth/email-already-in-use") {
        setError(
          "An account already exists with this email. Try signing in instead."
        );
      } else if (
        code === "auth/invalid-credential" ||
        code === "auth/wrong-password"
      ) {
        setError("Incorrect email or password.");
      } else if (code === "auth/weak-password") {
        setError("Password must be at least 6 characters.");
      } else {
        setError(
          err instanceof Error ? err.message : "Authentication failed."
        );
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F5F1E8] font-sans text-[#1B1E24] dark:bg-[#14161A] dark:text-[#EDEAE3]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;600&family=Inter:wght@400;500;600&display=swap');

        .font-display {
          font-family: 'Fraunces', serif;
        }

        .font-sans {
          font-family: 'Inter', sans-serif;
        }
      `}</style>

      <div className="mx-auto grid min-h-screen max-w-6xl lg:grid-cols-2">

        {/* LEFT SIDE */}
        <div className="hidden flex-col justify-between px-10 py-10 lg:flex xl:px-16">

          <button
            type="button"
            onClick={onBack}
            className="flex w-fit items-center gap-2 text-lg font-medium tracking-tight"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-black/10 bg-white dark:border-white/10 dark:bg-[#1B1E24]">
              <ShieldCheck
                size={19}
                strokeWidth={1.7}
                className="text-[#C9A24B]"
              />
            </div>

            <span className="font-display">
              Safe<span className="text-[#C9A24B]">Stay</span>
            </span>
          </button>

          <div className="max-w-md pb-10">
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.16em] text-[#9C7A1F] dark:text-[#C9A24B]">
              Stay informed before you stay
            </p>

            <h2 className="font-display text-5xl leading-[1.08] tracking-tight text-[#1B1E24] dark:text-[#F4F1EA] xl:text-6xl">
              A little research can make a big difference.
            </h2>

            <p className="mt-6 max-w-sm text-sm leading-7 text-[#625E56] dark:text-[#9B968C]">
              SafeStay brings together public information about PGs and
              accommodations so you can investigate a place before making
              your decision.
            </p>

            <div className="mt-9 space-y-4">
              <Feature
                icon={<Search size={16} />}
                text="Investigate accommodation listings"
              />

              <Feature
                icon={<CheckCircle2 size={16} />}
                text="Review signals from multiple sources"
              />

              <Feature
                icon={<LockKeyhole size={16} />}
                text="Your account keeps your searches accessible"
              />
            </div>
          </div>

          <p className="text-xs text-[#8A8680] dark:text-[#6E6A62]">
            Public information can be incomplete or change over time.
          </p>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex min-h-screen flex-col justify-center px-6 py-8 sm:px-10 lg:px-16">

          {/* Mobile / top navigation */}
          <div className="mb-10 flex items-center justify-between lg:absolute lg:right-10 lg:top-8 xl:right-16">

            <button
              type="button"
              onClick={onBack}
              aria-label="Go to SafeStay home"
              className="flex items-center gap-2 lg:hidden"
            >
              <ShieldCheck
                size={19}
                strokeWidth={1.7}
                className="text-[#C9A24B]"
              />

              <span className="font-display text-lg">
                Safe<span className="text-[#C9A24B]">Stay</span>
              </span>
            </button>

            <div className="ml-auto flex items-center gap-4">
              <button
                type="button"
                onClick={onBack}
                className="hidden items-center gap-2 text-sm text-[#625E56] transition hover:text-[#1B1E24] dark:text-[#8A8680] dark:hover:text-[#EDEAE3] lg:flex"
              >
                <ArrowLeft size={15} />
                Home
              </button>

              <ThemeToggle />
            </div>
          </div>

          {/* AUTH CARD */}
          <div className="mx-auto w-full max-w-md">

            <div className="mb-7">
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl border border-[#C9A24B]/25 bg-[#C9A24B]/10">
                <ShieldCheck
                  size={21}
                  strokeWidth={1.6}
                  className="text-[#9C7A1F] dark:text-[#C9A24B]"
                />
              </div>

              <p className="mb-2 text-xs font-medium uppercase tracking-[0.14em] text-[#9C7A1F] dark:text-[#C9A24B]">
                {isSignup ? "Get started" : "Welcome back"}
              </p>

              <h1 className="font-display text-3xl tracking-tight text-[#1B1E24] dark:text-[#F4F1EA]">
                {isSignup
                  ? "Create your SafeStay account"
                  : "Welcome back to SafeStay"}
              </h1>

              <p className="mt-3 text-sm leading-6 text-[#625E56] dark:text-[#8A8680]">
                {isSignup
                  ? "Create a free account and keep searching without the guest limit."
                  : "Sign in to continue searching without the guest limit."}
              </p>
            </div>

            {error && (
              <div className="mb-5 rounded-xl border border-[#A3392E]/25 bg-[#A3392E]/[0.06] px-4 py-3 text-sm leading-5 text-[#A3392E] dark:border-[#B5564A]/30 dark:bg-[#B5564A]/10 dark:text-[#D69187]">
                {error}
              </div>
            )}

            <div className="rounded-2xl border border-black/[0.08] bg-white p-7 shadow-[0_15px_45px_rgba(20,22,26,0.06)] dark:border-white/[0.08] dark:bg-[#1B1E24] dark:shadow-none sm:p-8">

              <form onSubmit={handleSubmit} className="space-y-5">

                {/* EMAIL */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-xs font-medium text-[#625E56] dark:text-[#9B968C]"
                  >
                    Email address
                  </label>

                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                    className="w-full rounded-xl border border-black/10 bg-[#F8F6F1] px-4 py-3.5 text-sm text-[#1B1E24] outline-none transition placeholder:text-[#B0AAA0] hover:border-black/15 focus:border-[#C9A24B]/70 focus:ring-4 focus:ring-[#C9A24B]/10 dark:border-white/[0.08] dark:bg-[#14161A] dark:text-[#EDEAE3] dark:placeholder:text-[#5A564F] dark:hover:border-white/[0.14] dark:focus:border-[#C9A24B]/60 dark:focus:ring-[#C9A24B]/10"
                  />
                </div>

                {/* PASSWORD */}
                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-xs font-medium text-[#625E56] dark:text-[#9B968C]"
                  >
                    Password
                  </label>

                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete={isSignup ? "new-password" : "current-password"}
                    className="w-full rounded-xl border border-black/10 bg-[#F8F6F1] px-4 py-3.5 text-sm text-[#1B1E24] outline-none transition placeholder:text-[#B0AAA0] hover:border-black/15 focus:border-[#C9A24B]/70 focus:ring-4 focus:ring-[#C9A24B]/10 dark:border-white/[0.08] dark:bg-[#14161A] dark:text-[#EDEAE3] dark:placeholder:text-[#5A564F] dark:hover:border-white/[0.14] dark:focus:border-[#C9A24B]/60 dark:focus:ring-[#C9A24B]/10"
                  />

                  {isSignup && (
                    <p className="mt-2 text-xs text-[#8A8680] dark:text-[#6E6A62]">
                      Use at least 6 characters.
                    </p>
                  )}
                </div>

                {/* SUBMIT */}
                <button
                  type="submit"
                  disabled={loading}
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#1B1E24] px-5 py-3.5 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:bg-[#292D34] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 dark:bg-[#EDEAE3] dark:text-[#14161A] dark:hover:bg-white"
                >
                  {loading
                    ? isSignup
                      ? "Creating account..."
                      : "Signing in..."
                    : isSignup
                    ? "Create account"
                    : "Continue"}

                  {!loading && <ArrowLeft size={16} className="rotate-180" />}
                </button>
              </form>

              {/* SWITCH MODE */}
              <div className="mt-7 border-t border-black/[0.07] pt-6 text-center dark:border-white/[0.08]">
                <p className="text-sm text-[#625E56] dark:text-[#8A8680]">
                  {isSignup
                    ? "Already have an account?"
                    : "Don't have an account?"}{" "}

                  <button
                    type="button"
                    onClick={() => {
                      setError("");
                      setMode(isSignup ? "login" : "signup");
                    }}
                    className="font-medium text-[#9C7A1F] transition hover:text-[#C9A24B] dark:text-[#C9A24B] dark:hover:text-[#D6B26A]"
                  >
                    {isSignup ? "Sign in" : "Create one"}
                  </button>
                </p>
              </div>
            </div>

            <p className="mt-6 text-center text-xs leading-5 text-[#8A8680] dark:text-[#6E6A62]">
              By continuing, you agree to use SafeStay responsibly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Feature({ icon, text }) {
  return (
    <div className="flex items-center gap-3 text-sm text-[#625E56] dark:text-[#8A8680]">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-black/10 bg-white dark:border-white/[0.08] dark:bg-[#1B1E24]">
        <span className="text-[#9C7A1F] dark:text-[#C9A24B]">
          {icon}
        </span>
      </div>

      <span>{text}</span>
    </div>
  );
}

export default AuthScreen;