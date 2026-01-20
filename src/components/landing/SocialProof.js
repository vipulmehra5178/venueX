"use client";
import { motion } from "framer-motion";

export default function SocialProof() {
  const testimonials = [
    {
      text: "Found amazing events every weekend. VenueX made my city feel alive again.",
      name: "Virat",
      role: "College Student · Mumbai",
    },
    {
      text: "Clean UI, smooth booking, and zero confusion. Easily the best events platform I’ve used.",
      name: "Rohit",
      role: "Product Designer · Bangalore",
    },
    {
      text: "Finally a platform that feels premium and trustworthy. Hosting events is effortless.",
      name: "Rahul",
      role: "Community Organizer · Delhi",
    },
  ];

  return (
    <section className="section-gradient-2 py-44 text-white relative overflow-hidden">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 
        h-[420px] w-[420px] rounded-full bg-blue-500/20 blur-[160px]" />

      <div className="relative max-w-7xl mx-auto px-6 text-center">
        
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl md:text-6xl font-extrabold"
        >
          Loved by the <span className="text-blue-400">Community</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-6 text-lg text-slate-300 max-w-2xl mx-auto"
        >
          From students to professionals, thousands trust VenueX
          to discover, attend, and host unforgettable events.
        </motion.p>

        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-12">
          {[
            ["50K+", "Active Users"],
            ["1.2K+", "Events Hosted"],
            ["300+", "Verified Organizers"],
            ["4.9★", "Average Rating"],
          ].map(([value, label]) => (
            <div key={label}>
              <p className="text-4xl font-bold text-blue-400">{value}</p>
              <p className="mt-2 text-sm uppercase tracking-wider text-slate-400">
                {label}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-28 grid md:grid-cols-3 gap-10">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
              whileHover={{ y: -8 }}
              className="bg-white/5 backdrop-blur-xl
              rounded-3xl p-10 border border-white/10
              transition-all duration-300"
            >
              <p className="text-lg leading-relaxed text-slate-200">
                “{t.text}”
              </p>

              <div className="mt-8 pt-6 border-t border-white/10">
                <p className="font-semibold">{t.name}</p>
                <p className="text-sm text-slate-400">{t.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
