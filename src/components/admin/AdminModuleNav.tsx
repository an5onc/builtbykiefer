"use client";

import Link from "next/link";
import {
  Calculator,
  CalendarDays,
  ClipboardList,
  FileImage,
  FileText,
  Home,
  Info,
  Landmark,
  ListChecks,
  Mail,
  MapPin,
  MessageSquare,
  Plus,
  ReceiptText,
  ShieldCheck,
  SquareStack,
  Tag,
  Users,
  Video,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { adminModuleMenus } from "@/lib/admin/navigation";

const menuIcons = {
  "Lead Opportunities": Users,
  "Lead Activities": MessageSquare,
  "Lead Proposals": FileText,
  "Lead Activity Calendar": CalendarDays,
  "Lead Map": MapPin,
  Summary: ClipboardList,
  "Job Info": Info,
  "Job Price Summary": Tag,
  "Jobs List": ListChecks,
  "Jobs Map": MapPin,
  "New Job From Scratch": Plus,
  "New Job From Template": SquareStack,
  Schedule: CalendarDays,
  "Daily Logs": ClipboardList,
  Tasks: ListChecks,
  "Change Orders": ListChecks,
  Selections: Tag,
  Warranties: ShieldCheck,
  "Time Clock": CalendarDays,
  "Plans and Specs": FileText,
  "Client Updates": MessageSquare,
  Documents: FileText,
  Photos: FileImage,
  Videos: Video,
  Comments: MessageSquare,
  Messages: Mail,
  RFIs: Info,
  "Notification History": MessageSquare,
  Surveys: ClipboardList,
  Bids: FileText,
  Estimate: Calculator,
  "Purchase Orders": ReceiptText,
  Bills: ReceiptText,
  "Job Costing Budget": Landmark,
  "Cost Inbox": ReceiptText,
  Invoices: ReceiptText,
  "Online Payment Report": Landmark,
  "Command Center": Home,
  "Job Reports": FileText,
  "Time Reports": CalendarDays,
  "Financial Reports": Landmark,
  "Change Order Report": ListChecks,
  "Public Site": Home,
};

export default function AdminModuleNav() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpenMenu(null);
      }
    }

    function closeOnOutsideClick(event: MouseEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenMenu(null);
      }
    }

    document.addEventListener("keydown", closeOnEscape);
    document.addEventListener("mousedown", closeOnOutsideClick);

    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.removeEventListener("mousedown", closeOnOutsideClick);
    };
  }, []);

  return (
    <nav ref={navRef} className="flex h-full items-center gap-1" aria-label="Admin modules">
      {adminModuleMenus.map((menu) => {
        const isOpen = openMenu === menu.label;

        return (
          <div key={menu.label} className="relative h-full">
            <button
              type="button"
              aria-expanded={isOpen}
              aria-haspopup="menu"
              onClick={() => setOpenMenu(isOpen ? null : menu.label)}
              className={`flex h-full items-center rounded-md px-3 text-sm font-semibold transition ${
                isOpen
                  ? "bg-white/10 text-white"
                  : "text-white/82 hover:bg-white/10 hover:text-white"
              }`}
            >
              {menu.label}
            </button>

            {isOpen ? (
              <div
                role="menu"
                className="absolute left-0 top-full z-40 min-w-56 rounded-b-lg border border-black/10 bg-white py-2 text-[#171717] shadow-xl ring-1 ring-black/5"
              >
                {menu.items.map((item) => {
                  const Icon = menuIcons[item.label as keyof typeof menuIcons] ?? FileText;
                  const itemClassName =
                    "flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm font-semibold transition";

                  if (item.disabled || !item.href) {
                    return (
                      <span
                        key={item.label}
                        className={`${itemClassName} cursor-not-allowed text-[#8a8176] opacity-60`}
                        aria-disabled="true"
                        role="menuitem"
                      >
                        <Icon className="size-5 shrink-0" />
                        <span>{item.label}</span>
                        {item.badge ? (
                          <span className="ml-auto rounded-full bg-[#e5f2ff] px-2 py-0.5 text-xs font-bold text-blue-700">
                            {item.badge}
                          </span>
                        ) : null}
                      </span>
                    );
                  }

                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      role="menuitem"
                      onClick={() => setOpenMenu(null)}
                      className={`${itemClassName} hover:bg-[#f4efe7] hover:text-[#b92516]`}
                    >
                      <Icon className="size-5 shrink-0" />
                      <span>{item.label}</span>
                      {item.badge ? (
                        <span className="ml-auto rounded-full bg-[#e5f2ff] px-2 py-0.5 text-xs font-bold text-blue-700">
                          {item.badge}
                        </span>
                      ) : null}
                    </Link>
                  );
                })}
              </div>
            ) : null}
          </div>
        );
      })}
    </nav>
  );
}
