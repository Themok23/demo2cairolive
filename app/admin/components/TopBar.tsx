'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Bell,
  Menu,
  ChevronDown,
  LogOut,
} from 'lucide-react';

interface TopBarProps {
  onMenuToggle: () => void;
}

export default function TopBar({ onMenuToggle }: TopBarProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    try {
      // Delete the admin auth cookie
      document.cookie = 'cairo-admin-auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

      // Redirect to password gate
      window.location.href = '/admin';
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <div className="h-16 bg-[#0F0F1A] border-b border-white/5 flex items-center justify-between px-6">
      {/* Left section: Menu toggle + Search */}
      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={onMenuToggle}
          className="md:hidden p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center bg-white/5 rounded-lg border border-white/10 px-3 py-2 flex-1 max-w-xs">
          <Search className="w-4 h-4 text-white/40" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent border-none outline-none px-2 py-1 text-sm text-white placeholder:text-white/40 w-full"
          />
        </div>
      </div>

      {/* Right section: Notifications + Profile */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button
          className="relative p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-[#E8572A] rounded-full" />
        </button>

        {/* Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 px-3 py-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-[#E8572A] to-[#FF6B42] rounded-lg flex items-center justify-center">
              <span className="text-sm font-bold text-white">A</span>
            </div>
            <div className="hidden sm:flex flex-col items-start">
              <span className="text-sm font-medium text-white">Admin</span>
              <span className="text-xs text-white/40">Administrator</span>
            </div>
            <ChevronDown className="w-4 h-4 text-white/40" />
          </button>

          {/* Dropdown Menu */}
          {isProfileOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-[#1A1A35] border border-white/10 rounded-lg shadow-xl overflow-hidden z-50">
              <div className="px-4 py-3 border-b border-white/5">
                <p className="text-sm font-medium text-white">Admin User</p>
                <p className="text-xs text-white/40">admin@cairolive.com</p>
              </div>

              <div className="py-2">
                <button className="w-full px-4 py-2 text-sm text-white/80 hover:text-white hover:bg-white/5 transition-colors text-left">
                  Profile Settings
                </button>
                <button className="w-full px-4 py-2 text-sm text-white/80 hover:text-white hover:bg-white/5 transition-colors text-left">
                  Preferences
                </button>
              </div>

              <div className="border-t border-white/5 p-2">
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded transition-colors flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
