'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  MessageSquare,
  Users,
  FolderOpen,
  Trophy,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const navItems = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/items', label: 'Items', icon: Package },
  { href: '/admin/reviews', label: 'Reviews', icon: MessageSquare },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/categories', label: 'Categories', icon: FolderOpen },
  { href: '/admin/gamification', label: 'Gamification', icon: Trophy },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Sidebar */}
      <div
        className={`hidden md:flex flex-col bg-[#0F0F1A] border-r border-white/5 transition-all duration-300 ${
          isOpen ? 'w-64' : 'w-20'
        }`}
      >
        {/* Logo section */}
        <div className="flex items-center justify-between px-6 py-6 border-b border-white/5">
          {isOpen && (
            <div>
              <h1 className="text-xl font-bold text-white">Cairo Live</h1>
              <p className="text-xs text-white/40">Admin Panel</p>
            </div>
          )}
          <button
            onClick={onToggle}
            className="p-1 hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Toggle sidebar"
          >
            {isOpen ? (
              <ChevronLeft className="w-5 h-5 text-white/60" />
            ) : (
              <ChevronRight className="w-5 h-5 text-white/60" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? 'bg-[#E8572A] text-white'
                      : 'text-white/60 hover:bg-white/10 hover:text-white'
                  }`}
                  title={!isOpen ? item.label : undefined}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {isOpen && <span className="text-sm font-medium">{item.label}</span>}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Footer branding */}
        <div className="px-6 py-4 border-t border-white/5">
          {isOpen ? (
            <p className="text-xs text-white/40">by The Mok Company</p>
          ) : (
            <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
              <p className="text-xs text-white/60 font-bold">MOK</p>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu Icon (shown when sidebar closed on mobile) */}
      <div className="md:hidden flex items-center">
        <button
          onClick={onToggle}
          className="p-2 text-white/60 hover:text-white"
          aria-label="Toggle menu"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/50" onClick={onToggle} />
      )}

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden fixed left-0 top-0 z-50 h-full w-64 bg-[#0F0F1A] flex flex-col border-r border-white/5 shadow-lg">
          {/* Logo section */}
          <div className="flex items-center justify-between px-6 py-6 border-b border-white/5">
            <div>
              <h1 className="text-xl font-bold text-white">Cairo Live</h1>
              <p className="text-xs text-white/40">Admin Panel</p>
            </div>
            <button
              onClick={onToggle}
              className="p-1 hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Close menu"
            >
              <ChevronLeft className="w-5 h-5 text-white/60" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

              return (
                <Link key={item.href} href={item.href} onClick={onToggle}>
                  <div
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      isActive
                        ? 'bg-[#E8572A] text-white'
                        : 'text-white/60 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* Footer branding */}
          <div className="px-6 py-4 border-t border-white/5">
            <p className="text-xs text-white/40">by The Mok Company</p>
          </div>
        </div>
      )}
    </>
  );
}
