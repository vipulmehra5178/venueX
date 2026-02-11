"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { requireAuth, requireRoles } from "@/lib/routeGuards";

export default function AdminPage() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!requireAuth(router)) return;
    if (!requireRoles(router, ["admin"])) return;

    api
      .get("/admin/pending-organizers")
      .then((res) => setUsers(res.data.users))
      .finally(() => setLoading(false));
  }, [router]);

  const approve = async (userId) => {
  try {
    await api.post("/auth/approve-organizer", { userId });
    setUsers((prev) => prev.filter((u) => u._id !== userId));
  } catch (err) {
    console.error(err);
    alert("Failed to approve organizer");
  }
};


  if (loading) return null;

  return (
    <main className="min-h-screen px-6 py-24 pt-30 text-white max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-bold">Admin Panel</h1>
          <p className="text-slate-400 mt-2">
            Manage organizers, settlements, and platform operations
          </p>
        </div>

        <Button
          onClick={() => router.push("/admin/settlements")}
          className="bg-pink-500 hover:bg-pink-600 text-black font-semibold"
        >
          Settlement Requests
        </Button>
      </div>

      <h2 className="text-2xl font-semibold mb-6">
        Pending Organizer Requests
      </h2>

      {users.length === 0 && (
        <p className="text-slate-400">No pending organizer requests</p>
      )}

      <div className="space-y-4">
        {users.map((u) => (
          <div
            key={u._id}
            className="flex justify-between items-center
            bg-white/5 border border-white/10 rounded-xl p-5"
          >
            <div>
              <p className="font-semibold">{u.name}</p>
              <p className="text-sm text-slate-400">{u.email}</p>
            </div>

            <Button
              onClick={() => approve(u._id)}
              className="bg-emerald-500 text-black hover:bg-emerald-600"
            >
              Approve
            </Button>
          </div>
        ))}
      </div>
    </main>
  );
}
