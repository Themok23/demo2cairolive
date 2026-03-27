'use client';

import Link from 'next/link';
import { Mail, Linkedin, Twitter } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary text-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl font-display text-primary">demo2</span>
              <span className="text-2xl font-display text-white">cairolive</span>
            </div>
            <p className="text-sm text-white/70 leading-relaxed">
              Rate anything in Egypt. A community-driven platform to discover, review, and rate the best of Egypt.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider text-white/50 mb-5">Explore</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/explore/restaurants-food" className="text-white/70 hover:text-primary transition-colors duration-200">Restaurants</Link></li>
              <li><Link href="/explore/skincare-cosmetics" className="text-white/70 hover:text-primary transition-colors duration-200">Skincare</Link></li>
              <li><Link href="/explore/cafes-coffee" className="text-white/70 hover:text-primary transition-colors duration-200">Cafes</Link></li>
              <li><Link href="/explore/gyms-fitness" className="text-white/70 hover:text-primary transition-colors duration-200">Gyms</Link></li>
              <li><Link href="/explore/beaches-resorts" className="text-white/70 hover:text-primary transition-colors duration-200">Beaches</Link></li>
            </ul>
          </div>

          {/* Platform */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider text-white/50 mb-5">Platform</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/rewards" className="text-white/70 hover:text-primary transition-colors duration-200">Rewards</Link></li>
              <li><Link href="/leaderboard" className="text-white/70 hover:text-primary transition-colors duration-200">Leaderboard</Link></li>
              <li><Link href="/auth/signup" className="text-white/70 hover:text-primary transition-colors duration-200">Create Account</Link></li>
              <li><Link href="/auth/signin" className="text-white/70 hover:text-primary transition-colors duration-200">Sign In</Link></li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider text-white/50 mb-5">Connect</h4>
            <div className="flex gap-4">
              <a
                href="https://twitter.com/demo2cairolive"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 text-white hover:bg-primary hover:text-white transition-colors duration-200"
                aria-label="Twitter"
              >
                <Twitter size={18} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 text-white hover:bg-primary hover:text-white transition-colors duration-200"
                aria-label="LinkedIn"
              >
                <Linkedin size={18} />
              </a>
              <a
                href="mailto:hello@demo2cairolive.com"
                className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 text-white hover:bg-primary hover:text-white transition-colors duration-200"
                aria-label="Email"
              >
                <Mail size={18} />
              </a>
            </div>
          </div>
        </div>

        {/* Divider + Copyright */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/50">
          <p>&copy; {currentYear} demo2cairolive. All rights reserved.</p>
          <p>
            by{' '}
            <a
              href="https://themok.company"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary font-semibold hover:text-primary/80 transition-colors"
            >
              The Mok Company
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
