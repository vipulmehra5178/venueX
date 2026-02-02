"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { motion } from "framer-motion";

export default function CreateEventPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    description: "",
    category: "music",

    startDateTime: "",
    endDateTime: "",

    mode: "offline",
    venueName: "",
    address: "",
    city: "",
    state: "",
    country: "India",
    onlineLink: "",

    isPaid: false,
    ticketPrice: 0,
    totalTickets: 100,
    maxTicketsPerUser: 4,

    coverImage: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/events", form);
      router.push("/organizer/events");
    } catch (err) {
      alert("Failed to create event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white px-6 py-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8"
      >
        <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
          Create New Event
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8">

          {/* BASIC INFO */}
          <section>
            <h2 className="text-xl mb-4">Basic Info</h2>
            <div className="grid gap-4">
              <input
                name="title"
                placeholder="Event Title"
                required
                onChange={handleChange}
                className="input"
              />
              <input
                name="subtitle"
                placeholder="Short tagline"
                onChange={handleChange}
                className="input"
              />
              <textarea
                name="description"
                placeholder="Event description"
                rows={4}
                onChange={handleChange}
                className="input"
              />
              <select name="category" onChange={handleChange} className="input">
                <option value="music">Music</option>
                <option value="tech">Tech</option>
                <option value="sports">Sports</option>
                <option value="comedy">Comedy</option>
                <option value="workshop">Workshop</option>
              </select>
            </div>
          </section>

          {/* DATE & TIME */}
          <section>
            <h2 className="text-xl mb-4">Date & Time</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="datetime-local"
                name="startDateTime"
                required
                onChange={handleChange}
                className="input"
              />
              <input
                type="datetime-local"
                name="endDateTime"
                onChange={handleChange}
                className="input"
              />
            </div>
          </section>

          {/* LOCATION */}
          <section>
            <h2 className="text-xl mb-4">Location</h2>

            <select name="mode" onChange={handleChange} className="input mb-4">
              <option value="offline">Offline</option>
              <option value="online">Online</option>
            </select>

            {form.mode === "offline" ? (
              <div className="grid gap-4">
                <input name="venueName" placeholder="Venue Name" onChange={handleChange} className="input" />
                <input name="address" placeholder="Address" onChange={handleChange} className="input" />
                <div className="grid md:grid-cols-2 gap-4">
                  <input name="city" placeholder="City" onChange={handleChange} className="input" />
                  <input name="state" placeholder="State" onChange={handleChange} className="input" />
                </div>
              </div>
            ) : (
              <input
                name="onlineLink"
                placeholder="Online Event Link"
                onChange={handleChange}
                className="input"
              />
            )}
          </section>

          {/* TICKETING */}
          <section>
            <h2 className="text-xl mb-4">Ticketing</h2>
            <label className="flex items-center gap-2 mb-4">
              <input type="checkbox" name="isPaid" onChange={handleChange} />
              Paid Event
            </label>

            {form.isPaid && (
              <input
                name="ticketPrice"
                type="number"
                placeholder="Ticket Price (INR)"
                onChange={handleChange}
                className="input"
              />
            )}

            <div className="grid md:grid-cols-2 gap-4">
              <input
                name="totalTickets"
                type="number"
                placeholder="Total Tickets"
                onChange={handleChange}
                className="input"
              />
              <input
                name="maxTicketsPerUser"
                type="number"
                placeholder="Max per user"
                onChange={handleChange}
                className="input"
              />
            </div>
          </section>

          {/* MEDIA */}
          <section>
            <h2 className="text-xl mb-4">Media</h2>
            <input
              name="coverImage"
              placeholder="Cover Image URL"
              onChange={handleChange}
              className="input"
            />
          </section>

          {/* PUBLISH */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl font-semibold bg-gradient-to-r from-purple-500 to-cyan-500 hover:opacity-90 transition"
          >
            {loading ? "Publishing..." : "Publish Event"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
