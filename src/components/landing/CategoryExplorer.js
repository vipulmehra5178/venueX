"use client";
import { motion } from "framer-motion";

export default function CategoryExplorer() {
  const categories = [
    { name: "Music", emoji: "🎵", desc: "Concerts & festivals" },
    { name: "Tech", emoji: "💻", desc: "Meetups & talks" },
    { name: "Comedy", emoji: "🎤", desc: "Stand-up & open mics" },
    { name: "Sports", emoji: "🏏", desc: "Live & community sports" },
    { name: "Workshops", emoji: "🧠", desc: "Learn & upskill" },
    { name: "Networking", emoji: "🤝", desc: "People & connections" },
  ];

  return (
    <section
      className="relative py-48 overflow-hidden
      bg-gradient-to-b from-[#1A0F2E] via-[#12081F] to-[#0A0612]"
    >
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2
        h-[480px] w-[480px] rounded-full
        bg-purple-500/20 blur-[180px]"
      />

      <div className="relative max-w-7xl mx-auto px-6 text-center text-white">
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl md:text-6xl font-extrabold leading-tight"
        >
          Pick Your <span className="text-pink-500">Mood</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-8 text-lg md:text-xl text-slate-300 max-w-2xl mx-auto"
        >
          Whether you’re here to vibe, learn, laugh, or connect —
          VenueX has experiences curated just for you.
        </motion.p>

        <div className="mt-28 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -10 }}
              whileTap={{ scale: 0.96 }}
              className="group relative rounded-3xl
              bg-white/5 backdrop-blur-xl
              border border-white/10
              p-10 cursor-pointer
              transition-all duration-300
              hover:bg-gradient-to-br
              hover:from-purple-600/30 hover:to-pink-500/20"
            >
              <div className="text-5xl mb-6">{cat.emoji}</div>

              <h3 className="text-2xl font-bold group-hover:text-pink-400">
                {cat.name}
              </h3>

              <p className="mt-3 text-slate-300">
                {cat.desc}
              </p>

              <div
                className="mt-6 text-sm font-semibold text-pink-400
                opacity-0 group-hover:opacity-100
                transition-opacity"
              >
                Explore →
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
