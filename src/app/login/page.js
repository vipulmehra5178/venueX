
"use client";
import { useState , useEffect} from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { loginUser } from "@/services/authService";
import api from "@/lib/axios";

export default function LoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const oauthError = params.get("error");

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
const [mounted, setMounted] = useState(false);

useEffect(() => {
  setMounted(true);
}, []);

if (!mounted) return null;
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      const res = await loginUser(form);

      localStorage.setItem("token", res.data.token);

      const me = await api.get("/auth/me");

      localStorage.setItem("user", JSON.stringify(me.data.user));

      window.dispatchEvent(new Event("auth-change"));

      router.push("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen grid md:grid-cols-2">
      <div
        className="hidden md:flex flex-col justify-center px-16
        bg-linear-to-br from-[#020617] via-[#022c22] to-[#020617] text-white"
      >
        <h1 className="text-5xl font-extrabold">
          Welcome back to <span className="text-amber-400">VenueX</span>
        </h1>
        <p className="mt-6 text-lg text-slate-300">
          Log in to explore events your city loves.
        </p>
      </div>

      <div className="flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <h2 className="text-3xl font-bold mb-6">Login to your account</h2>
          {oauthError === "google_account_not_found" && (
            <p className="mb-4 text-sm text-red-500">
              This Google account is not registered. Please sign up first.
            </p>
          )}

          {error && <p className="mb-4 text-sm text-red-500">{error}</p>}

          <div className="space-y-4">
            <Input
              name="email"
              type="email"
              placeholder="Email"
              onChange={handleChange}
            />
            <Input
              name="password"
              type="password"
              placeholder="Password"
              onChange={handleChange}
            />

            <Button
              className="w-full bg-amber-400 text-black hover:bg-amber-500"
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </div>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-300/30" />
            <span className="text-sm text-slate-400">OR</span>
            <div className="h-px flex-1 bg-slate-300/30" />
          </div>

          <Button
            variant="outline"
            className="w-full flex items-center gap-3"
            onClick={() => {
              const googleLoginUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/google/login`; 
              window.location.href = googleLoginUrl;
            }}
          >
            <img src="/google.png" alt="google" className="h-5" />
            Continue with Google
          </Button>

          <p className="mt-6 text-sm text-slate-500 text-center">
            Don’t have an account?{" "}
            <a href="/register" className="underline">
              Sign up
            </a>
          </p>
        </motion.div>
      </div>
    </main>
  );
}
