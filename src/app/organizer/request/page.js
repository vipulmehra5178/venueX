"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { requireAuth, requireRoles } from "@/lib/routeGuards";

export default function OrganizerRequestPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!requireAuth(router)) return;
    if (!requireRoles(router, ["attendee"])) return;
  }, []);

  const submitRequest = async () => {
    try {
      setLoading(true);
      await api.post("/auth/request-organizer");
      setSubmitted(true);
    } catch (err) {
      alert("Failed to submit request");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <main className="min-h-screen flex items-center justify-center text-white">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">
            Request Submitted 🎉
          </h1>
          <p className="text-slate-400">
            An admin will review your request shortly.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center text-white">
      <div className="max-w-md w-full bg-white/5 border border-white/10 rounded-2xl p-8">
        <h1 className="text-3xl font-bold mb-4">
          Become an Organizer
        </h1>

        <p className="text-slate-400 mb-8">
          Organizers can create and manage events on VenueX.
        </p>

        <Button
          onClick={submitRequest}
          disabled={loading}
          className="w-full bg-pink-500 hover:bg-pink-600"
        >
          {loading ? "Submitting..." : "Request Organizer Access"}
        </Button>
      </div>
    </main>
  );
}
