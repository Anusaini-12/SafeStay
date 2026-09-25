import { useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebase.js";
import { ShieldCheck, ArrowLeft } from "lucide-react";

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
        setError("An account already exists with this email. Try signing in instead.");
      } else if (code === "auth/invalid-credential" || code === "auth/wrong-password") {
        setError("Incorrect email or password.");
      } else if (code === "auth/weak-password") {
        setError("Password must be at least 6 characters.");
      } else {
        setError(err instanceof Error ? err.message : "Authentication failed.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#14161A] font-sans text-[#EDEAE3]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500&family=Inter:wght@400;500;600&display=swap');
        .font-display { font-family: 'Fraunces', serif; }
        .font-sans { font-family: 'Inter', sans-serif; }
      `}</style>

      <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6">
        <div className="mb-10 flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            aria-label="Go to SafeStay home"
            className="flex items-center gap-2 text-lg font-medium tracking-tight"
          >
            <ShieldCheck size={19} strokeWidth={1.6} className="text-[#C9A24B]" />
            <span className="font-display">
              Safe<span className="text-[#C9A24B]">Stay</span>
            </span>
          </button>

          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 text-sm text-[#8A8680] transition hover:text-[#EDEAE3]"
          >
            <ArrowLeft size={15} />
            Home
          </button>
        </div>

        <div className="rounded-xl border border-white/[0.08] bg-[#1B1E24] p-7">
          <div className="mb-7">
            <p className="mb-2 text-xs uppercase tracking-[0.14em] text-[#C9A24B]">
              {isSignup ? "Get started" : "Welcome back"}
            </p>
            <h1 className="font-display text-2xl text-[#F4F1EA]">
              {isSignup ? "Create your account" : "Sign in to SafeStay"}
            </h1>
            <p className="mt-2 text-sm leading-6 text-[#8A8680]">
              {isSignup
                ? "Create a free account to keep searching without the guest limit."
                : "Sign in to continue searching without the guest search limit."}
            </p>
          </div>

          {error && (
            <div className="mb-5 rounded-lg border border-[#B5564A]/30 bg-[#B5564A]/10 px-4 py-3 text-sm text-[#D69187]">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="mb-2 block text-xs text-[#9B968C]">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                className="w-full rounded-md border border-white/[0.08] bg-[#14161A] px-4 py-3 text-sm text-[#EDEAE3] outline-none transition placeholder:text-[#5A564F] focus:border-[#C9A24B]/50"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-xs text-[#9B968C]">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete={isSignup ? "new-password" : "current-password"}
                className="w-full rounded-md border border-white/[0.08] bg-[#14161A] px-4 py-3 text-sm text-[#EDEAE3] outline-none transition placeholder:text-[#5A564F] focus:border-[#C9A24B]/50"
              />
              {isSignup && <p className="mt-2 text-xs text-[#6E6A62]">At least 6 characters.</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-[#C9A24B] px-5 py-3.5 text-sm font-medium text-[#14161A] transition hover:bg-[#D6B26A] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? isSignup ? "Creating account..." : "Signing in..."
                : isSignup ? "Create account" : "Continue"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#8A8680]">
            {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              type="button"
              onClick={() => {
                setError("");
                setMode(isSignup ? "login" : "signup");
              }}
              className="font-medium text-[#C9A24B] transition hover:text-[#D6B26A]"
            >
              {isSignup ? "Sign in" : "Sign up"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default AuthScreen;
