"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getEventById } from "@/services/eventService";
import { Button } from "@/components/ui/button";

export default function EventDetailsPage() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    getEventById(id).then((res) => setEvent(res.data));
  }, [id]);

  if (!event) {
    return <p className="p-6 text-center text-slate-400">Loading…</p>;
  }

  return (
    <main className="min-h-screen bg-black text-white">
      {/* HERO IMAGE */}
      <div className="relative h-[60vh]">
        <img
          src={event.bannerUrl || event.imageUrl || "/event-placeholder.jpg"}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 max-w-4xl mx-auto px-6 pt-40">
          <span className="text-pink-400 uppercase tracking-wider">
            {event.category}
          </span>
          <h1 className="text-5xl font-extrabold mt-3">
            {event.title}
          </h1>
          <p className="mt-4 text-lg text-slate-300">
            {event.subtitle}
          </p>
        </div>
      </div>

      {/* DETAILS */}
      <section className="max-w-4xl mx-auto px-6 py-20 space-y-8">
        <p className="text-slate-300 leading-relaxed">
          {event.description}
        </p>

        <div className="grid sm:grid-cols-2 gap-6 text-sm">
          <p>📅 {new Date(event.dateTime).toDateString()}</p>
          <p>📍 {event.location}</p>
          <p>🎫 Available: {event.availableTickets}</p>
          <p>💰 Price: ₹{event.ticketPrice}</p>
        </div>

        <Button
          className="w-full bg-pink-500 hover:bg-pink-600 text-lg py-6"
          disabled={event.availableTickets === 0}
        >
          Book Ticket
        </Button>
      </section>
    </main>
  );
}
