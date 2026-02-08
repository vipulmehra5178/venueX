"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  DollarSign,
  Image as ImageIcon,
  Type,
  Check,
  X,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import api from "@/lib/axios";

export default function CreateEventPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [galleryInput, setGalleryInput] = useState("");

  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    description: "",
    category: "music",
    tags: [],
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
    gallery: [],
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };


  const handleSubmit = async () => {
    const missing = [];

    if (!form.title) missing.push("Event Title");
    if (!form.description) missing.push("Description");
    if (!form.category) missing.push("Category");
    if (!form.startDateTime) missing.push("Start Date");
    if (!form.endDateTime) missing.push("End Date");
    if (!form.coverImage) missing.push("Cover Image");
    if (!form.totalTickets) missing.push("Total Tickets");
    if (!form.maxTicketsPerUser) missing.push("Max Tickets Per User");

    if (form.mode !== "online") {
      if (!form.venueName) missing.push("Venue Name");
      if (!form.address) missing.push("Address");
      if (!form.city) missing.push("City");
      if (!form.state) missing.push("State");
      if (!form.country) missing.push("Country");
      if (!form.mapLink) missing.push("Google Maps Link");
    }

    if (form.mode !== "offline") {
      if (!form.onlineLink) missing.push("Online Event Link");
    }

    if (form.isPaid) {
      if (!form.ticketPrice || form.ticketPrice <= 0)
        missing.push("Ticket Price");
      if (!form.currency) missing.push("Currency");
    }

    if (missing.length > 0) {
      alert(
        `Please complete all required fields before publishing:\n\n• ${missing.join(
          "\n• "
        )}`
      );
      return;
    }

    setLoading(true);
    try {
      await api.post("/events", {
        ...form,
        ticketPrice: Number(form.ticketPrice),
        totalTickets: Number(form.totalTickets),
        maxTicketsPerUser: Number(form.maxTicketsPerUser),
      });
      router.push("/organizer/events");
    } catch (err) {
      console.error(err);
      alert("Failed to publish event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07070a] text-white pt-28 pb-24">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[140px]" />
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[140px]" />
      </div>

      <div className="relative max-w-5xl mx-auto px-6">
        <div className="flex justify-between items-center mb-14">
          <div>
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-white/60 hover:text-white mb-4"
            >
              <ArrowLeft size={16} /> Back
            </button>
            <h1 className="text-5xl font-bold">Create Event</h1>
            <p className="text-white/50 mt-3">
              Craft an unforgettable experience.
            </p>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="hidden md:flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-black font-bold disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Check />}
            {loading ? "Publishing…" : "Publish"}
          </button>
        </div>

        <div className="space-y-10">
          <Section title="Event Details" icon={Type}>
            <InputGroup label="Event Title" required>
              <input name="title" value={form.title} onChange={handleChange} className="input-field text-lg font-semibold" />
            </InputGroup>

            <InputGroup label="Subtitle">
              <input name="subtitle" value={form.subtitle} onChange={handleChange} className="input-field" />
            </InputGroup>

            <InputGroup label="Description" required>
              <textarea name="description" value={form.description} onChange={handleChange} rows={5} className="input-field min-h-[140px]" />
            </InputGroup>

            <InputGroup label="Category" required>
              <select name="category" value={form.category} onChange={handleChange} className="input-field">
                {["music", "tech", "sports", "comedy", "workshop", "meetup"].map(c => (
                  <option key={c} value={c} className="bg-[#16161d] capitalize">
                    {c}
                  </option>
                ))}
              </select>
            </InputGroup>

            <InputGroup label="Tags (press enter)">
              <div className="input-field flex flex-wrap gap-2">
                {form.tags.map(tag => (
                  <span key={tag} className="bg-indigo-500/20 px-3 py-1 rounded-full text-xs">
                    #{tag}
                    <X size={12} className="inline ml-2 cursor-pointer" onClick={() =>
                      setForm({ ...form, tags: form.tags.filter(t => t !== tag) })
                    } />
                  </span>
                ))}
                <input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && tagInput.trim()) {
                      e.preventDefault();
                      setForm({ ...form, tags: [...form.tags, tagInput.trim()] });
                      setTagInput("");
                    }
                  }}
                  className="bg-transparent outline-none flex-1"
                />
              </div>
            </InputGroup>
          </Section>

          <Section title="Time & Place" icon={MapPin}>
            <div className="grid md:grid-cols-2 gap-6">
              <InputGroup label="Start Date" required>
                <input type="datetime-local" name="startDateTime" value={form.startDateTime} onChange={handleChange} className="input-field" />
              </InputGroup>
              <InputGroup label="End Date" required>
                <input type="datetime-local" name="endDateTime" value={form.endDateTime} onChange={handleChange} className="input-field" />
              </InputGroup>
            </div>

            <div className="flex gap-2 mt-6">
              {["offline", "online", "hybrid"].map(m => (
                <button
                  key={m}
                  onClick={() => setForm({ ...form, mode: m })}
                  className={`px-6 py-3 rounded-xl capitalize ${
                    form.mode === m ? "bg-indigo-600" : "bg-white/10 text-white/60"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>

            <AnimatePresence>
              {form.mode !== "online" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 mt-6">
                  <InputGroup label="Venue Name" required>
                    <input name="venueName" value={form.venueName} onChange={handleChange} className="input-field" />
                  </InputGroup>
                  <InputGroup label="Address" required>
                    <input name="address" value={form.address} onChange={handleChange} className="input-field" />
                  </InputGroup>
                  <div className="grid grid-cols-3 gap-4">
                    <input name="city" value={form.city} onChange={handleChange} placeholder="City" className="input-field" />
                    <input name="state" value={form.state} onChange={handleChange} placeholder="State" className="input-field" />
                    <input name="country" value={form.country} onChange={handleChange} placeholder="Country" className="input-field" />
                  </div>
                  <InputGroup label="Google Maps Link" required>
                    <input name="mapLink" value={form.mapLink} onChange={handleChange} className="input-field" />
                  </InputGroup>
                </motion.div>
              )}
            </AnimatePresence>

            {form.mode !== "offline" && (
              <InputGroup label="Online Event Link" required>
                <input name="onlineLink" value={form.onlineLink} onChange={handleChange} className="input-field mt-4" />
              </InputGroup>
            )}
          </Section>

          <Section title="Media & Visuals" icon={ImageIcon}>
            <InputGroup label="Cover Image URL" required>
              <input name="coverImage" value={form.coverImage} onChange={handleChange} className="input-field" />
            </InputGroup>

            <InputGroup label="Gallery URLs (press enter)">
              <input
                value={galleryInput}
                onChange={(e) => setGalleryInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && galleryInput.trim()) {
                    e.preventDefault();
                    setForm({ ...form, gallery: [...form.gallery, galleryInput.trim()] });
                    setGalleryInput("");
                  }
                }}
                className="input-field"
              />
            </InputGroup>
          </Section>

          <Section title="Ticketing" icon={DollarSign}>
            <div className="flex justify-between items-center">
              <span>Paid Event</span>
              <button
                onClick={() => setForm({ ...form, isPaid: !form.isPaid })}
                className={`w-14 h-8 rounded-full p-1 ${form.isPaid ? "bg-indigo-500" : "bg-white/20"}`}
              >
                <motion.div layout className={`w-6 h-6 bg-white rounded-full ${form.isPaid ? "ml-auto" : ""}`} />
              </button>
            </div>

            {form.isPaid && (
              <div className="grid md:grid-cols-2 gap-6 mt-6">
                <InputGroup label="Ticket Price" required>
                  <input type="number" name="ticketPrice" value={form.ticketPrice} onChange={handleChange} className="input-field" />
                </InputGroup>
                <InputGroup label="Currency" required>
                  <input name="currency" value={form.currency} onChange={handleChange} className="input-field uppercase" />
                </InputGroup>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-6 mt-6">
              <InputGroup label="Total Tickets" required>
                <input type="number" name="totalTickets" value={form.totalTickets} onChange={handleChange} className="input-field" />
              </InputGroup>
              <InputGroup label="Max Tickets Per User" required>
                <input type="number" name="maxTicketsPerUser" value={form.maxTicketsPerUser} onChange={handleChange} className="input-field" />
              </InputGroup>
            </div>
          </Section>

          <button onClick={handleSubmit} className="md:hidden w-full py-5 rounded-xl bg-indigo-600 font-bold">
            Publish Event
          </button>
        </div>
      </div>
    </div>
  );
}


function Section({ title, icon: Icon, children }) {
  return (
    <section className="bg-[#16161d]/90 border border-white/10 rounded-3xl p-8 space-y-6 shadow-xl">
      <div className="flex items-center gap-4 pb-4 border-b border-white/10">
        <div className="w-11 h-11 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-300">
          <Icon size={22} />
        </div>
        <h2 className="text-3xl font-bold">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function InputGroup({ label, required, children }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-white/80">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      {children}
    </div>
  );
}
