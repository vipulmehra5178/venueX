"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
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
  CartesianGrid,
} from "recharts";

export default function AdminDashboard() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [detailType, setDetailType] = useState(null);
  const [detailData, setDetailData] = useState([]);

  useEffect(() => {
    if (!requireAuth(router)) return;
    if (!requireRoles(router, ["admin"])) return;

    const fetchData = async () => {
      const res = await api.get("/admin/analytics");
      setData(res.data);
    };

    fetchData();
  }, [router]);

  const openDetail = async (type) => {
    setDetailType(type);
    const res = await api.get(`/admin/analytics/${type}`);
    setDetailData(res.data);
  };

  const closeDetail = () => {
    setDetailType(null);
    setDetailData([]);
  };

  if (!data) {
    return (
      <div className="min-h-screen pt-25 bg-black text-white flex items-center justify-center">
        Loading analytics...
      </div>
    );
  }

  const revenueTimeline = Object.entries(
    data.charts.revenueByDate
  ).map(([date, revenue]) => ({ date, revenue }));

  const topEvents = Object.entries(
    data.charts.revenueByEvent
  ).map(([event, revenue]) => ({ event, revenue }));

  return (
    <main className=" pt-25 relative min-h-screen bg-black text-white px-6 py-24">

      <h1 className="text-4xl font-bold mb-12">
        Admin <span className="text-pink-400">Analytics</span>
      </h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-20">
        <KPI
          label="Total Revenue"
          value={`₹${data.summary.totalRevenue}`}
          onClick={() => openDetail("bookings")}
        />
        <KPI
          label="Total Bookings"
          value={data.summary.totalBookings}
          onClick={() => openDetail("bookings")}
        />
        <KPI
          label="Tickets Sold"
          value={data.summary.totalTickets}
          onClick={() => openDetail("bookings")}
        />
        <KPI
          label="Published Events"
          value={data.summary.totalEvents}
          onClick={() => openDetail("events")}
        />
        <KPI
          label="Active Organizers"
          value={data.summary.activeOrganizers}
          onClick={() => openDetail("organizers")}
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-10">
        <GlassCard title="Revenue Timeline">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueTimeline}>
              <CartesianGrid strokeDasharray="3 3" stroke="#222" />
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

        <GlassCard title="Top Events">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topEvents}>
              <CartesianGrid strokeDasharray="3 3" stroke="#222" />
              <XAxis dataKey="event" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip />
              <Bar dataKey="revenue" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>
      </div>

      <AnimatePresence>
        {detailType && (
          <DetailModal
            type={detailType}
            data={detailData}
            onClose={closeDetail}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
function KPI({ label, value, onClick }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      onClick={onClick}
      className="cursor-pointer rounded-2xl bg-white/5 border border-white/10 p-6 hover:border-pink-500 transition"
    >
      <p className="text-sm text-slate-400">{label}</p>
      <p className="text-2xl font-bold mt-2">{value}</p>
    </motion.div>
  );
}

function GlassCard({ title, children }) {
  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
      <h2 className="text-lg font-semibold mb-6">{title}</h2>
      {children}
    </div>
  );
}

function DetailModal({ type, data, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex justify-center items-center p-6"
    >
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        exit={{ y: 100 }}
        className="bg-[#0f0f1a] w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-2xl p-8 border border-white/10"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold capitalize">{type} Details</h2>
          <button
            onClick={onClose}
            className="bg-red-600 px-4 py-2 rounded"
          >
            Close
          </button>
        </div>

        {type === "events" &&
          data.map((event) => (
            <div
              key={event._id}
              className="mb-6 p-6 bg-white/5 rounded-lg border border-white/10"
            >
              <p><strong>Title:</strong> {event.title}</p>
              <p><strong>Category:</strong> {event.category}</p>
              <p><strong>Organizer:</strong> {event.organizerId?.name}</p>
              <p><strong>Email:</strong> {event.organizerId?.email}</p>
              <p><strong>Revenue:</strong> ₹{event.revenue}</p>
              <p><strong>Tickets Sold:</strong> {event.ticketsSold}</p>
              <p><strong>Status:</strong> {event.status}</p>
              <p><strong>City:</strong> {event.city}</p>
            </div>
          ))}

        {type === "bookings" &&
          data.map((booking) => (
            <div
              key={booking._id}
              className="mb-6 p-6 bg-white/5 rounded-lg border border-white/10"
            >
              <p><strong>User:</strong> {booking.userId?.name}</p>
              <p><strong>Email:</strong> {booking.userId?.email}</p>
              <p><strong>Event:</strong> {booking.eventId?.title}</p>
              <p><strong>Tickets:</strong> {booking.quantity}</p>
              <p><strong>Total Amount:</strong> ₹{booking.totalAmount}</p>
              <p><strong>Status:</strong> {booking.status}</p>
              <p><strong>Payment Provider:</strong> {booking.paymentProvider}</p>
            </div>
          ))}

        {type === "organizers" &&
          data.map((org) => (
            <div
              key={org._id}
              className="mb-6 p-6 bg-white/5 rounded-lg border border-white/10"
            >
              <p><strong>Name:</strong> {org.name}</p>
              <p><strong>Email:</strong> {org.email}</p>
              <p><strong>Total Events:</strong> {org.totalEvents}</p>
              <p><strong>Total Revenue:</strong> ₹{org.totalRevenue}</p>
              <p><strong>Total Tickets:</strong> {org.totalTickets}</p>
            </div>
          ))}
      </motion.div>
    </motion.div>
  );
}
