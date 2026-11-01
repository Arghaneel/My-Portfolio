"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Code2 } from "lucide-react";
import ThemeToggle from "./theme-toggle";

const navItems = [
  { label: "Home", path: "/" },
  { label: "About", path: "/about" },
  { label: "Projects", path: "/projects" },
  { label: "Achievements", path: "/achievements" },
  { label: "Dashboard", path: "/dashboard" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close the mobile menu after navigating.
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const isActive = (path: string) => (path === "/" ? pathname === "/" : pathname?.startsWith(path));

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled || isOpen ? "bg-background/80 backdrop-blur-md border-b border-border/70" : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group" aria-label="Arghaneel Das – home">
            <span className="w-9 h-9 rounded-xl border border-border bg-card flex items-center justify-center text-primary group-hover:border-primary/50 transition-colors">
              <Code2 size={18} />
            </span>
            <span className="hidden sm:inline md:hidden lg:inline font-semibold tracking-tight text-foreground">Arghaneel</span>
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center gap-0.5 lg:gap-1" aria-label="Main">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                aria-current={isActive(item.path) ? "page" : undefined}
                className={`px-2.5 lg:px-3.5 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
                  isActive(item.path) ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/contact"
              className="hidden md:inline-flex items-center whitespace-nowrap px-4 py-2 rounded-full bg-foreground text-background text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              Contact Me
            </Link>
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              aria-label="Toggle menu"
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile navigation */}
      {isOpen && (
        <div className="md:hidden border-t border-border/70 bg-background/95 backdrop-blur-md">
          <nav className="space-y-1 px-4 py-3 pb-5" aria-label="Mobile">
            {[...navItems, { label: "Contact", path: "/contact" }].map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`block px-4 py-2.5 rounded-xl text-base font-medium transition-colors ${
                  isActive(item.path) ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
