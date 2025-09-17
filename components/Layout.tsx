import React, { ReactNode } from 'react';
import Link from 'next/link';

const Navbar = () => (
  <nav className="bg-blue-600 text-white p-4">
    <div className="container mx-auto flex justify-between items-center">
      <span className="font-bold text-xl">Kanji Study</span>
      <div>
        <Link href="/" className="mr-4 hover:underline">Home</Link>
        <Link href="/about" className="hover:underline">About</Link>
      </div>
    </div>
  </nav>
);

const Footer = () => (
  <footer className="bg-gray-800 text-white p-4 mt-8">
    <div className="container mx-auto text-center">
      &copy; {new Date().getFullYear()} Kanji Study. All rights reserved.
    </div>
  </footer>
);

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => (
  <div className="flex flex-col min-h-screen">
    <Navbar />
    <main className="flex-1 container mx-auto px-4 py-8">{children}</main>
    <Footer />
  </div>
);

export default Layout;
