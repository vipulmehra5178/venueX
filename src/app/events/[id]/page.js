"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import api from "@/lib/axios";

export default function EventDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const [event, setEvent] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(false);
  const [existingBooking, setExistingBooking] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!document.getElementById("razorpay-script")) {
      const s = document.createElement("script");
      s.id = "razorpay-script";
      s.src = "https://checkout.razorpay.com/v1/checkout.js";
      document.body.appendChild(s);
    }
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const eventRes = await api.get(`/events/${id}`);
      setEvent(eventRes.data);

      if (user) {
        try {
          const bookingRes = await api.get("/bookings/me");
          const found = bookingRes.data.find(
            (b) => b.eventId?._id === id
          );
          if (found) setExistingBooking(found);
        } catch {}
      }
    };

    fetchData();
  }, [id, user]);

  if (!event) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Loading event…
      </div>
    );
  }
  const soldOut = event.availableTickets === 0;
  const isConfirmed = existingBooking?.status === "confirmed";
  const isPending = existingBooking?.status === "pending";

  const maxAllowedQty = Math.min(
    event.maxTicketsPerUser || 5,
    event.availableTickets
  );

  const handlePayment = async (booking) => {
    const orderRes = await api.post("/bookings/create-order", {
      bookingId: booking._id,
    });

    const order = orderRes.data;

    const rzp = new window.Razorpay({
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      order_id: order.id,
      name: "VenueX",
      description: event.title,
      handler: async (res) => {
        await api.post("/bookings/verify-payment", {
          bookingId: booking._id,
          razorpay_order_id: res.razorpay_order_id,
          razorpay_payment_id: res.razorpay_payment_id,
          razorpay_signature: res.razorpay_signature,
        });

        router.push(`/bookings/success/${booking._id}`);
      },
      theme: { color: "#ec4899" },
    });

    rzp.open();
  };

  const handleBooking = async () => {
    if (!user) {
      router.push(`/login?redirect=/events/${id}`);
      return;
    }

    if (isConfirmed) {
      router.push(`/bookings/${existingBooking._id}`);
      return;
    }

    if (isPending) {
      handlePayment(existingBooking);
      return;
    }

    try {
      setLoading(true);

      const bookingRes = await api.post("/bookings", {
        eventId: event._id,
        quantity: qty,
      });

      const booking = bookingRes.data;

      if (!event.isPaid) {
        router.push(`/bookings/success/${booking._id}`);
        return;
      }

      handlePayment(booking);
    } catch (err) {
      alert("Booking failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-[#05050a] text-white">

      <section className="relative min-h-screen flex items-end">
        <motion.img
          src={event.coverImage || "/event-placeholder.jpg"}
          alt={event.title}
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.2 }}
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(236,72,153,0.18),transparent_60%)]" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 pb-24">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <span className="inline-block px-4 py-1 rounded-full bg-pink-500/20 text-pink-400 text-xs uppercase tracking-widest">
              {event.category}
            </span>

            <h1 className="text-5xl md:text-6xl font-extrabold max-w-3xl">
              {event.title}
            </h1>

            <p className="text-slate-300 max-w-xl text-lg">
              {event.subtitle}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-24 grid lg:grid-cols-3 gap-14">

        <div className="lg:col-span-2 space-y-12">
          <GlassCard title="About the Event">
            <p className="text-slate-300 leading-relaxed">
              {event.description}
            </p>
          </GlassCard>

          <GlassCard title="Event Details">
            <ul className="space-y-3 text-slate-300">
              <li>📅 {new Date(event.startDateTime).toLocaleString()}</li>
              <li>🌍 Mode: {event.mode}</li>
              <li>
                📍{" "}
                {event.mode === "online"
                  ? "Online Event"
                  : `${event.venueName}, ${event.city}`}
              </li>
              <li>🎫 Max per user: {event.maxTicketsPerUser}</li>
              <li>🎟️ Available: {event.availableTickets}</li>
            </ul>
          </GlassCard>
        </div>

        <div className="lg:sticky lg:top-28 h-fit">
          <GlassCard title="Tickets">
            <div className="space-y-6">
              <div className="text-4xl font-extrabold">
                {event.isPaid ? `₹${event.ticketPrice}` : "Free"}
              </div>

              {!existingBooking && (
                <div className="flex items-center gap-6">
                  <QtyButton
                    onClick={() =>
                      setQty((q) => Math.max(1, q - 1))
                    }
                  >
                    −
                  </QtyButton>

                  <span className="text-2xl font-semibold">{qty}</span>

                  <QtyButton
                    onClick={() =>
                      setQty((q) =>
                        Math.min(maxAllowedQty, q + 1)
                      )
                    }
                  >
                    +
                  </QtyButton>
                </div>
              )}

              <p className="text-sm text-slate-400">
                Max allowed: {maxAllowedQty}
              </p>

              <button
                disabled={soldOut || loading}
                onClick={handleBooking}
                className={`w-full py-4 rounded-2xl font-semibold text-lg transition
                  ${
                    isConfirmed
                      ? "bg-emerald-600"
                      : isPending
                      ? "bg-amber-500"
                      : soldOut
                      ? "bg-gray-600"
                      : "bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:scale-[1.02]"
                  }`}
              >
                {isConfirmed
                  ? "View Ticket"
                  : isPending
                  ? "Complete Payment"
                  : soldOut
                  ? "Sold Out"
                  : loading
                  ? "Processing..."
                  : event.isPaid
                  ? "Proceed to Pay"
                  : "Confirm Booking"}
              </button>
            </div>
          </GlassCard>
        </div>
      </section>
    </main>
  );
}

function GlassCard({ title, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="rounded-3xl p-8 bg-white/5 border border-white/10 backdrop-blur-xl space-y-5"
    >
      <h2 className="text-xl font-semibold">{title}</h2>
      {children}
    </motion.div>
  );
}

function QtyButton({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-12 h-12 rounded-xl bg-white/10 hover:bg-white/20 text-xl font-bold"
    >
      {children}
    </button>
  );
}
