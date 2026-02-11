"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/axios";
import { motion } from "framer-motion";
import { requireAuth, requireRoles } from "@/lib/routeGuards";

export default function EventRevenuePage() {
  const { eventId } = useParams();
  const router = useRouter();

  const [revenue, setRevenue] = useState(null);
  const [settlement, setSettlement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirmed, setConfirmed] = useState(false);
  const [comment, setComment] = useState("");

  useEffect(() => {
    if (!requireAuth(router)) return;
    if (!requireRoles(router, ["organizer", "admin"])) return;

    const loadData = async () => {
      try {
        const revenueRes = await api.get(
          `/settlements/events/${eventId}/revenue`,
        );
        setRevenue(revenueRes.data);

        try {
          const settlementRes = await api.get(`/settlements/events/${eventId}`);
          setSettlement(settlementRes.data);
        } catch {
          setSettlement(null);
        }
      } catch {
        router.push("/organizer/events");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [eventId, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Loading financial data…
      </div>
    );
  }

  if (!revenue) return null;
  const displayData = settlement || revenue;

  const isFinal =
    settlement && ["approved", "paid"].includes(settlement.status);

  return (
    <main className="min-h-screen px-8 py-28 bg-gradient-to-br from-[#05050a] via-[#0f1021] to-[#05050a] text-white">
      <div className="max-w-5xl mx-auto space-y-16">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h1 className="text-4xl font-bold">
            Revenue & <span className="text-pink-400">Settlement</span>
          </h1>
        </motion.div>

        <div className="grid sm:grid-cols-4 gap-6">
          <Card label="Gross Revenue" value={`₹${displayData.grossRevenue}`} />

          <Card
            label={`Platform Fee (${displayData.platformFeePercent}%)`}
            value={`₹${displayData.platformFeeAmount}`}
          />

          <Card
            label="Calculated Net"
            value={`₹${displayData.netPayableAmount}`}
          />

          <Card
            label="Final Settlement Amount"
            value={`₹${
              settlement
                ? settlement.finalPayableAmount
                : revenue.netPayableAmount
            }`}
            highlight
          />
        </div>

        {settlement && <StatusBadge status={settlement.status} />}

        {!settlement && (
          <div className="space-y-6 rounded-3xl bg-white/5 border border-white/10 p-8">
            <label className="flex gap-3 text-sm text-slate-300">
              <input
                type="checkbox"
                checked={confirmed}
                onChange={(e) => setConfirmed(e.target.checked)}
                className="accent-pink-500 mt-1"
              />
              I confirm no further bookings will be made.
            </label>

            <button
              disabled={!confirmed}
              onClick={async () => {
                const res = await api.post(
                  `/settlements/events/${eventId}/request`,
                  { organizerNotes: comment },
                );
                setSettlement(res.data);
              }}
              className="px-8 py-4 rounded-xl font-semibold bg-gradient-to-r from-pink-500 to-indigo-500"
            >
              Request Settlement
            </button>
          </div>
        )}

        {settlement && (
          <CommentsSection settlementId={settlement._id} isLocked={isFinal} />
        )}
      </div>
    </main>
  );
}

function Card({ label, value, highlight }) {
  return (
    <div
      className={`rounded-3xl p-6 border border-white/10 ${
        highlight ? "bg-emerald-500/20 text-emerald-400" : "bg-white/5"
      }`}
    >
      <p className="text-slate-400 text-sm">{label}</p>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );
}

function StatusBadge({ status }) {
  const colors = {
    requested: "bg-yellow-500/20 text-yellow-400",
    under_review: "bg-blue-500/20 text-blue-400",
    approved: "bg-emerald-500/20 text-emerald-400",
    rejected: "bg-rose-500/20 text-rose-400",
    paid: "bg-green-600/20 text-green-500",
  };

  return (
    <div className={`px-6 py-3 rounded-full w-fit ${colors[status]}`}>
      {status.replace("_", " ").toUpperCase()}
    </div>
  );
}

function CommentsSection({ settlementId, isLocked }) {
  const [comments, setComments] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    api
      .get(`/settlements/${settlementId}/comments`)
      .then((res) => setComments(res.data));
  }, [settlementId]);

  const sendMessage = async () => {
    const res = await api.post(`/settlements/${settlementId}/comment`, {
      message,
    });
    setComments([...comments, res.data]);
    setMessage("");
  };

  return (
    <div className="space-y-6 rounded-3xl bg-white/5 border border-white/10 p-8">
      <h3 className="text-xl font-semibold">Discussion</h3>

      {comments.map((c) => (
        <div key={c._id} className="bg-white/5 p-4 rounded-xl">
          <p className="text-xs text-slate-400">
            {c.userId?.name} • {c.role}
          </p>
          <p className="mt-1">{c.message}</p>
        </div>
      ))}

      {!isLocked && (
        <div className="flex gap-3">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 bg-white/5 border border-white/10 rounded-xl p-3"
            placeholder="Write a message..."
          />
          <button
            onClick={sendMessage}
            className="px-6 py-3 bg-pink-500 rounded-xl"
          >
            Send
          </button>
        </div>
      )}

      {isLocked && (
        <div className="text-xs text-slate-400">
          🔒 Comments closed. Settlement finalized.
        </div>
      )}
    </div>
  );
}
