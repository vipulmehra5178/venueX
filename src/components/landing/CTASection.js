"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function CTASection() {
  return (
    <section className="relative bg-black py-48 text-center text-white">
      <div className="absolute inset-0 bg-pink-500/20 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        className="relative max-w-4xl mx-auto px-6"
      >
        <h2 className="text-6xl font-bold">
          This Is Where <br />
          Your City <span className="text-pink-400">Comes Alive</span>
        </h2>

        <p className="mt-8 text-xl text-slate-300">
          Be part of moments that matter.
        </p>

        <div className="mt-14">
          <Button className="bg-pink-500 px-14 py-7 text-xl hover:bg-pink-600">
            Explore VenueX
          </Button>
        </div>
      </motion.div>
    </section>
  );
}
