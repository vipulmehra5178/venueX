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

    api.get("/admin/pending-organizers")
      .then((res) => setUsers(res.data.users))
      .finally(() => setLoading(false));
  }, []);

  const approve = async (userId) => {
    await api.post("/auth/approve-organizer", { userId });
    setUsers((prev) => prev.filter((u) => u._id !== userId));
  };

  if (loading) return null;

  return (
    <main className="min-h-screen px-6 py-24 text-white">
      <h1 className="text-4xl font-bold mb-10">Admin Panel</h1>

      {users.length === 0 && (
        <p className="text-slate-400">No pending organizer requests</p>
      )}

      <div className="space-y-4">
        {users.map((u) => (
          <div
            key={u._id}
            className="flex justify-between items-center
            bg-white/5 border border-white/10 rounded-xl p-4"
          >
            <div>
              <p className="font-semibold">{u.name}</p>
              <p className="text-sm text-slate-400">{u.email}</p>
            </div>

            <Button
              onClick={() => approve(u._id)}
              className="bg-green-500 text-black"
            >
              Approve
            </Button>
          </div>
        ))}
      </div>
    </main>
  );
}
