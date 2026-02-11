"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#07070c] via-[#0b0d16] to-[#06060b] text-white font-display">

      <section className="relative px-6 pt-32 pb-24 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/10 via-fuchsia-500/5 to-transparent blur-[160px]" />

        <motion.h1
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-[3.2rem] md:text-[4.2rem] leading-[1.05] font-extrabold tracking-tight"
        >
          More Than Events.
          <br />
          <span className="bg-gradient-to-r from-pink-400 to-fuchsia-500 bg-clip-text text-transparent">
            We Create Experiences.
          </span>
        </motion.h1>

        <p className="mt-6 max-w-xl mx-auto text-[1.05rem] leading-relaxed text-slate-400">
          VenueX is where moments turn into memories, creators meet communities,
          and cities come alive through shared experiences.
        </p>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.25 }}
          className="mt-14 relative mx-auto max-w-5xl h-[380px] rounded-[28px] overflow-hidden border border-white/10 shadow-[0_20px_80px_rgba(0,0,0,0.6)]"
        >
          <Image
            src="/crowd.jpg"
            alt="Event Crowd"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </motion.div>
      </section>

      <section className="px-6 py-24 max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -32 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-5 tracking-tight">
            Why <span className="text-pink-400">VenueX</span>?
          </h2>

          <p className="text-slate-400 text-lg leading-relaxed">
            Events were scattered. Discovery was broken. Organizers struggled
            to reach the right audience.
            <br /><br />
            We built VenueX to fix that.
            <span className="block mt-3 text-white font-medium">
              One platform. One community. Endless experiences.
            </span>
          </p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.03 }}
          transition={{ type: "spring", stiffness: 160 }}
          className="relative h-[340px] rounded-[26px] overflow-hidden border border-white/10 shadow-lg"
        >
          <Image
            src="/exp.jpg"
            alt="Event Experience"
            fill
            className="object-cover"
          />
        </motion.div>
      </section>

      <section className="px-6 py-24 bg-gradient-to-r from-[#070711] to-[#040409]">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10 text-center">
          {[
            { number: "10K+", label: "Tickets Sold" },
            { number: "150+", label: "Events Hosted" },
            { number: "25+", label: "Cities Growing" },
          ].map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -6 }}
              className="rounded-2xl px-8 py-10 bg-white/[0.04] border border-white/10 backdrop-blur-xl"
            >
              <h3 className="text-4xl font-extrabold text-pink-400 tracking-tight">
                {item.number}
              </h3>
              <p className="mt-3 text-slate-400 text-sm uppercase tracking-widest">
                {item.label}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="px-6 py-28 max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            What We <span className="text-pink-400">Stand For</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          {[
            {
              title: "Community First",
              desc: "Every feature strengthens the bond between creators and attendees.",
            },
            {
              title: "Creator Empowerment",
              desc: "Powerful tools to build, manage, and scale unforgettable events.",
            },
            {
              title: "Trust & Transparency",
              desc: "Verified organizers. Secure payments. Clear communication.",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -8 }}
              className="rounded-2xl p-8 bg-white/[0.04] border border-white/10 backdrop-blur-xl"
            >
              <h3 className="text-xl font-semibold mb-3">
                {item.title}
              </h3>
              <p className="text-slate-400 leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

        <div className="max-w-6xl mx-auto">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="relative h-[400px] rounded-[26px] overflow-hidden border border-white/10"
          >
            <Image
              src="/image2.png"
              alt="City nightlife event"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </motion.div>
        </div>

      <section className="px-6 py-28 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold tracking-tight"
        >
          This Is Just The Beginning
        </motion.h2>

        <p className="mt-5 text-slate-400 max-w-lg mx-auto text-lg">
          VenueX is growing city by city, story by story.
          If you love experiences — you’re already part of our journey.
        </p>

        <p className="mt-8 text-pink-400 font-semibold uppercase tracking-[0.25em]">
          See you at the next event ✨
        </p>
      </section>

    </div>
  );
}
