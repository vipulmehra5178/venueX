"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import api from "@/lib/axios";

export default function OrganizerEventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    const fetchEvents = async () => {
      try {
        const res = await api.get("/events/my");
        setEvents(res.data);
      } catch (err) {
        console.error("Failed to fetch events", err);
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
    <div className="min-h-screen bg-gradient-to-br pt-30 rom-[#0b0b0f] via-[#0e1018] to-[#0a0a12] text-white px-8 py-14">
      <div className="max-w-7xl mx-auto">

        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold">Your Events</h1>
            <p className="text-white/60 mt-1">
              Manage, update, and track all your published events
            </p>
          </div>

          <Link
            href="/organizer/events/create"
            className="px-6 py-3 rounded-xl font-medium
              bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500
              hover:opacity-90 transition"
          >
            + Create Event
          </Link>
        </div>

        {events.length === 0 ? (
          <div className="text-center text-white/60 py-20">
            No events yet. Create your first one 🚀
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => {
              const organizerId = String(event.organizerId);
              const loggedInUserId = String(user?.id);

              const isOwner = organizerId === loggedInUserId;
              const isAdmin = user?.roles?.includes("admin");
              const canManage = isAdmin || isOwner;

              return (
                <motion.div
                  key={event._id}
                  whileHover={{ y: -6 }}
                  className="relative rounded-2xl overflow-hidden
                    border border-white/10 bg-white/5 backdrop-blur-xl shadow-lg"
                >
                  <div
                    className="h-40 bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${event.coverImage})`,
                    }}
                  />

                  <div className="p-5 space-y-3">
                    <h3 className="text-lg font-semibold">{event.title}</h3>

                    <p className="text-sm text-white/60 line-clamp-2">
                      {event.subtitle}
                    </p>

                    {canManage && (
                      <div className="flex gap-3 pt-3">
                        <Link
                          href={`/organizer/events/edit/${event._id}`}
                          className="flex-1 py-2 text-center rounded-lg
                            bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
                        >
                          Edit
                        </Link>

                        <button
                          onClick={async () => {
                            if (!confirm("Cancel this event?")) return;
                            await api.delete(`/events/${event._id}`);
                            setEvents(events.filter(e => e._id !== event._id));
                          }}
                          className="flex-1 py-2 rounded-lg
                            bg-rose-500/20 text-rose-400 hover:bg-rose-500/30"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
