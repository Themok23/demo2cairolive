'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Menu, X, Search, Plus } from 'lucide-react';
import Button from '../ui/Button';

const LanguageSwitcher = dynamic(() => import('../ui/LanguageSwitcher'), { ssr: false });

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-surface/80 backdrop-blur-md border-b border-muted">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-display text-primary">demo2</span>
            <span className="text-2xl font-display text-secondary">cairolive</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/explore" className="relative text-sm font-semibold text-text-primary hover:text-primary transition-colors group">
              Explore
              <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-primary transition-all group-hover:w-full" />
            </Link>
            <Link href="/rewards" className="relative text-sm font-semibold text-text-primary hover:text-primary transition-colors group">
              Rewards
              <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-primary transition-all group-hover:w-full" />
            </Link>
            <Link href="/submit" className="relative text-sm font-semibold text-text-primary hover:text-primary transition-colors group">
              Submit
              <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-primary transition-all group-hover:w-full" />
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link href="/explore">
              <Button variant="ghost" size="sm">
                <Search size={18} />
              </Button>
            </Link>
            <Link href="/submit">
              <Button variant="primary" size="sm">
                <Plus size={16} className="mr-1" />
                Rate Something
              </Button>
            </Link>
            <LanguageSwitcher />
            <Link href="/auth/signin">
              <Button variant="outline" size="sm">Sign In</Button>
            </Link>
          </div>

          <button
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden border-t border-muted py-4 space-y-3">
            <Link href="/explore" className="block py-2 text-sm font-semibold text-text-primary hover:text-primary">
              Explore
            </Link>
            <Link href="/rewards" className="block py-2 text-sm font-semibold text-text-primary hover:text-primary">
              Rewards
            </Link>
            <Link href="/submit" className="block py-2 text-sm font-semibold text-text-primary hover:text-primary">
              Submit
            </Link>
            <Link href="/auth/signin" className="block py-2 text-sm font-semibold text-text-primary hover:text-primary">
              Sign In
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
