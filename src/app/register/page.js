"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { registerUser } from "@/services/authService";
import api from "@/lib/axios";

export default function RegisterPage() {
  const router = useRouter();

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  const PageContent = () => {
    const params = useSearchParams();
    const oauthError = params.get("error");

    const [form, setForm] = useState({
      name: "",
      email: "",
      password: "",
      city: "",
      phone: "",
      authProvider: "local",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
      setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleRegister = async () => {
      setError("");
      setLoading(true);

      try {
        const res = await registerUser(form);

        localStorage.setItem("token", res.data.token);
        const me = await api.get("/auth/me");

        localStorage.setItem("user", JSON.stringify(me.data.user));

        window.dispatchEvent(new Event("auth-change"));

        router.push("/");
      } catch (err) {
        if (err.response?.data?.message) {
          setError(err.response.data.message);
        } else {
          setError("An unexpected error occurred. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!loading) {
        await handleRegister();
      }
    };

    return (
      <main className="min-h-screen grid md:grid-cols-2">
        <div
          className="hidden md:flex flex-col justify-center px-16
          bg-linear-to-br from-[#020617] via-[#022c22] to-[#020617] text-white"
        >
          <h1 className="text-5xl font-extrabold">
            Join <span className="text-amber-400">VenueX</span>
          </h1>
          <p className="mt-6 text-lg text-slate-300">
            Discover, attend, and host experiences your city loves.
          </p>
        </div>

        <div className="flex items-center justify-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md"
          >
            <h2 className="text-3xl font-bold mb-6">Create your account</h2>

            {oauthError === "google_account_not_found" && (
              <p className="mb-4 text-sm text-red-500">
                No account found for this Google email. Please create an account
                first.
              </p>
            )}

            {error && <p className="mb-4 text-sm text-red-500">{error}</p>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input name="name" placeholder="Full Name" onChange={handleChange} />
              <Input name="email" type="email" placeholder="Email" onChange={handleChange} />
              <Input name="password" type="password" placeholder="Password" onChange={handleChange} />
              <Input name="city" placeholder="City (e.g. Mumbai)" onChange={handleChange} />
              <Input name="phone" placeholder="Phone (optional)" onChange={handleChange} />

              <Button
                type="submit"
                className="w-full bg-amber-400 text-black hover:bg-amber-500"
                disabled={loading}
              >
                {loading ? "Creating account..." : "Sign Up"}
              </Button>
            </form>

            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-slate-300/30" />
              <span className="text-sm text-slate-400">OR</span>
              <div className="h-px flex-1 bg-slate-300/30" />
            </div>

            <Button
              variant="outline"
              className="w-full flex items-center gap-3"
              onClick={() =>
                (window.location.href =
                  `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/google/register`)
              }
            >
              <img src="/google.png" alt="google" className="h-5" />
              Continue with Google
            </Button>

            <p className="mt-6 text-sm text-slate-500 text-center">
              Already have an account?{" "}
              <a href="/login" className="underline">
                Login
              </a>
            </p>
          </motion.div>
        </div>
      </main>
    );
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PageContent />
    </Suspense>
  );
}
