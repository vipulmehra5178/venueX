"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import api from "@/lib/axios";

export default function EditEventPage() {
  const { id } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await api.get(`/events/${id}`);
        setForm(res.data);
      } catch {
        alert("Failed to load event");
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put(`/events/${id}`, form);
      router.push("/organizer/events");
    } catch {
      alert("Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !form) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Loading event…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b0b0f] via-[#0f1220] to-[#0a0a12] text-white px-6 py-10">
      <div className="max-w-5xl mx-auto space-y-10">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Edit Event</h1>
          <p className="text-white/60 mt-1">
            Changes go live immediately after update
          </p>
        </div>

        <form onSubmit={handleUpdate} className="space-y-8">

          {/* BASIC INFO */}
          <Section title="Basic Info" gradient="from-indigo-500/20 to-purple-500/20">
            <input name="title" value={form.title} onChange={handleChange} className="input" />
            <input name="subtitle" value={form.subtitle || ""} onChange={handleChange} className="input" />
            <textarea
              name="description"
              rows={4}
              value={form.description || ""}
              onChange={handleChange}
              className="input"
            />
          </Section>

          {/* DATE & TIME */}
          <Section title="Date & Time" gradient="from-cyan-500/20 to-blue-500/20">
            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="datetime-local"
                name="startDateTime"
                value={form.startDateTime?.slice(0, 16)}
                onChange={handleChange}
                className="input"
              />
              <input
                type="datetime-local"
                name="endDateTime"
                value={form.endDateTime?.slice(0, 16) || ""}
                onChange={handleChange}
                className="input"
              />
            </div>
          </Section>

          {/* LOCATION */}
          <Section title="Location" gradient="from-emerald-500/20 to-teal-500/20">
            <select name="mode" value={form.mode} onChange={handleChange} className="input mb-4">
              <option value="offline">Offline</option>
              <option value="online">Online</option>
            </select>

            {form.mode === "offline" ? (
              <div className="grid gap-4">
                <input name="venueName" value={form.venueName || ""} onChange={handleChange} className="input" />
                <input name="address" value={form.address || ""} onChange={handleChange} className="input" />
                <div className="grid md:grid-cols-2 gap-4">
                  <input name="city" value={form.city || ""} onChange={handleChange} className="input" />
                  <input name="state" value={form.state || ""} onChange={handleChange} className="input" />
                </div>
              </div>
            ) : (
              <input
                name="onlineLink"
                value={form.onlineLink || ""}
                onChange={handleChange}
                className="input"
              />
            )}
          </Section>

          {/* TICKETS */}
          <Section title="Ticketing" gradient="from-amber-500/20 to-orange-500/20">
            <label className="flex items-center gap-3">
              <input type="checkbox" name="isPaid" checked={form.isPaid} onChange={handleChange} />
              Paid Event
            </label>

            {form.isPaid && (
              <input
                type="number"
                name="ticketPrice"
                value={form.ticketPrice}
                onChange={handleChange}
                className="input"
              />
            )}

            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="number"
                name="totalTickets"
                value={form.totalTickets}
                onChange={handleChange}
                className="input"
              />
              <input
                type="number"
                name="maxTicketsPerUser"
                value={form.maxTicketsPerUser}
                onChange={handleChange}
                className="input"
              />
            </div>
          </Section>

          {/* ACTIONS */}
          <div className="flex gap-4 pt-6">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-4 rounded-xl font-semibold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
            >
              {saving ? "Updating…" : "Update Event"}
            </button>

            <button
              type="button"
              onClick={async () => {
                if (!confirm("Cancel this event?")) return;
                await api.delete(`/events/${id}`);
                router.push("/organizer/events");
              }}
              className="px-6 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30"
            >
              Cancel Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ---------- Section Component ---------- */

function Section({ title, gradient, children }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl p-6 bg-gradient-to-br ${gradient} backdrop-blur-xl border border-white/10 space-y-4`}
    >
      <h2 className="text-xl font-semibold">{title}</h2>
      {children}
    </motion.section>
  );
}
