"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { requireAuth, requireRoles } from "@/lib/routeGuards";

export default function OrganizerDashboard() {
  const router = useRouter();

  useEffect(() => {
    if (!requireAuth(router)) return;
    if (!requireRoles(router, ["organizer", "admin"])) return;
  }, []);

  return (
    <main className="min-h-screen px-6 py-32 text-white max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold mb-4">
        Organizer Dashboard
      </h1>

      <p className="text-slate-400 mb-12">
        Manage your events and reach your audience.
      </p>

      <div className="flex gap-6">
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
    </main>
  );
}
