"use client";
import { motion } from "framer-motion";

const events = [
  {
    title: "Sunburn Arena",
    city: "Mumbai",
    date: "24 Aug 2026",
    tag: "Music Festival with Karan Aujla",
    image: "https://imgs.search.brave.com/AWYQaZRoNy_5g-7ifyhp5GSk7ovpUFJ6lODVFsDNaic/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzLzJmL2M4/LzM1LzJmYzgzNTVi/YTliNjYwZWE2YmU5/NjI5ZTI0ZGJlNmI3/LmpwZw",
  },
  {
    title: "AI Builders Meetup",
    city: "Bangalore",
    date: "12 Sep 2026",
    tag: "Tech & Networking",
    image: "https://imgs.search.brave.com/wEqDWALqV-pldxqnpK85UGNU9fXSgz8jUQSRXCFiV4Y/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/dmZhaXJzLmNvbS93/cC1jb250ZW50L3Vw/bG9hZHMvMjAyNC8w/OC9HSVRFWC1HbG9i/YWwtMTAyNHg2MDMu/anBn",
  },
  {
    title: "Stand-up Night",
    city: "Delhi",
    date: "05 Oct 2026",
    tag: "Comedy Show",
    image: "https://imgs.search.brave.com/U8UoQwCVMylGKvk0UCwbaOidx1islpyf6o1a3Ge6K_Q/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWNpbWcucHVibGlz/aHN0b3J5LmNvL3Ro/dW1iLzEyMjY4MDQ3/My5jbXM_aW1nc2l6/ZT0xNjYxNiZ3aWR0/aD02MTYmcmVzaXpl/bW9kZT00",
  },
];

export default function FeaturedEvents() {
  return (
    <section className="relative py-10 overflow-hidden bg-gradient-to-b from-[#09030F] via-[#12081F] to-[#000000]">
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[500px] rounded-full bg-pink-500/20 blur-[180px]" />

      <div className="relative max-w-7xl mx-auto px-6 text-white pt-12 pb-12">
        <div className="max-w-2xl mb-24">
          <h2 className="text-5xl md:text-6xl font-extrabold leading-tight">
            Experiences <br />
            Your City <span className="text-pink-500">Lives For</span>
          </h2>

          <p className="mt-6 text-lg text-slate-300">
            Discover concerts, meetups, and shows people can’t stop talking about.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {events.map((e, i) => (
            <motion.div
              key={e.title}
              initial={{ opacity: 0, y: 80 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2, duration: 0.6 }}
              whileHover={{ y: -12 }}
              whileTap={{ scale: 0.97 }}
              className="group relative h-[480px] rounded-3xl overflow-hidden"
            >
              <img
                src={e.image}
                alt={e.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

              <div className="absolute top-6 left-6">
                <span className="px-4 py-2 rounded-full text-xs font-semibold bg-white text-black">
                  {e.tag}
                </span>
              </div>

              <div className="absolute bottom-8 left-8 right-8">
                <h3 className="text-3xl font-bold leading-tight">{e.title}</h3>
                <p className="mt-3 text-slate-300">
                  📍 {e.city} &nbsp; • &nbsp; 📅 {e.date}
                </p>

                <div className="mt-6 inline-block text-sm font-semibold text-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  View Event →
                </div>
              </div>

              <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition duration-500 shadow-[0_0_80px_rgba(236,72,153,0.35)]" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
