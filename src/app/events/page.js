"use client";

import { useEffect, useState } from "react";
import { getAllEvents } from "@/services/eventService";
import Link from "next/link";
import { motion } from "framer-motion";

const categories = [
  "All",
  "Music",
  "Tech",
  "Sports",
  "Comedy",
  "Workshop",
  "Networking",
];

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    getAllEvents().then((res) => {
      setEvents(res.data || []);
    });
  }, []);

  const filtered =
    activeCategory === "All"
      ? events
      : events.filter((e) => e.category === activeCategory);

  return (
    <main className="min-h-screen px-6 py-28 
      bg-gradient-to-b from-[#05050a] via-[#0b0b18] to-[#05050a] 
      text-white"
    >
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="mb-14">
          <h1 className="text-5xl font-extrabold tracking-tight">
            Upcoming <span className="text-pink-400">Events</span>
          </h1>
          <p className="mt-4 text-slate-400 max-w-xl">
            Discover concerts, meetups, workshops and experiences happening near you.
          </p>
        </div>

        {/* CATEGORY CHIPS */}
        <div className="flex flex-wrap gap-4 mb-16">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all
                ${
                  activeCategory === cat
                    ? "bg-pink-500 text-black shadow-lg shadow-pink-500/30"
                    : "bg-white/10 text-slate-300 hover:bg-white/20"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* EVENTS GRID */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {filtered.map((event) => (
            <Link key={event._id} href={`/events/${event._id}`}>
              <motion.div
                whileHover={{ y: -10 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="group rounded-3xl overflow-hidden
                bg-gradient-to-br from-[#141428] to-[#0b0b18]
                border border-white/10
                shadow-xl shadow-black/40"
              >
                {/* IMAGE */}
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={event.imageUrl || "/event-placeholder.jpg"}
                    alt={event.title}
                    className="w-full h-full object-cover 
                    group-hover:scale-105 transition duration-700"
                  />

                  {/* CATEGORY BADGE */}
                  <span className="absolute top-4 left-4 
                    bg-black/70 backdrop-blur-md
                    px-4 py-1 rounded-full text-xs uppercase tracking-wider text-pink-400">
                    {event.category}
                  </span>
                </div>

                {/* CONTENT */}
                <div className="p-6 space-y-3">
                  <h2 className="text-2xl font-semibold leading-tight">
                    {event.title}
                  </h2>

                  <p className="text-slate-400 text-sm">
                    {event.subtitle ||
                      event.description?.slice(0, 90) ||
                      "An unforgettable experience awaits you."}
                  </p>

                  {/* FOOTER */}
                  <div className="flex justify-between items-center pt-4 text-sm">
                    <span className="text-slate-300">
                      📅 {new Date(event.dateTime).toDateString()}
                    </span>

                    <span className="text-lg font-bold text-amber-400">
                      ₹{event.ticketPrice}
                    </span>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
