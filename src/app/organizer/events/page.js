"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { requireAuth, requireRoles } from "@/lib/routeGuards";

export default function CreateEventPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    category: "music",
    date: "",
    startTime: "",
    endTime: "",
    venueName: "",
    city: "",
    address: "",
    capacity: "",
    price: "",
    bannerImage: "",
  });

  useEffect(() => {
    if (!requireAuth(router)) return;
    if (!requireRoles(router, ["organizer", "admin"])) return;
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async () => {
    try {
      setLoading(true);
      await api.post("/events", form);
      router.push("/organizer/events");
    } catch (err) {
      alert("Failed to create event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen px-6 py-24 text-white max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold mb-10">
        Create Event
      </h1>

      <div className="space-y-6">
        <Input name="title" placeholder="Event Title" onChange={handleChange} />
        <Input name="subtitle" placeholder="Short Subtitle" onChange={handleChange} />

        <select
          name="category"
          onChange={handleChange}
          className="w-full bg-black/30 border border-white/10 rounded-md px-3 py-2"
        >
          <option value="music">Music</option>
          <option value="tech">Tech</option>
          <option value="sports">Sports</option>
          <option value="comedy">Comedy</option>
          <option value="workshop">Workshop</option>
          <option value="networking">Networking</option>
        </select>

        <div className="grid grid-cols-2 gap-4">
          <Input type="date" name="date" onChange={handleChange} />
          <Input type="number" name="capacity" placeholder="Capacity" onChange={handleChange} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input type="time" name="startTime" onChange={handleChange} />
          <Input type="time" name="endTime" onChange={handleChange} />
        </div>

        <Input name="venueName" placeholder="Venue Name" onChange={handleChange} />
        <Input name="city" placeholder="City" onChange={handleChange} />
        <Input name="address" placeholder="Full Address" onChange={handleChange} />

        <Input
          name="price"
          placeholder="Ticket Price (0 for free)"
          onChange={handleChange}
        />

        <Input
          name="bannerImage"
          placeholder="Banner Image URL"
          onChange={handleChange}
        />

        <Button
          onClick={submit}
          disabled={loading}
          className="bg-pink-500 hover:bg-pink-600 w-full"
        >
          {loading ? "Creating..." : "Publish Event"}
        </Button>
      </div>
    </main>
  );
}
