"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import Link from "next/link";
import { FaUserAlt, FaSignOutAlt, FaPlusCircle } from 'react-icons/fa';

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); // For mobile menu toggle

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
      className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-6xl rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20"
    >
      <div className="flex items-center justify-between px-6 py-4 text-white">

        {/* Logo */}
        <Link href="/" className="text-2xl font-bold tracking-wide text-white">
          Venue<span className="text-pink-400">X</span>
        </Link>

        {/* Desktop & Tablet Menu */}
        <div className="hidden md:flex gap-6 text-lg">
          <Link href="/events" className="hover:text-pink-400 transition-all">
            Explore
          </Link>

          {user?.roles && (user.roles.includes("organizer") || user.roles.includes("admin")) && (
            <Link href="/organizer/dashboard" className="hover:text-pink-400 transition-all">
              Host
            </Link>
          )}

          <Link href="/about" className="hover:text-pink-400 transition-all">
            About
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-white"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-8 h-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        {/* User Auth & Mobile Menu */}
        {!user ? (
          <Link href="/login">
            <Button className="bg-pink-500 hover:bg-pink-600 rounded-full px-6 py-2">
              Get Started
            </Button>
          </Link>
        ) : (
          <div className="relative">
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 text-white hover:bg-white/20"
            >
              <FaUserAlt className="text-xl" />
              {user.name}
            </button>

            {open && (
              <div className="absolute right-0 mt-3 w-48 rounded-xl bg-black/80 border border-white/20 shadow-lg">
                {user.roles && user.roles.includes("attendee") && !user.roles.includes("organizer") && (
                  <Link href="/organizer/request" className="block px-4 py-3 text-white hover:bg-white/10 transition-all">
                    <FaPlusCircle className="mr-2 inline" /> Become Organizer
                  </Link>
                )}

                {user.roles && user.roles.includes("admin") && (
                  <Link href="/admin" className="block px-4 py-3 text-white hover:bg-white/10 transition-all">
                    Admin Panel
                  </Link>
                )}

                <button
                  onClick={logout}
                  className="w-full text-left px-4 py-3 text-red-400 hover:bg-white/10 transition-all"
                >
                  <FaSignOutAlt className="mr-2 inline" /> Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-black/80 p-6 rounded-b-2xl">
          <Link href="/events" className="block px-4 py-2 text-white hover:bg-white/10 transition-all">
            Explore
          </Link>

          {user?.roles && (user.roles.includes("organizer") || user.roles.includes("admin")) && (
            <Link href="/organizer/dashboard" className="block px-4 py-2 text-white hover:bg-white/10 transition-all">
              Host
            </Link>
          )}

          <Link href="/about" className="block px-4 py-2 text-white hover:bg-white/10 transition-all">
            About
          </Link>

          
        </div>
      )}
    </motion.nav>
  );
}
