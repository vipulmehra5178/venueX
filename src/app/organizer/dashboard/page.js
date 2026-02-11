"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import api from "@/lib/axios";
import { requireAuth, requireRoles } from "@/lib/routeGuards";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

export default function OrganizerDashboard() {
  const router = useRouter();
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!requireAuth(router)) return;
    if (!requireRoles(router, ["organizer", "admin"])) return;

    const fetchAnalytics = async () => {
      try {
        const res = await api.get("/analytics/organizer/revenue");
        setData(res.data);
      } catch (err) {
        console.error("Failed to load analytics", err);
      }
    };

    fetchAnalytics();
  }, [router]);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        Loading dashboard…
      </div>
    );
  }

  const revenueTimeline = Object.entries(
    data.charts.revenueByDate
  ).map(([date, revenue]) => ({ date, revenue }));

  const revenueByEvent = Object.entries(
    data.charts.revenueByEvent
  ).map(([event, revenue]) => ({ event, revenue }));

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#06060c] via-[#0b0b18] to-[#06060c] text-white px-6 py-32">
      <div className="max-w-7xl mx-auto space-y-20">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold">
            Organizer <span className="text-pink-400">Dashboard</span>
          </h1>

          <p className="text-slate-400 mt-2">
            Manage your events, revenue & performance
          </p>
        </motion.div>

        <div className="flex flex-wrap gap-6">
          <Link href="/organizer/events/create">
            <Button className="bg-pink-500 hover:bg-pink-600">
              + Create New Event
            </Button>
          </Link>

          <Link href="/organizer/events">
            <Button variant="outline">
              View My Events
            </Button>
          </Link>
        </div>

        <div className="grid sm:grid-cols-3 gap-6">
          <StatCard
            label="Total Revenue"
            value={`₹${data.summary.totalRevenue}`}
          />
          <StatCard
            label="Tickets Sold"
            value={data.summary.totalTickets}
          />
          <StatCard
            label="Total Bookings"
            value={data.summary.totalBookings}
          />
        </div>

        <GlassCard title="Revenue Over Time">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueTimeline}>
              <XAxis dataKey="date" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#ec4899"
                strokeWidth={3}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </GlassCard>

        <GlassCard title="Revenue by Event">
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={revenueByEvent}>
              <XAxis dataKey="event" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip />
              <Bar dataKey="revenue" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>
      </div>
    </main>
  );
}


function StatCard({ label, value }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl p-6"
    >
      <p className="text-slate-400 text-sm">{label}</p>
      <p className="text-3xl font-extrabold mt-2">{value}</p>
    </motion.div>
  );
}

function GlassCard({ title, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl p-6 space-y-6"
    >
      <h2 className="text-xl font-semibold">{title}</h2>
      {children}
    </motion.div>
  );
}
