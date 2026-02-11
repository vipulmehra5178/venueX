"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import api from "@/lib/axios";

export default function BookingDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const [booking, setBooking] = useState(null);
  const [qr, setQr] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await api.get("/bookings/me");
        const found = res.data.find((b) => b._id === id);

        if (!found) {
          router.push("/bookings");
          return;
        }

        setBooking(found);

        if (found.status === "confirmed" && found.eventId.mode !== "online") {
          const qrRes = await api.get(`/bookings/${id}/qr`);
          setQr(qrRes.data.qr);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [id, router]);
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
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Loading booking…
      </div>
    );
  }

  const e = booking.eventId;
  const expired =
    booking.status === "pending" && new Date(booking.expiresAt) < new Date();

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#04040a] via-[#0b0e1f] to-[#05050a] text-white px-6 py-28">
      <div className="max-w-5xl mx-auto space-y-14">
        <h1 className="text-4xl font-extrabold">Booking Details</h1>

        <div className="rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl overflow-hidden">
          <div
            className="h-125 bg-cover bg-center"
            style={{ backgroundImage: `url(${e.coverImage})` }}
          />

          <div className="p-8 space-y-10">
            <div>
              <h2 className="text-3xl font-bold">{e.title}</h2>
              <p className="text-slate-400">{e.subtitle}</p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6 text-slate-300">
              <div>📅 {new Date(e.startDateTime).toLocaleString()}</div>
              {e.endDateTime && (
                <div>⏰ Ends: {new Date(e.endDateTime).toLocaleString()}</div>
              )}
              <div>🌍 Mode: {e.mode}</div>
              <div>🕒 {e.timezone}</div>
              <div>🎫 Qty: {booking.quantity}</div>
              <div className="text-amber-400 font-bold">
                Amount Paid:- ₹{booking.totalAmount}
              </div>
              <div>Status: {booking.status}</div>
              <div className="font-mono text-400">
                Booking ID: {booking._id}
              </div>
            </div>

            {booking.status === "confirmed" && e.mode !== "online" && qr && (
              <div className="text-center pt-6">
                <p className="text-slate-400 mb-3">Entry QR</p>
                <img
                  src={qr}
                  className="w-64 h-64 mx-auto bg-white p-4 rounded-xl"
                />
              </div>
            )}

            {booking.status === "confirmed" &&
              e.mode !== "offline" &&
              e.onlineLink && (
                <div className="text-center pt-6">
                  <a
                    href={e.onlineLink}
                    target="_blank"
                    className="inline-block px-10 py-4 rounded-xl font-semibold
                    bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
                  >
                    🔗 Link for the Event
                  </a>
                </div>
              )}
            <button
              onClick={downloadInvoice}
              className="flex-1 py-3 rounded-xl font-semibold bg-gradient-to-r from-emerald-500 to-green-600">
              📄 Download Invoice
            </button>

            <div className="flex gap-4 pt-6">
              {booking.status === "pending" && !expired && (
                <button
                  onClick={async () => {
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
                  className="flex-1 py-3 rounded-xl bg-amber-500 text-black"
                >
                  Pay Now
                </button>
              )}

              <button
                onClick={() => router.push("/bookings")}
                className="flex-1 py-3 rounded-xl bg-white/10"
              >
                Back to My Bookings
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
