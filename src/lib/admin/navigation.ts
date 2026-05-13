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
      { label: "Schedule", href: "/admin" },
      { label: "Daily Logs", href: "/admin/projects" },
      { label: "Tasks", disabled: true, badge: "New" },
      { label: "Change Orders", href: "/admin/change-orders" },
      { label: "Selections", disabled: true },
      { label: "Warranties", disabled: true },
      { label: "Time Clock", href: "/admin/time" },
      { label: "Plans and Specs", href: "/admin/projects" },
      { label: "Client Updates", href: "/admin" },
    ],
  },
  {
    label: "Files",
    items: [
      { label: "Documents", href: "/admin/projects" },
      { label: "Photos", href: "/admin/projects" },
      { label: "Videos", disabled: true },
    ],
  },
  {
    label: "Messaging",
    items: [
      { label: "Comments", disabled: true },
      { label: "Messages", disabled: true },
      { label: "RFIs", disabled: true },
      { label: "Notification History", disabled: true },
      { label: "Surveys", disabled: true },
    ],
  },
  {
    label: "Financial",
    items: [
      { label: "Bids", href: "/admin/proposals" },
      { label: "Estimate", href: "/estimate" },
      { label: "Purchase Orders", disabled: true },
      { label: "Bills", disabled: true },
      { label: "Job Costing Budget", href: "/admin/invoices" },
      { label: "Cost Inbox", disabled: true },
      { label: "Invoices", href: "/admin/invoices" },
      { label: "Online Payment Report", disabled: true },
    ],
  },
  {
    label: "Reports",
    items: [
      { label: "Command Center", href: "/admin" },
      { label: "Job Reports", href: "/admin/projects" },
      { label: "Time Reports", href: "/admin/time" },
      { label: "Financial Reports", href: "/admin/invoices" },
      { label: "Change Order Report", href: "/admin/change-orders" },
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
