import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-bg-subtle border-t border-border mt-auto">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link
              href="/"
              className="flex items-center gap-2 text-xl font-bold text-brand"
            >
              <svg
                width="24"
                height="24"
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
            <p className="mt-3 text-sm text-text-muted leading-relaxed">
              Moderný portál nehnuteľností na Slovensku. Nájdite svoj vysnívaný
              domov jednoducho a rýchlo.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold text-text mb-3">
              Nehnuteľnosti
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/nehnutelnosti?transaction=sale"
                  className="text-sm text-text-muted hover:text-brand transition-colors"
                >
                  Predaj
                </Link>
              </li>
              <li>
                <Link
                  href="/nehnutelnosti?transaction=rent"
                  className="text-sm text-text-muted hover:text-brand transition-colors"
                >
                  Prenájom
                </Link>
              </li>
              <li>
                <Link
                  href="/nehnutelnosti?type=apartment"
                  className="text-sm text-text-muted hover:text-brand transition-colors"
                >
                  Byty
                </Link>
              </li>
              <li>
                <Link
                  href="/nehnutelnosti?type=house"
                  className="text-sm text-text-muted hover:text-brand transition-colors"
                >
                  Domy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-text mb-3">Pre maklérov</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/registracia"
                  className="text-sm text-text-muted hover:text-brand transition-colors"
                >
                  Registrácia
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="text-sm text-text-muted hover:text-brand transition-colors"
                >
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-text mb-3">Informácie</h3>
            <ul className="space-y-2">
              <li>
                <span className="text-sm text-text-muted">
                  kontakt@domio.sk
                </span>
              </li>
              <li>
                <span className="text-sm text-text-muted">Bratislava, SK</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-text-faint">
            &copy; {new Date().getFullYear()} Domio. Všetky práva vyhradené.
          </p>
          <p className="text-sm text-text-faint">
            Vytvorené na Slovensku
          </p>
        </div>
      </div>
    </footer>
  );
}
