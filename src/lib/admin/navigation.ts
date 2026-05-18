export interface AdminModuleMenuItem {
  label: string;
  href?: string;
  disabled?: boolean;
  badge?: string;
}

export interface AdminModuleMenu {
  label: string;
  items: AdminModuleMenuItem[];
}

export const adminModuleMenus: AdminModuleMenu[] = [
  {
    label: "Sales",
    items: [
      { label: "Lead Opportunities", href: "/admin/leads" },
      { label: "Lead Activities", href: "/admin/leads" },
      { label: "Lead Proposals", href: "/admin/proposals" },
      { label: "Lead Activity Calendar", href: "/admin/leads" },
      { label: "Lead Map", disabled: true },
    ],
  },
  {
    label: "Jobs",
    items: [
      { label: "Summary", href: "/admin" },
      { label: "Job Info", href: "/admin/projects" },
      { label: "Job Price Summary", href: "/admin/invoices" },
      { label: "Jobs List", href: "/admin/projects" },
      { label: "Jobs Map", disabled: true },
      { label: "New Job From Scratch", href: "/admin/projects" },
      { label: "New Job From Template", disabled: true },
    ],
  },
  {
    label: "Project Management",
    items: [
      { label: "Schedule", href: "/admin/schedule" },
      { label: "Daily Logs", href: "/admin/daily-logs", badge: "New" },
      { label: "Tasks", href: "/admin/tasks", badge: "New" },
      { label: "Change Orders", href: "/admin/change-orders" },
      { label: "Selections", href: "/admin/selections", badge: "New" },
      { label: "Warranties", href: "/admin/warranty", badge: "New" },
      { label: "Trade Partners", href: "/admin/vendors", badge: "New" },
      { label: "Time Clock", href: "/admin/time" },
      { label: "Plans and Specs", href: "/admin/projects" },
      { label: "Client Updates", href: "/admin" },
    ],
  },
  {
    label: "Files",
    items: [
      { label: "Documents", href: "/admin/projects" },
      { label: "Photos", href: "/admin/photos", badge: "New" },
      { label: "Videos", disabled: true },
    ],
  },
  {
    label: "Messaging",
    items: [
      { label: "Comments", href: "/admin/comments", badge: "New" },
      { label: "Messages", disabled: true },
      { label: "RFIs", href: "/admin/rfis", badge: "New" },
      { label: "Notification History", disabled: true },
      { label: "Surveys", disabled: true },
    ],
  },
  {
    label: "Financial",
    items: [
      { label: "Bids", href: "/admin/proposals" },
      { label: "Estimate", disabled: true, badge: "Internal" },
      { label: "Purchase Orders", href: "/admin/purchase-orders", badge: "New" },
      { label: "Bills", href: "/admin/bills", badge: "New" },
      { label: "Job Costing Budget", href: "/admin/reports", badge: "New" },
      { label: "Cost Inbox", disabled: true },
      { label: "Invoices", href: "/admin/invoices" },
      { label: "Finance Tools", href: "/admin/finance-tools", badge: "New" },
      { label: "Online Payment Report", disabled: true },
    ],
  },
  {
    label: "Reports",
    items: [
      { label: "Command Center", href: "/admin" },
      { label: "Job Reports", href: "/admin/reports", badge: "New" },
      { label: "Time Reports", href: "/admin/time" },
      { label: "Task Report", href: "/admin/tasks" },
      { label: "Financial Reports", href: "/admin/reports", badge: "New" },
      { label: "Change Order Report", href: "/admin/change-orders" },
      { label: "Finance Tools", href: "/admin/finance-tools", badge: "New" },
      { label: "Public Site", href: "/" },
    ],
  },
];

export function getLiveAdminNavigationHrefs() {
  return Array.from(
    new Set(
      adminModuleMenus
        .flatMap((menu) => menu.items)
        .map((item) => item.href)
        .filter((href): href is string => Boolean(href)),
    ),
  );
}
