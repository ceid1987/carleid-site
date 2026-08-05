import React from 'react';
import Link from 'next/link';

interface NavbarProps {
  currentSection: string;
}

const Navbar: React.FC<NavbarProps> = ({ currentSection }) => {
  const links = [
    { href: '#home', label: 'home' },
    { href: '#whoami', label: 'whoami' },
    { href: '#projects', label: 'projects' },
    { href: '#contact', label: 'contact' }
  ];

  return (
    <nav className="fixed mt-14 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#141418]/60 backdrop-blur-md border border-white/10 rounded-xl px-8 md:px-16 space-x-4 md:space-x-24 py-4 flex justify-center mx-auto z-50 font-mono text-sm md:text-base">
      {links.map(link => (
        <Link key={link.href} href={link.href} className="relative text-foreground hover:text-purple-500 transition-colors duration-150">
          <span className={`relative ${currentSection === link.href.slice(1) ? 'font-medium text-white' : ''}`}>
            {currentSection === link.href.slice(1) && <span className="absolute left-[-12px] text-purple-500">{`>`}</span>}
            {link.label}
          </span>
        </Link>
      ))}
    </nav>
  );
};

export default Navbar;
