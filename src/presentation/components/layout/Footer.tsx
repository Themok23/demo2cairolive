import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-muted bg-secondary text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl font-display text-primary">demo2</span>
              <span className="text-xl font-display text-white">cairolive</span>
            </div>
            <p className="text-sm text-white/60 max-w-xs">
              Rate anything in Egypt. A community-driven platform to discover, review, and rate the best of Egypt.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider text-white/40 mb-4">Explore</h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li><Link href="/explore/restaurants-food" className="hover:text-primary transition-colors">Restaurants</Link></li>
              <li><Link href="/explore/skincare-cosmetics" className="hover:text-primary transition-colors">Skincare</Link></li>
              <li><Link href="/explore/cafes-coffee" className="hover:text-primary transition-colors">Cafes</Link></li>
              <li><Link href="/explore/gyms-fitness" className="hover:text-primary transition-colors">Gyms</Link></li>
              <li><Link href="/explore/beaches-resorts" className="hover:text-primary transition-colors">Beaches</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider text-white/40 mb-4">Platform</h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li><Link href="/submit" className="hover:text-primary transition-colors">Add an Item</Link></li>
              <li><Link href="/auth/signup" className="hover:text-primary transition-colors">Create Account</Link></li>
              <li><Link href="/auth/signin" className="hover:text-primary transition-colors">Sign In</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-white/10 text-center text-xs text-white/40">
          Built with care in Cairo. demo2cairolive 2026.
        </div>
      </div>
    </footer>
  );
}
