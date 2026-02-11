"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import api from "@/lib/axios";

export default function OrganizerEventsPage() {
  const [events, setEvents] = useState([]);
  const [settlements, setSettlements] = useState({});
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));

    const fetchData = async () => {
      try {
        const [eventsRes, settlementsRes] = await Promise.all([
          api.get("/events/my"),
          api.get("/settlements/my"),
        ]);

        setEvents(eventsRes.data || []);

        const settlementMap = {};
        settlementsRes.data.forEach((s) => {
          settlementMap[s.eventId] = s;
        });

        setSettlements(settlementMap);
      } catch (err) {
        console.error("Failed to fetch data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Loading your events…
      </div>
    );
  }

  return (
    <main className="min-h-screen pt-30 bg-gradient-to-br from-[#0b0b0f] via-[#0f1021] to-[#0a0a12] text-white px-8 py-24">
      <div className="max-w-7xl mx-auto">

        <div className="flex justify-between items-center mb-14">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">
              Your <span className="text-pink-400">Events</span>
            </h1>
            <p className="text-white/60 mt-2">
              Manage, track revenue, and handle settlements
            </p>
          </div>

          <Link
            href="/organizer/events/create"
            className="px-6 py-3 rounded-xl font-semibold
              bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500
              hover:scale-105 transition"
          >
            + Create Event
          </Link>
        </div>

        {events.length === 0 ? (
          <div className="text-center text-white/60 py-24 text-lg">
            No events yet. Launch your first experience 🚀
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => {
              const settlement = settlements[event._id];

              const isLocked =
                settlement &&
                ["requested", "under_review", "approved", "paid"].includes(
                  settlement.status
                );

              const statusBadge = settlement?.status;

              return (
                <motion.div
                  key={event._id}
                  whileHover={{ y: -6 }}
                  className="rounded-3xl overflow-hidden border border-white/10
                    bg-white/5 backdrop-blur-xl shadow-xl flex flex-col"
                >
                  <div
                    className="h-44 bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${
                        event.coverImage ||
                        "https://images.unsplash.com/photo-1497032628192-86f99bcd76bc"
                      })`,
                    }}
                  />

                  <div className="p-6 flex flex-col flex-1">

                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-semibold leading-tight">
                        {event.title}
                      </h3>

                      <span
                        className={`px-3 py-1 text-xs rounded-full font-medium
                          ${
                            event.status === "published"
                              ? "bg-emerald-500/20 text-emerald-400"
                              : "bg-rose-500/20 text-rose-400"
                          }`}
                      >
                        {event.status}
                      </span>
                    </div>

                    <p className="text-sm text-white/60 line-clamp-2 mb-4">
                      {event.subtitle}
                    </p>

                    <div className="flex justify-between text-sm text-white/70 mb-4">
                      <span>
                        🎫 {event.availableTickets}/{event.totalTickets}
                      </span>
                      <span>
                        {event.isPaid ? `₹${event.ticketPrice}` : "Free"}
                      </span>
                    </div>

                    {statusBadge && (
                      <div className="mb-4">
                        <SettlementBadge status={statusBadge} />
                      </div>
                    )}

                    {isLocked && (
                      <div className="mb-4 text-xs px-3 py-2 rounded-full
                        bg-orange-500/20 text-orange-400 inline-flex items-center gap-2">
                        🔒 Locked (Settlement in progress)
                      </div>
                    )}

                    <div className="mt-auto grid grid-cols-3 gap-3">
                      {isLocked ? (
                        <>
                          <DisabledButton label="Edit" />
                          <DisabledButton label="Cancel" />
                          <RevenueButton eventId={event._id} />
                        </>
                      ) : (
                        <>
                          <Link
                            href={`/organizer/events/edit/${event._id}`}
                            className="py-2 rounded-xl text-center
                              bg-blue-500/20 text-blue-400
                              hover:bg-blue-500/30 transition"
                          >
                            Edit
                          </Link>

                          <button
                            onClick={async () => {
                              if (!confirm("Cancel this event?")) return;
                              try {
                                await api.delete(`/events/${event._id}`);
                                setEvents(events.filter(e => e._id !== event._id));
                              } catch {
                                alert("Failed to cancel event");
                              }
                            }}
                            className="py-2 rounded-xl
                              bg-rose-500/20 text-rose-400
                              hover:bg-rose-500/30 transition"
                          >
                            Cancel
                          </button>

                          <RevenueButton eventId={event._id} />
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

function SettlementBadge({ status }) {
  const styles = {
    requested: "bg-yellow-500/20 text-yellow-400",
    under_review: "bg-blue-500/20 text-blue-400",
    approved: "bg-emerald-500/20 text-emerald-400",
    rejected: "bg-rose-500/20 text-rose-400",
    paid: "bg-green-600/20 text-green-400",
  };

  return (
    <span
      className={`px-3 py-1 text-xs rounded-full font-medium ${styles[status]}`}
    >
      {status.replace("_", " ").toUpperCase()}
    </span>
  );
}

function DisabledButton({ label }) {
  return (
    <div className="py-2 rounded-xl text-center bg-gray-500/15 text-gray-500 text-sm">
      {label}
    </div>
  );
}

function RevenueButton({ eventId }) {
  return (
    <Link
      href={`/organizer/events/${eventId}/revenue`}
      className="py-2 rounded-xl text-center
        bg-emerald-500/20 text-emerald-400
        hover:bg-emerald-500/30 transition"
    >
      Revenue
    </Link>
  );
}
