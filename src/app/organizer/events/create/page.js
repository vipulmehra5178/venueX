"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import api from "@/lib/axios";

export default function CreateEventPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    description: "",
    category: "music",
    tags: "",

    startDateTime: "",
    endDateTime: "",
    timezone: "Asia/Kolkata",

    mode: "offline",
    venueName: "",
    address: "",
    city: "",
    state: "",
    country: "India",
    mapLink: "",
    onlineLink: "",

    isPaid: false,
    ticketPrice: 0,
    currency: "INR",
    totalTickets: 100,
    maxTicketsPerUser: 5,

    coverImage: "",
    gallery: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/events", {
        ...form,
        tags: form.tags.split(",").map(t => t.trim()),
        gallery: form.gallery
          ? form.gallery.split(",").map(url => url.trim())
          : [],
      });

      router.push("/organizer/events");
    } catch (err) {
      alert("Failed to publish event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#070710] via-[#0b0f1f] to-[#050509] text-white px-6 py-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto space-y-10"
      >
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Publish New Event
          </h1>
          <p className="text-white/60 mt-2">
            All events go live immediately after publishing
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">

          {/* BASIC INFO */}
          <Section title="Basic Information" gradient="from-indigo-500/20 to-purple-500/20">
            <input name="title" required placeholder="Event title" onChange={handleChange} className="input" />
            <input name="subtitle" placeholder="Short tagline" onChange={handleChange} className="input" />
            <textarea name="description" rows={4} placeholder="Full event description" onChange={handleChange} className="input" />

            <div className="grid md:grid-cols-2 gap-4 text-white">
              <select name="category" onChange={handleChange} className="input text-black bg-white">
                <option value="music">Music</option>
                <option value="tech">Tech</option>
                <option value="sports">Sports</option>
                <option value="comedy">Comedy</option>
                <option value="workshop">Workshop</option>
                <option value="meetup">Meetup</option>
              </select>

              <input
                name="tags"
                placeholder="Tags (comma separated)"
                onChange={handleChange}
                className="input"
              />
            </div>
          </Section>

          {/* DATE & TIME */}
          <Section title="Date & Time" gradient="from-cyan-500/20 to-blue-500/20">
            <div className="grid md:grid-cols-3 gap-4">
              <input type="datetime-local" name="startDateTime" required onChange={handleChange} className="input" />
              <input type="datetime-local" name="endDateTime" onChange={handleChange} className="input" />
              <input name="timezone" onChange={handleChange} className="input" />
            </div>
          </Section>

          {/* LOCATION */}
          <Section title="Location" gradient="from-emerald-500/20 to-teal-500/20">
            <select name="mode" onChange={handleChange} className="input">
              <option value="offline">Offline</option>
              <option value="online">Online</option>
              <option value="hybrid">Hybrid</option>
            </select>

            {form.mode !== "online" && (
              <>
                <input name="venueName" placeholder="Venue name" onChange={handleChange} className="input" />
                <input name="address" placeholder="Address" onChange={handleChange} className="input" />
                <div className="grid md:grid-cols-3 gap-4">
                  <input name="city" placeholder="City" onChange={handleChange} className="input" />
                  <input name="state" placeholder="State" onChange={handleChange} className="input" />
                  <input name="country" placeholder="Country" onChange={handleChange} className="input" />
                </div>
                <input name="mapLink" placeholder="Google Maps link" onChange={handleChange} className="input" />
              </>
            )}

            {form.mode !== "offline" && (
              <input name="onlineLink" placeholder="Online event link" onChange={handleChange} className="input" />
            )}
          </Section>

          {/* TICKETING */}
          <Section title="Ticketing" gradient="from-amber-500/20 to-orange-500/20">
            <label className="flex items-center gap-3">
              <input type="checkbox" name="isPaid" onChange={handleChange} />
              Paid Event
            </label>

            {form.isPaid && (
              <div className="grid md:grid-cols-2 gap-4">
                <input type="number" name="ticketPrice" placeholder="Ticket price" onChange={handleChange} className="input" />
                <input name="currency" onChange={handleChange} className="input" />
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-4">
              <input type="number" name="totalTickets" placeholder="Total tickets" onChange={handleChange} className="input" />
              <input type="number" name="maxTicketsPerUser" placeholder="Max per user" onChange={handleChange} className="input" />
            </div>
          </Section>

          {/* MEDIA */}
          <Section title="Media" gradient="from-pink-500/20 to-fuchsia-500/20">
            <input name="coverImage" placeholder="Cover image URL" onChange={handleChange} className="input" />
            <textarea
              name="gallery"
              placeholder="Gallery image URLs (comma separated)"
              onChange={handleChange}
              className="input"
            />
          </Section>

          {/* PUBLISH */}
          <button
            disabled={loading}
            className="w-full py-4 rounded-xl font-semibold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:opacity-90 transition"
          >
            {loading ? "Publishing…" : "Publish Event"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

/* ---------- Section Wrapper ---------- */
function Section({ title, gradient, children }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl p-6 bg-gradient-to-br ${gradient} border border-white/10 backdrop-blur-xl space-y-4`}
    >
      <h2 className="text-xl font-semibold">{title}</h2>
      {children}
    </motion.section>
  );
}
