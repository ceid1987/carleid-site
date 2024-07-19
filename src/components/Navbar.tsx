// src/components/Navbar.tsx
"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navbar: React.FC = () => {
  const pathname = usePathname();
  const links = [
    { href: '/', label: 'home' },
    { href: '/about', label: 'about' },
    { href: '/projects', label: 'projects' },    
    { href: '/contact', label: 'contact' }
  ];

  return (
    <nav className="bg-black rounded-full px-6 md:px-16 space-x-8 md:space-x-16 py-4 flex justify-center mt-6 mx-auto">
      {links.map((link) => (
        <Link key={link.href} href={link.href} className="relative text-white hover:text-purple-500">
          <span
            className={`relative text-white hover:text-purple-500  ${
              pathname === link.href ? 'font-bold' : ''
            }`}
          >
            {pathname === link.href && <span className="absolute left-[-10px] text-purple-500">{`> `}</span>}
            {link.label}
          </span>
        </Link>
      ))}
    </nav>
  );
};

export default Navbar;
