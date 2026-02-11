"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCallback } from "react";

export default function HeroSection() {
  const router = useRouter();

  const handleHostClick = useCallback(() => {
    if (typeof window === "undefined") return;

    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      router.push("/login");
      return;
    }

    try {
      const user = JSON.parse(storedUser);
      const roles = user?.roles || [];

      if (
        roles.includes("attendee") &&
        !roles.includes("organizer") &&
        !roles.includes("admin")
      ) {
        router.push("/organizer/request");
        return;
      }

      if (roles.includes("organizer") || roles.includes("admin")) {
        router.push("/organizer/dashboard");
        return;
      }

      router.push("/");
    } catch {
      router.push("/login");
    }
  }, [router]);

  return (
    <main className="relative min-h-screen overflow-hidden text-slate-100">

      <div className="absolute inset-0 bg-gradient-to-br from-[#020617] via-[#031926] to-[#020617]" />

      <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[520px] w-[520px] rounded-full bg-amber-400/20 blur-[180px]" />
      <div className="absolute bottom-[-25%] right-[-15%] h-[600px] w-[600px] rounded-full bg-teal-400/20 blur-[200px]" />

      <section className="relative mx-auto max-w-7xl px-6 pt-40 pb-10 text-center">

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tight"
        >
          Discover Events <br />
          That{" "}
          <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
            Move You
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed"
        >
          Concerts, tech meetups, workshops, comedy shows —  
          experiences designed to bring people together.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-14 flex justify-center gap-6 flex-wrap"
        >
          <Link href="/events">
            <Button
              className="px-10 py-7 text-lg font-semibold text-black
              bg-gradient-to-r from-amber-400 to-orange-500
              shadow-lg hover:shadow-[0_0_45px_rgba(251,191,36,0.6)]
              transition-all duration-300 hover:scale-[1.03]"
            >
              Explore Events
            </Button>
          </Link>

          <Button
            onClick={handleHostClick}
            variant="outline"
            className="px-10 py-7 text-lg font-semibold
            border-slate-400/60 text-slate-100
            backdrop-blur-md bg-white/5
            hover:bg-white/10 hover:border-white/80
            transition-all duration-300 hover:scale-[1.03]"
          >
            Host an Event
          </Button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-16 text-sm md:text-base uppercase tracking-[0.35em] text-slate-400 font-semibold"
        >
          Trusted by 50,000+ event lovers across India
        </motion.p>

        <motion.div
          animate={{ y: [0, 14, 0], opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 3 }}
          className="mt-8 text-slate-300 text-sm tracking-widest"
        >
          SCROLL TO EXPLORE
          <div className="mt-3 text-2xl text-amber-400">↓</div>
        </motion.div>

      </section>
    </main>
  );
}
