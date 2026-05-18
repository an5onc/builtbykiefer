import { getTrimmedValue, isIsoDate } from "./form-utils";
import type {
  FileVisibility,
  ProjectVendorAssignmentStatus,
  VendorCompanyType,
  VendorStatus,
} from "./types";

export interface VendorCreateInput {
  name: string;
  companyType: VendorCompanyType;
  trade: string;
  email: string;
  phone: string;
  status: VendorStatus;
  portalAccess: boolean;
  notes: string;
}

export interface ProjectVendorAssignmentCreateInput {
  vendorId: string;
  scope: string;
  startDate: string;
  endDate: string;
  status: ProjectVendorAssignmentStatus;
  visibility: FileVisibility;
}

export type VendorCreateParseResult =
  | { ok: true; data: VendorCreateInput }
  | { ok: false; reason: string };

export type ProjectVendorAssignmentCreateParseResult =
  | { ok: true; data: ProjectVendorAssignmentCreateInput }
  | { ok: false; reason: string };

export const vendorCompanyTypeOptions: { value: VendorCompanyType; label: string }[] = [
  { value: "subcontractor", label: "Subcontractor" },
  { value: "vendor", label: "Vendor" },
];

export const vendorStatusOptions: { value: VendorStatus; label: string }[] = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

export const projectVendorAssignmentStatusOptions: {
  value: ProjectVendorAssignmentStatus;
  label: string;
}[] = [
  { value: "invited", label: "Invited" },
  { value: "scheduled", label: "Scheduled" },
  { value: "active", label: "Active" },
  { value: "complete", label: "Complete" },
];

export const projectVendorAssignmentVisibilityOptions: { value: FileVisibility; label: string }[] = [
  { value: "internal", label: "Internal" },
  { value: "customer", label: "Customer" },
];

const companyTypeValues = new Set<VendorCompanyType>(vendorCompanyTypeOptions.map((option) => option.value));
const vendorStatusValues = new Set<VendorStatus>(vendorStatusOptions.map((option) => option.value));
const assignmentStatusValues = new Set<ProjectVendorAssignmentStatus>(
  projectVendorAssignmentStatusOptions.map((option) => option.value),
);
const assignmentVisibilityValues = new Set<FileVisibility>(
  projectVendorAssignmentVisibilityOptions.map((option) => option.value),
);

export function parseVendorCreateFormData(formData: FormData): VendorCreateParseResult {
  const name = getTrimmedValue(formData, "name");
  const companyType = getTrimmedValue(formData, "companyType");
  const trade = getTrimmedValue(formData, "trade");
  const email = getTrimmedValue(formData, "email");
  const phone = getTrimmedValue(formData, "phone");
  const status = getTrimmedValue(formData, "status");
  const portalAccess = formData.get("portalAccess") === "on";
  const notes = getTrimmedValue(formData, "notes");

  if (!name) {
    return { ok: false, reason: "Vendor or subcontractor name is required." };
  }

  if (!companyTypeValues.has(companyType as VendorCompanyType)) {
    return { ok: false, reason: "Choose vendor or subcontractor." };
  }

  if (!trade) {
    return { ok: false, reason: "Trade or service is required." };
  }

  if (!email) {
    return { ok: false, reason: "Vendor email is required." };
  }

  if (!vendorStatusValues.has(status as VendorStatus)) {
    return { ok: false, reason: "Choose a valid vendor status." };
  }

  return {
    ok: true,
    data: {
      name,
      companyType: companyType as VendorCompanyType,
      trade,
      email,
      phone,
      status: status as VendorStatus,
      portalAccess,
      notes,
    },
  };
}

export function parseProjectVendorAssignmentCreateFormData(
  formData: FormData,
): ProjectVendorAssignmentCreateParseResult {
  const vendorId = getTrimmedValue(formData, "vendorId");
  const scope = getTrimmedValue(formData, "scope");
  const startDate = getTrimmedValue(formData, "startDate");
  const endDate = getTrimmedValue(formData, "endDate");
  const status = getTrimmedValue(formData, "status");
  const visibility = getTrimmedValue(formData, "visibility");

  if (!vendorId) {
    return { ok: false, reason: "Choose a vendor or subcontractor." };
  }

  if (!scope) {
    return { ok: false, reason: "Assignment scope is required." };
  }

  if (!startDate || !isIsoDate(startDate)) {
    return { ok: false, reason: "Use a valid start date." };
  }

  if (endDate && !isIsoDate(endDate)) {
    return { ok: false, reason: "Use a valid end date." };
  }

  if (!assignmentStatusValues.has(status as ProjectVendorAssignmentStatus)) {
    return { ok: false, reason: "Choose a valid assignment status." };
  }

  if (!assignmentVisibilityValues.has(visibility as FileVisibility)) {
    return { ok: false, reason: "Choose a valid assignment visibility." };
  }

  return {
    ok: true,
    data: {
      vendorId,
      scope,
      startDate,
      endDate,
      status: status as ProjectVendorAssignmentStatus,
      visibility: visibility as FileVisibility,
    },
  };
}
