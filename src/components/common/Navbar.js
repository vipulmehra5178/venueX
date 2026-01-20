"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-6 left-1/2 -translate-x-1/2 z-50
                 w-[90%] max-w-6xl rounded-2xl
                 bg-white/10 backdrop-blur-xl border border-white/20"
    >
      <div className="flex items-center justify-between px-6 py-4 text-white">
        <span className="text-xl font-bold tracking-wide">
          Venue<span className="text-pink-400">X</span>
        </span>

        <div className="hidden md:flex gap-6 text-sm">
          <span className="cursor-pointer hover:text-pink-400">Explore</span>
          <span className="cursor-pointer hover:text-pink-400">Host</span>
          <span className="cursor-pointer hover:text-pink-400">About</span>
        </div>

        <Button className="bg-pink-500 hover:bg-pink-600">
          Get Started
        </Button>
      </div>
    </motion.nav>
  );
}
