import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-[#151515] py-12" role="contentinfo">
      <div className="max-w-7xl mx-auto px-6">
        {/* Partner acknowledgment */}
        <div className="flex items-center justify-center gap-8 mb-8 border-b border-white/10 pb-8">
          <span className="text-sm tracking-wider text-white/45">In partnership with</span>
          <a
            href="https://epsbuildings.com"
            target="_blank"
            rel="noopener noreferrer"
            className="relative h-20 w-56 opacity-85 transition-opacity hover:opacity-100"
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
              KIEFER BUILT CONTRACTING
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
              className="inline-flex size-9 items-center justify-center rounded-full border border-white/10 text-white/65 transition-colors hover:border-[#c9281c] hover:bg-[#c9281c] hover:text-white"
              aria-label="Kiefer Built Contracting on Facebook"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="size-4 fill-current"
              >
                <path d="M14.25 8.25h2.25V4.7c-.39-.05-1.73-.17-3.29-.17-3.25 0-5.48 1.99-5.48 5.64v3.08H4.5v3.97h3.23v10.21h4.02V17.22h3.15l.6-3.97h-3.75v-2.69c0-1.15.31-2.31 2.5-2.31Z" />
              </svg>
            </a>
            <a
              href="https://www.instagram.com/kieferbuiltco"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex size-9 items-center justify-center rounded-full border border-white/10 text-white/65 transition-colors hover:border-[#c9281c] hover:bg-[#c9281c] hover:text-white"
              aria-label="Kiefer Built Contracting on Instagram"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="size-4 fill-current"
              >
                <path d="M12 7.34A4.66 4.66 0 1 0 12 16.66 4.66 4.66 0 0 0 12 7.34Zm0 7.7a3.04 3.04 0 1 1 0-6.08 3.04 3.04 0 0 1 0 6.08Z" />
                <path d="M17.9 7.15a1.09 1.09 0 1 0 0-2.18 1.09 1.09 0 0 0 0 2.18Z" />
                <path d="M16.94 2.5H7.06A4.56 4.56 0 0 0 2.5 7.06v9.88a4.56 4.56 0 0 0 4.56 4.56h9.88a4.56 4.56 0 0 0 4.56-4.56V7.06a4.56 4.56 0 0 0-4.56-4.56Zm2.94 14.44a2.94 2.94 0 0 1-2.94 2.94H7.06a2.94 2.94 0 0 1-2.94-2.94V7.06a2.94 2.94 0 0 1 2.94-2.94h9.88a2.94 2.94 0 0 1 2.94 2.94v9.88Z" />
              </svg>
            </a>
            <a
              href="https://kbuiltco.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-white/55 transition-colors hover:text-[#c9281c]"
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
                className="text-[#c9281c]/80 transition-colors hover:text-[#c9281c]"
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
