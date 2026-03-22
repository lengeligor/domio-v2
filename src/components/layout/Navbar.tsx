"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import type { Profile } from "@/lib/types";

export function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<Profile | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    const supabase = createClient();

    const getUser = async () => {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();
      if (authUser) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", authUser.id)
          .single();
        if (profile) setUser(profile);
      }
    };
    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_OUT") {
        setUser(null);
      } else if (session?.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();
        if (profile) setUser(profile);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    setIsProfileOpen(false);
    window.location.href = "/";
  };

  const navLinks = [
    { href: "/nehnutelnosti", label: "Nehnuteľnosti" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border">
      <nav
        className="container flex items-center justify-between h-16"
        aria-label="Hlavná navigácia"
      >
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-bold text-brand"
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 28 28"
            fill="none"
            aria-hidden="true"
          >
            <rect width="28" height="28" rx="8" fill="currentColor" />
            <path
              d="M7 14L14 8L21 14V21H17V17H11V21H7V14Z"
              fill="white"
            />
          </svg>
          Domio
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-brand",
                pathname === link.href
                  ? "text-brand"
                  : "text-text-secondary"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop actions */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-text transition-colors cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-brand-subtle flex items-center justify-center text-brand font-semibold text-sm">
                  {user.full_name?.charAt(0)?.toUpperCase() || "U"}
                </div>
                <span>{user.full_name || "Účet"}</span>
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl border border-border shadow-lg py-1 z-50">
                  {user.role === "agent" || user.role === "admin" ? (
                    <>
                      <Link
                        href="/dashboard"
                        className="block px-4 py-2 text-sm text-text-secondary hover:bg-bg-subtle hover:text-text"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        Dashboard
                      </Link>
                      <Link
                        href="/dashboard/properties/new"
                        className="block px-4 py-2 text-sm text-text-secondary hover:bg-bg-subtle hover:text-text"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        Pridať inzerát
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/oblubene"
                        className="block px-4 py-2 text-sm text-text-secondary hover:bg-bg-subtle hover:text-text"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        Obľúbené
                      </Link>
                    </>
                  )}
                  <Link
                    href="/profil"
                    className="block px-4 py-2 text-sm text-text-secondary hover:bg-bg-subtle hover:text-text"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    Profil
                  </Link>
                  <hr className="my-1 border-border" />
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-4 py-2 text-sm text-red hover:bg-red-subtle cursor-pointer"
                  >
                    Odhlásiť sa
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/prihlasenie">
                <Button variant="ghost" size="sm">
                  Prihlásiť sa
                </Button>
              </Link>
              <Link href="/registracia">
                <Button size="sm">Registrovať sa</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden p-2 text-text-secondary hover:text-text cursor-pointer"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? "Zavrieť menu" : "Otvoriť menu"}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            {isMenuOpen ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </>
            ) : (
              <>
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-border bg-white px-4 py-4 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block text-sm font-medium text-text-secondary hover:text-brand"
              onClick={() => setIsMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <hr className="border-border" />
          {user ? (
            <>
              {(user.role === "agent" || user.role === "admin") && (
                <Link
                  href="/dashboard"
                  className="block text-sm font-medium text-text-secondary hover:text-brand"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
              )}
              <Link
                href="/profil"
                className="block text-sm font-medium text-text-secondary hover:text-brand"
                onClick={() => setIsMenuOpen(false)}
              >
                Profil
              </Link>
              <button
                onClick={handleSignOut}
                className="block text-sm font-medium text-red cursor-pointer"
              >
                Odhlásiť sa
              </button>
            </>
          ) : (
            <div className="flex gap-3">
              <Link href="/prihlasenie" className="flex-1">
                <Button variant="secondary" size="sm" className="w-full">
                  Prihlásiť sa
                </Button>
              </Link>
              <Link href="/registracia" className="flex-1">
                <Button size="sm" className="w-full">
                  Registrovať sa
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
