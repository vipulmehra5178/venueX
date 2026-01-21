"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <main className="relative min-h-screen overflow-hidden text-slate-100">
      <div className="absolute inset-0 bg-gradient-to-br from-[#020617] via-[#022c22] to-[#020617]" />
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-[420px] w-[420px] rounded-full bg-teal-400/25 blur-[160px]" />
      <div className="absolute bottom-[-20%] right-[-10%] h-[520px] w-[520px] rounded-full bg-amber-400/20 blur-[180px]" />

      <section className="relative mx-auto max-w-7xl px-6 pt-38 pb-4 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tight"
        >
          Discover Events <br />
          That <span className="text-amber-400">Move You</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed"
        >
          Concerts, tech meetups, workshops, comedy shows — experiences designed to bring people together.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-14 flex justify-center gap-6 flex-wrap"
        >
          <Button className="bg-gradient-to-r from-amber-400 to-orange-500 text-black px-10 py-7 text-lg font-semibold shadow-lg hover:shadow-[0_0_40px_rgba(251,191,36,0.6)] transition-all">
            Explore Events
          </Button>
          <Button variant="outline" className="border-slate-400/60 text-slate-100 px-10 py-7 text-lg backdrop-blur-md hover:bg-white/10 transition-all">
            Host an Event
          </Button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-16 text-sm md:text-base uppercase tracking-[0.3em] text-slate-400 font-semibold"
        >
          Trusted by 50,000+ event lovers across India
        </motion.p>

        <motion.div
          animate={{ y: [0, 14, 0], opacity: [0.4, 1, 0.4] }}
          transition={{ repeat: Infinity, duration: 3 }}
          className="mt-24 text-slate-300 text-sm tracking-widest"
        >
          SCROLL TO EXPLORE
          <div className="mt-3 text-2xl text-amber-400">↓</div>
        </motion.div>
      </section>
    </main>
  );
}
