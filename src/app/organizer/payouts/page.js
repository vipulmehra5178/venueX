"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { motion } from "framer-motion";

export default function OrganizerPayoutsPage() {
  const [payouts, setPayouts] = useState([]);

  useEffect(() => {
    api.get("/payouts/me").then((res) => setPayouts(res.data));
  }, []);

  return (
    <main className="min-h-screen px-6 py-28 text-white bg-black">
      <div className="max-w-5xl mx-auto space-y-10">

        <h1 className="text-4xl font-bold">
          Payouts & <span className="text-emerald-400">Earnings</span>
        </h1>

        <button
          onClick={() => api.post("/payouts/request").then(() => location.reload())}
          className="px-6 py-3 rounded-xl bg-emerald-500 text-black font-semibold"
        >
          Request Payout
        </button>

        <div className="space-y-6">
          {payouts.map((p) => (
            <motion.div
              key={p._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl bg-white/5 border border-white/10 p-6"
            >
              <div className="flex justify-between">
                <div>
                  <p>Total: ₹{p.amount}</p>
                  <p className="text-slate-400">
                    Platform Fee: ₹{p.platformFee}
                  </p>
                  <p className="font-bold text-emerald-400">
                    Net: ₹{p.netAmount}
                  </p>
                </div>

                <span
                  className={`px-4 py-1 rounded-full text-sm
                    ${
                      p.status === "paid"
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "bg-yellow-500/20 text-yellow-400"
                    }`}
                >
                  {p.status}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}
