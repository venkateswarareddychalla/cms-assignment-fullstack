"use client";

import Link from 'next/link';
import { useAppContext } from '../context/AppContext';

export default function Navigation() {
  const { pages, loading } = useAppContext();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-panel">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="font-bold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            RenewCred
          </Link>
          <nav className="flex gap-6">
            {!loading && pages.map(page => (
              <Link 
                key={page._id} 
                href={`/${page.slug}`}
                className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
              >
                {page.title}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
