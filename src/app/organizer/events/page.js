"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import api from "@/lib/axios";

export default function OrganizerEventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.get("/events");
        setEvents(res.data);
      } catch (err) {
        console.error("Failed to fetch events");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Loading your events…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b0b0f] via-[#0e1018] to-[#0a0a12] text-white px-6 py-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold">Your Events</h1>
            <p className="text-white/60 mt-1">
              Manage, update, and track all your published events
            </p>
          </div>

          <Link
            href="/organizer/events/create"
            className="px-6 py-3 rounded-xl font-medium bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:opacity-90 transition"
          >
            + Create Event
          </Link>
        </div>

        {/* Events Grid */}
        {events.length === 0 ? (
          <div className="text-center text-white/60 py-20">
            No events yet. Create your first one 🚀
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <motion.div
                key={event._id}
                whileHover={{ y: -6 }}
                className="relative rounded-2xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-xl shadow-lg"
              >
                {/* Cover */}
                <div
                  className="h-40 bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${
                      event.coverImage ||
                      "https://images.unsplash.com/photo-1497032628192-86f99bcd76bc"
                    })`,
                  }}
                />

                {/* Content */}
                <div className="p-5 space-y-3">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold leading-tight">
                      {event.title}
                    </h3>

                    <span
                      className={`px-2 py-1 text-xs rounded-full font-medium
                        ${
                          event.status === "published"
                            ? "bg-emerald-500/20 text-emerald-400"
                            : event.status === "cancelled"
                            ? "bg-red-500/20 text-red-400"
                            : "bg-yellow-500/20 text-yellow-400"
                        }`}
                    >
                      {event.status}
                    </span>
                  </div>

                  <p className="text-sm text-white/60 line-clamp-2">
                    {event.subtitle || event.description}
                  </p>

                  <div className="flex justify-between items-center text-sm text-white/70">
                    <span>
                      🎫 {event.availableTickets}/{event.totalTickets}
                    </span>
                    <span>
                      {event.isPaid
                        ? `₹${event.ticketPrice}`
                        : "Free"}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-3">
                    <Link
                      href={`/organizer/events/edit/${event._id}`}
                      className="flex-1 text-center py-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition"
                    >
                      Edit
                    </Link>

                    <button
                      onClick={async () => {
                        if (!confirm("Cancel this event?")) return;
                        await api.delete(`/events/${event._id}`);
                        setEvents(events.filter((e) => e._id !== event._id));
                      }}
                      className="flex-1 py-2 rounded-lg bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
