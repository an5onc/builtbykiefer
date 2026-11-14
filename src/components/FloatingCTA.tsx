"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

export default function FloatingCTA() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Keep the active quote form and careers application free of the project shortcut.
    const handleScroll = () => {
      const contact = document.getElementById("contact")?.getBoundingClientRect();
      const contactInView = contact && contact.top < window.innerHeight && contact.bottom > 0;
      setVisible(pathname !== "/contact" && pathname !== "/careers" && window.scrollY > 400 && !contactInView);
    };
    const frame = window.requestAnimationFrame(handleScroll);
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [pathname]);

  if (pathname === "/contact" || pathname === "/careers") return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.a
          href="/#contact"
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-md bg-[#c9281c] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-black/20 transition-colors hover:bg-[#a91f16] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c9281c] focus-visible:ring-offset-2"
          aria-label="Get a free quote from Kiefer Built"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          Get a Free Quote
        </motion.a>
      )}
    </AnimatePresence>
  );
}
