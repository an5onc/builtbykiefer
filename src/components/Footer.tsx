export default function Footer() {
  return (
    <footer className="bg-charcoal-900 py-12" role="contentinfo">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-sand-100 font-bold tracking-wider">
              BUILT BY KIEFER
            </p>
            <p className="text-charcoal-300 text-xs tracking-wider mt-1">
              Custom Homes &middot; Northern Colorado
            </p>
          </div>
          <div className="flex gap-6">
            <a
              href="https://www.facebook.com/KieferBuiltContracting"
              target="_blank"
              rel="noopener noreferrer"
              className="text-charcoal-300 hover:text-walnut-400 transition-colors text-sm"
            >
              Facebook
            </a>
            <a
              href="https://www.instagram.com/kieferbuiltcontracting"
              target="_blank"
              rel="noopener noreferrer"
              className="text-charcoal-300 hover:text-walnut-400 transition-colors text-sm"
            >
              Instagram
            </a>
            <a
              href="https://kbuiltco.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-charcoal-300 hover:text-walnut-400 transition-colors text-sm"
            >
              kbuiltco.com
            </a>
          </div>
          <p className="text-charcoal-400 text-xs">
            &copy; {new Date().getFullYear()} Kiefer Built Contracting. All
            rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
