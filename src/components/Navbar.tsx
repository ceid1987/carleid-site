import React from 'react';
import Link from 'next/link';

interface NavbarProps {
  currentSection: string;
}

const Navbar: React.FC<NavbarProps> = ({ currentSection }) => {
  const links = [
    { href: '#home', label: 'home' },
    { href: '#about', label: 'about' },
    { href: '#projects', label: 'projects' },
    { href: '#contact', label: 'contact' }
  ];

  return (
    <nav className="fixed mt-14 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black rounded-full px-6 md:px-16 space-x-8 md:space-x-18 py-4 flex justify-center mx-auto z-50">
      {links.map(link => (
        <Link key={link.href} href={link.href} className="relative text-white hover:text-purple-500">
          <span className={`relative text-white hover:text-purple-500 ${currentSection === link.href.slice(1) ? 'font-bold' : ''}`}>
            {currentSection === link.href.slice(1) && <span className="absolute left-[-10px] text-purple-500">{`> `}</span>}
            {link.label}
          </span>
        </Link>
      ))}
    </nav>
  );
};

export default Navbar;
