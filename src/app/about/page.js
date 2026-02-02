"use client";

import { motion } from "framer-motion";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b 
      from-[#04040a] via-[#0b0b18] to-[#04040a] text-white">

      {/* HERO */}
      <section className="relative px-6 pt-40 pb-32 text-center">
        <div className="absolute inset-0 bg-pink-500/10 blur-[140px]" />

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-6xl font-extrabold tracking-tight"
        >
          More Than Events.  
          <br />
          <span className="text-pink-400">We Create Experiences.</span>
        </motion.h1>

        <p className="mt-8 max-w-2xl mx-auto text-lg text-slate-300">
          VenueX is where moments turn into memories, creators meet communities,
          and cities come alive through shared experiences.
        </p>
      </section>

      {/* STORY */}
      <section className="px-6 py-32 max-w-6xl mx-auto grid md:grid-cols-2 gap-20 items-center">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold mb-6">
            Why <span className="text-pink-400">VenueX</span>?
          </h2>

          <p className="text-slate-300 leading-relaxed text-lg">
            We noticed something broken.
            <br /><br />
            Events were scattered, ticketing was messy, organizers struggled
            to reach the right audience — and attendees missed out on amazing
            experiences simply because they never found them.
            <br /><br />
            VenueX fixes that. One platform. One community. Endless experiences.
          </p>
        </motion.div>

        {/* VISUAL CARD */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          className="rounded-3xl p-10
          bg-gradient-to-br from-white/10 to-white/5
          border border-white/10 backdrop-blur-xl"
        >
          <p className="text-xl font-semibold mb-4">
            🎶 🎤 🎭 🧠 🏟️
          </p>
          <p className="text-slate-300">
            Concerts. Meetups. Comedy. Workshops. Sports.
            <br />
            If it brings people together — it belongs on VenueX.
          </p>
        </motion.div>
      </section>

      {/* VALUES */}
      <section className="px-6 py-32 bg-gradient-to-r from-[#0a0a16] to-[#05050a]">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-16">
            What We <span className="text-pink-400">Stand For</span>
          </h2>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                title: "Community First",
                desc: "Every feature we build strengthens the bond between creators and attendees.",
              },
              {
                title: "Creator Empowerment",
                desc: "We give organizers the tools to build, manage, and scale unforgettable events.",
              },
              {
                title: "Trust & Transparency",
                desc: "Verified organizers, secure payments, and clear communication — always.",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -8 }}
                className="rounded-2xl p-8
                bg-white/5 border border-white/10 backdrop-blur-xl"
              >
                <h3 className="text-2xl font-semibold mb-4">
                  {item.title}
                </h3>
                <p className="text-slate-400">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CLOSING */}
      <section className="px-6 py-36 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl font-bold"
        >
          This Is Just The Beginning
        </motion.h2>

        <p className="mt-6 text-slate-300 max-w-xl mx-auto text-lg">
          VenueX is growing city by city, story by story.
          If you love experiences — you’re already part of our journey.
        </p>

        <p className="mt-10 text-pink-400 font-semibold uppercase tracking-widest">
          See you at the next event ✨
        </p>
      </section>
    </main>
  );
}
