"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { motion } from "framer-motion";

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await api.get("/bookings/me");
        setBookings(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        Loading bookings…
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0b0b0f] via-[#0e1018] to-[#0a0a12] text-white px-8 py-28">
      <div className="max-w-5xl mx-auto">

        <h1 className="text-4xl font-bold mb-10">
          My <span className="text-pink-400">Bookings</span>
        </h1>

        {bookings.length === 0 ? (
          <p className="text-slate-400">
            You haven’t booked any events yet.
          </p>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => {
              const event = booking.eventId;
              const expired =
                booking.status === "pending" &&
                new Date(booking.expiresAt) < new Date();

              return (
                <motion.div
                  key={booking._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -4 }}
                  onClick={() => router.push(`/bookings/${booking._id}`)}
                  className="cursor-pointer rounded-3xl p-6
                    bg-white/5 border border-white/10
                    backdrop-blur-xl hover:bg-white/10 transition"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-2xl font-semibold">
                        {event?.title}
                      </h2>
                      <p className="text-slate-400 mt-1">
                        📅 {new Date(event?.startDateTime).toLocaleDateString()}
                      </p>
                      <p className="text-slate-400">
                        📍 {event?.city || "Online"}
                      </p>
                    </div>

                    <span
                      className={`px-4 py-1 rounded-full text-sm font-medium
                        ${
                          booking.status === "confirmed"
                            ? "bg-emerald-500/20 text-emerald-400"
                            : booking.status === "pending"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : "bg-red-500/20 text-red-400"
                        }`}
                    >
                      {booking.status}
                    </span>
                  </div>

                  <div className="mt-4 flex justify-between items-center text-slate-300">
                    <div>🎫 Qty: {booking.quantity}</div>
                    <div className="text-lg font-bold text-amber-400">
                      ₹{booking.totalAmount}
                    </div>
                  </div>

                  {booking.status === "pending" && !expired && (
                    <button
                      onClick={async (e) => {
                        e.stopPropagation(); 

                        const order = await api.post("/bookings/create-order", {
                          bookingId: booking._id,
                        });

                        const rzp = new window.Razorpay({
                          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                          amount: order.data.amount,
                          currency: order.data.currency,
                          order_id: order.data.id,
                          handler: async (res) => {
                            await api.post("/bookings/verify-payment", {
                              bookingId: booking._id,
                              razorpay_order_id: res.razorpay_order_id,
                              razorpay_payment_id: res.razorpay_payment_id,
                              razorpay_signature: res.razorpay_signature,
                            });

                            router.push(`/bookings/success/${booking._id}`);
                          },
                        });

                        rzp.open();
                      }}
                      className="mt-4 px-5 py-2 rounded-lg
                        bg-amber-500 text-black font-semibold"
                    >
                      Pay Now
                    </button>
                  )}

                  {expired && (
                    <div className="mt-4 text-red-400">
                      ⛔ Booking expired
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
