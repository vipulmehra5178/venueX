"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import api from "@/lib/axios";

export default function BookingSuccessPage() {
  const { bookingId } = useParams();
  const router = useRouter();

  const [booking, setBooking] = useState(null);
  const [qr, setQr] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await api.get("/bookings/me");
        const found = res.data.find((b) => b._id === bookingId);

        if (!found) {
          router.push("/bookings");
          return;
        }

        setBooking(found);

        if (found.status === "confirmed" && found.eventId.mode !== "online") {
          const qrRes = await api.get(`/bookings/${bookingId}/qr`);
          setQr(qrRes.data.qr);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId, router]);
  const downloadInvoice = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/bookings/${booking._id}/invoice`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!res.ok) {
        throw new Error("Failed to download invoice");
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      window.open(url, "_blank");
    } catch (err) {
      alert("Unable to download invoice");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        Finalizing your booking…
      </div>
    );
  }

  const e = booking.eventId;

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#04040a] via-[#0b0e1f] to-[#05050a] text-white px-6 py-28">
      <div className="max-w-4xl mx-auto space-y-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="text-7xl">🎉</div>
          <h1 className="text-4xl font-extrabold text-emerald-400">
            Booking Confirmed
          </h1>
          <p className="text-slate-300">
            Your ticket is secured. Below are your full event details.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl overflow-hidden"
        >
          <div
            className="h-100 bg-cover bg-center"
            style={{ backgroundImage: `url(${e.coverImage})` }}
          />

          <div className="p-8 space-y-10">
            <div>
              <span className="inline-block mb-2 px-4 py-1 rounded-full text-xs bg-pink-500/20 text-pink-400 uppercase">
                {e.category}
              </span>

              <h2 className="text-3xl font-bold">{e.title}</h2>
              <p className="text-slate-400 mt-1">{e.subtitle}</p>
            </div>

            {e.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {e.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-xs rounded-full bg-white/10"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            <p className="text-slate-300 leading-relaxed">{e.description}</p>

            <div className="grid sm:grid-cols-2 gap-6 text-slate-300">
              <div>📅 {new Date(e.startDateTime).toLocaleString()}</div>
              {e.endDateTime && (
                <div>⏰ Ends: {new Date(e.endDateTime).toLocaleString()}</div>
              )}
              <div>🌍 Mode: {e.mode}</div>
              <div>🕒 Timezone: {e.timezone}</div>

              {e.mode !== "online" && (
                <div>
                  📍 {e.venueName}, {e.city}, {e.state}, {e.country}
                </div>
              )}

              <div>🎫 Quantity: {booking.quantity}</div>
              <div className="text-amber-400 font-bold">
                💰 Paid: ₹{booking.totalAmount}
              </div>

              <div>Status: {booking.status}</div>
              <div className="font-mono text-xs">Booking ID: {booking._id}</div>
            </div>

            {booking.status === "confirmed" && e.mode !== "online" && qr && (
              <div className="pt-8 text-center space-y-3">
                <p className="text-slate-400">Show this QR at venue entry</p>
                <img
                  src={qr}
                  className="w-60 h-60 mx-auto bg-white p-4 rounded-xl shadow-2xl"
                />
              </div>
            )}

            {booking.status === "confirmed" &&
              e.mode !== "offline" &&
              e.onlineLink && (
                <div className="pt-8 text-center">
                  <a
                    href={e.onlineLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-10 py-4 rounded-2xl font-semibold text-lg
                    bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
                  >
                    🔗 Join Online Event
                  </a>
                </div>
              )}
            <button
              onClick={downloadInvoice}
              className="flex-20 py-3 px-2 rounded-xl font-semibold bg-gradient-to-r from-emerald-500 to-green-600"
            >
              📄 Download Invoice
            </button>

            <div className="flex flex-col sm:flex-row gap-4 pt-8">
              <button
                onClick={() => router.push("/bookings")}
                className="flex-1 py-3 rounded-xl bg-white/10 hover:bg-white/20"
              >
                My Bookings
              </button>

              <button
                onClick={() => router.push("/events")}
                className="flex-1 py-3 rounded-xl font-semibold
                  bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500"
              >
                Explore Events
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
