import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-charcoal-900 py-12" role="contentinfo">
      <div className="max-w-7xl mx-auto px-6">
        {/* Partner acknowledgment */}
        <div className="flex items-center justify-center gap-6 mb-8 pb-8 border-b border-charcoal-700/50">
          <span className="text-charcoal-400 text-sm tracking-wider">In partnership with</span>
          <a
            href="https://epsbuildings.com"
            target="_blank"
            rel="noopener noreferrer"
            className="relative w-40 h-14 opacity-80 hover:opacity-100 transition-opacity"
          >
            <Image
              src="/images/eps-buildings-logo.webp"
              alt="EPS Buildings"
              fill
              className="object-contain"
            />
          </a>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-sand-100 font-bold tracking-wider">
              BUILT BY KIEFER
            </p>
            <p className="text-charcoal-300 text-xs tracking-wider mt-1">
              Custom Homes &middot; Northern Colorado
            </p>
          </div>
          <nav className="flex gap-6" aria-label="Social links and external sites">
            <a
              href="https://www.facebook.com/KieferBuiltContracting"
              target="_blank"
              rel="noopener noreferrer"
              className="text-charcoal-300 hover:text-walnut-400 transition-colors text-sm"
              aria-label="Kiefer Built Contracting on Facebook"
            >
              Facebook
            </a>
            <a
              href="https://www.instagram.com/kieferbuiltco"
              target="_blank"
              rel="noopener noreferrer"
              className="text-charcoal-300 hover:text-walnut-400 transition-colors text-sm"
              aria-label="Kiefer Built Contracting on Instagram"
            >
              Instagram
            </a>
            <a
              href="https://kbuiltco.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-charcoal-300 hover:text-walnut-400 transition-colors text-sm"
              aria-label="Visit kbuiltco.com"
            >
              kbuiltco.com
            </a>
          </nav>
          <div className="text-right">
            <p className="text-charcoal-400 text-xs">
              &copy; {new Date().getFullYear()} Kiefer Built Contracting. All
              rights reserved.
            </p>
            <p className="text-charcoal-500 text-xs mt-1">
              Created and Powered by{" "}
              <a
                href="https://nexgenstudio.io"
                target="_blank"
                rel="noopener noreferrer"
                className="text-walnut-400/70 hover:text-walnut-400 transition-colors"
              >
                Nexgen Studio
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
