"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { requireAuth, requireRoles } from "@/lib/routeGuards";

export default function AdminSettlementsPage() {
  const router = useRouter();
  const [settlements, setSettlements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!requireAuth(router)) return;
    if (!requireRoles(router, ["admin"])) return;

    api.get("/settlements/admin/pending")
      .then(res => setSettlements(res.data))
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Loading settlements…
      </div>
    );
  }

  return (
    <main className="min-h-screen px-8 py-28 bg-gradient-to-br from-[#05050a] via-[#0f1021] to-[#05050a] text-white">
      <div className="max-w-6xl mx-auto space-y-14">

        <h1 className="text-4xl font-bold">
          Settlement <span className="text-pink-400">Review</span>
        </h1>

        {settlements.length === 0 && (
          <p className="text-slate-400">No pending settlements 🎉</p>
        )}

        {settlements.map((s) => (
          <SettlementCard
            key={s._id}
            settlement={s}
            onRemove={(id) =>
              setSettlements(prev => prev.filter(x => x._id !== id))
            }
          />
        ))}
      </div>
    </main>
  );
}


function SettlementCard({ settlement, onRemove }) {
  const [editing, setEditing] = useState(false);

  const [localSettlement, setLocalSettlement] = useState(settlement);

  const [feePercent, setFeePercent] = useState(
    settlement.platformFeePercent
  );

  const [finalAmount, setFinalAmount] = useState(
    settlement.finalPayableAmount ||
      settlement.netPayableAmount
  );

  const [adminNotes, setAdminNotes] = useState(
    settlement.adminNotes || ""
  );

  const gross = localSettlement.grossRevenue;

  const calculatedFee = Math.round(
    (gross * feePercent) / 100
  );

  const calculatedNet = gross - calculatedFee;

  useEffect(() => {
    if (editing) {
      setFinalAmount(calculatedNet);
    }
  }, [feePercent]);

  const saveChanges = async () => {
    const res = await api.put(
      `/settlements/admin/${localSettlement._id}`,
      {
        platformFeePercent: feePercent,
        finalPayableAmount: finalAmount,
        adminNotes,
      }
    );

    setLocalSettlement(res.data);

    setEditing(false);
  };

  const approve = async () => {
    await api.post(
      `/settlements/admin/${localSettlement._id}/approve`
    );
    onRemove(localSettlement._id);
  };

  const reject = async () => {
    await api.post(
      `/settlements/admin/${localSettlement._id}/reject`,
      { adminNotes }
    );
    onRemove(localSettlement._id);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="rounded-3xl bg-white/5 border border-white/10 p-8 space-y-6"
    >
      <h2 className="text-xl font-semibold">
        {localSettlement.eventId?.title}
      </h2>

      <div className="grid sm:grid-cols-4 gap-4 text-center">
        <Metric label="Gross" value={`₹${gross}`} />

        <Metric
          label="Platform Fee"
          value={`₹${
            editing
              ? calculatedFee
              : localSettlement.platformFeeAmount
          }`}
        />

        <Metric
          label="Net Calculated"
          value={`₹${
            editing
              ? calculatedNet
              : localSettlement.netPayableAmount
          }`}
        />

        <Metric
          label="Final Settlement"
          value={`₹${
            editing
              ? finalAmount
              : localSettlement.finalPayableAmount
          }`}
          highlight
        />
      </div>

      {editing && (
        <div className="space-y-4 pt-4 border-t border-white/10">
          <div>
            <label className="text-sm text-slate-400">
              Platform Fee %
            </label>
            <input
              type="number"
              value={feePercent}
              onChange={(e) =>
                setFeePercent((e.target.value))
              }
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 mt-1"
            />
          </div>

          <div>
            <label className="text-sm text-slate-400">
              Final Settlement Amount
            </label>
            <input
              type="number"
              value={finalAmount}
              onChange={(e) =>
                setFinalAmount((e.target.value))
              }
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 mt-1"
            />
          </div>

          
          <button
            onClick={saveChanges}
            className="px-6 py-2 bg-blue-500 rounded-xl"
          >
            Save Changes
          </button>
        </div>
      )}

      <div className="flex gap-4 justify-end pt-4 border-t border-white/10">
        <button
          onClick={() => setEditing(!editing)}
          className="px-5 py-2 bg-white/10 rounded-xl"
        >
          {editing ? "Cancel" : "Edit"}
        </button>

        <button
          onClick={approve}
          className="px-6 py-2 bg-emerald-500 text-black rounded-xl"
        >
          Approve
        </button>

        <button
          onClick={reject}
          className="px-6 py-2 bg-rose-500 text-black rounded-xl"
        >
          Reject
        </button>
      </div>

      <CommentsSection settlementId={localSettlement._id} />
    </motion.div>
  );
}

function CommentsSection({ settlementId }) {
  const [comments, setComments] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    api.get(`/settlements/${settlementId}/comments`)
      .then(res => setComments(res.data));
  }, [settlementId]);

  const sendMessage = async () => {
    const res = await api.post(
      `/settlements/${settlementId}/comment`,
      { message }
    );
    setComments([...comments, res.data]);
    setMessage("");
  };

  return (
    <div className="space-y-4 border-t border-white/10 pt-6">
      <h3 className="text-sm font-semibold text-slate-300">
        Discussion
      </h3>

      {comments.map(c => (
        <div key={c._id} className="bg-white/5 p-3 rounded-lg">
          <p className="text-xs text-slate-400">
            {c.userId?.name} • {c.role}
          </p>
          <p className="mt-1 text-sm">{c.message}</p>
        </div>
      ))}

      <div className="flex gap-2">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 bg-white/5 border border-white/10 rounded-xl p-2 text-sm"
          placeholder="Write comment..."
        />
        <button
          onClick={sendMessage}
          className="px-4 py-2 bg-pink-500 rounded-xl text-sm"
        >
          Send
        </button>
      </div>
    </div>
  );
}


function Metric({ label, value, highlight }) {
  return (
    <div
      className={`rounded-2xl p-4 ${
        highlight ? "bg-emerald-500/20 text-emerald-400" : "bg-white/5"
      }`}
    >
      <p className="text-sm text-slate-400">{label}</p>
      <p className="text-xl font-bold mt-1">{value}</p>
    </div>
  );
}
