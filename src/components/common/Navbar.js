"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);

  const loadUser = () => {
    const stored = localStorage.getItem("user");
    setUser(stored ? JSON.parse(stored) : null);
  };

  useEffect(() => {
    loadUser();
    window.addEventListener("auth-change", loadUser);
    return () => window.removeEventListener("auth-change", loadUser);
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("auth-change"));
    window.location.href = "/";
  };

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-6 left-1/2 -translate-x-1/2 z-50
                 w-[92%] max-w-6xl rounded-2xl
                 bg-white/10 backdrop-blur-xl border border-white/20"
    >
      <div className="flex items-center justify-between px-6 py-4 text-white">

        <Link href="/" className="text-xl font-bold tracking-wide">
          Venue<span className="text-pink-400">X</span>
        </Link>

        <div className="flex gap-6 text-sm">
          <Link href="/events" className="hover:text-pink-400">
            Explore
          </Link>

          {user?.roles && (user.roles.includes("organizer") || user.roles.includes("admin")) && (
            <Link href="/organizer/dashboard" className="hover:text-pink-400">
              Host
            </Link>
          )}

          <Link href="/about" className="hover:text-pink-400">
            About
          </Link>
        </div>

        {!user ? (
          <Link href="/login">
            <Button className="bg-pink-500 hover:bg-pink-600">
              Get Started
            </Button>
          </Link>
        ) : (
          <div className="relative">
            <button
              onClick={() => setOpen(!open)}
              className="px-4 py-2 rounded-full bg-white/10"
            >
              {user.name}
            </button>

            {open && (
              <div
                className="absolute right-0 mt-3 w-48
                rounded-xl bg-black/90 border border-white/10"
              >
                {user.roles && user.roles.includes("attendee") && (
                  <Link
                    href="/organizer/request"
                    className="block px-4 py-3 hover:bg-white/10"
                  >
                    Become Organizer
                  </Link>
                )}

                {user.roles && user.roles.includes("admin") && (
                  <Link
                    href="/admin"
                    className="block px-4 py-3 hover:bg-white/10"
                  >
                    Admin Panel
                  </Link>
                )}

                <button
                  onClick={logout}
                  className="w-full text-left px-4 py-3
                  text-red-400 hover:bg-white/10"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.nav>
  );
}
