"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { getAllEvents } from "@/services/eventService";

const categories = [
  "All",
  "music",
  "tech",
  "sports",
  "comedy",
  "workshop",
  "meetup",
];

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");
  const [sort, setSort] = useState("date");

  useEffect(() => {
    const fetchEvents = async () => {
      const res = await getAllEvents({
        search,
        category: activeCategory === "All" ? "" : activeCategory,
        city,
        sort,
      });
      setEvents(res?.data || []);
    };

    fetchEvents();
  }, [search, activeCategory, city, sort]);

  return (
    <main
      className="min-h-screen px-6 py-28
      bg-gradient-to-b from-[#05050a] via-[#0b0b18] to-[#05050a]
      text-white"
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-14">
          <h1 className="text-5xl font-extrabold tracking-tight">
            Discover <span className="text-pink-400">Events</span>
          </h1>
          <p className="mt-4 text-slate-400 max-w-xl">
            Concerts, workshops, meetups & experiences curated on VenueX.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-4 mb-12">
          <input
            placeholder="Search events..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input"
          />

          <input
            placeholder="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="input"
          />

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="input"
          >
            <option value="date">Upcoming</option>
            <option value="price">Price (Low → High)</option>
            <option value="popular">Most Popular</option>
          </select>

          <div className="flex items-center text-slate-400">
            {events.length} events found
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mb-16">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition
                ${
                  activeCategory === cat
                    ? "bg-pink-500 text-black shadow-lg shadow-pink-500/30"
                    : "bg-white/10 text-slate-300 hover:bg-white/20"
                }`}
            >
              {cat.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10 auto-rows-fr">
          {events.map((event) => {
            const soldOut = event.availableTickets === 0;

            return (
              <Link key={event._id} href={`/events/${event._id}`}>
                <motion.div
                  whileHover={{ y: -10 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="group h-full flex flex-col
                  rounded-3xl overflow-hidden
                  bg-gradient-to-br from-[#141428] to-[#0b0b18]
                  border border-white/10
                  shadow-xl shadow-black/40"
                >
                  <div className="relative h-56 shrink-0 overflow-hidden">
                    <img
                      src={event.coverImage || "/event-placeholder.jpg"}
                      alt={event.title}
                      className="w-full h-full object-cover
                      group-hover:scale-105 transition duration-700"
                    />

                    <span
                      className="absolute top-4 left-4
                      bg-black/70 backdrop-blur-md
                      px-4 py-1 rounded-full text-xs uppercase tracking-wider text-pink-400"
                    >
                      {event.category}
                    </span>

                    <span
                      className="absolute top-4 right-4
                      bg-black/70 backdrop-blur-md
                      px-3 py-1 rounded-full text-xs text-cyan-300"
                    >
                      {event.mode}
                    </span>

                    {soldOut && (
                      <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                        <span className="text-2xl font-bold text-red-400">
                          SOLD OUT
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-6 flex flex-col gap-4 flex-1">
                    <h2 className="text-xl font-semibold leading-snug line-clamp-2">
                      {event.title}
                    </h2>

                    <p className="text-slate-400 text-sm line-clamp-2">
                      {event.subtitle || event.description}
                    </p>

                    {event.tags?.length > 0 && (
                      <div className="flex gap-2 overflow-hidden">
                        {event.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="text-xs px-3 py-1 rounded-full
                            bg-white/10 text-slate-300 whitespace-nowrap"
                          >
                            #{tag}
                          </span>
                        ))}
                        {event.tags.length > 2 && (
                          <span className="text-xs text-slate-400">
                            +{event.tags.length - 2}
                          </span>
                        )}
                      </div>
                    )}

                    <div
                      className="mt-auto pt-4 border-t border-white/10
                      flex justify-between items-center text-sm"
                    >
                      <div className="text-slate-300 space-y-1">
                        <div>
                          📅{" "}
                          {new Date(
                            event.startDateTime
                          ).toLocaleDateString()}
                        </div>
                        <div>
                          📍{" "}
                          {event.mode === "online"
                            ? "Online"
                            : `${event.city || ""}${
                                event.venueName
                                  ? " · " + event.venueName
                                  : ""
                              }`}
                        </div>
                      </div>

                      <div className="text-right">
                        {event.isPaid ? (
                          <span className="text-lg font-bold text-amber-400">
                            ₹{event.ticketPrice}
                          </span>
                        ) : (
                          <span className="text-lg font-bold text-emerald-400">
                            Free
                          </span>
                        )}
                        <div className="text-xs text-slate-400">
                          🎫 {event.availableTickets}/{event.totalTickets}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
