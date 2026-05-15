import { getTrimmedValue } from "./form-utils";

export interface VendorRfiResponseCreateInput {
  projectId: string;
  rfiId: string;
  vendorId: string;
  assignmentId: string;
  responderName: string;
  responseBody: string;
}

export type VendorRfiResponseCreateParseResult =
  | { ok: true; data: VendorRfiResponseCreateInput }
  | { ok: false; reason: string };

export function parseVendorRfiResponseFormData(formData: FormData): VendorRfiResponseCreateParseResult {
  const projectId = getTrimmedValue(formData, "projectId");
  const rfiId = getTrimmedValue(formData, "rfiId");
  const vendorId = getTrimmedValue(formData, "vendorId");
  const assignmentId = getTrimmedValue(formData, "assignmentId");
  const responderName = getTrimmedValue(formData, "responderName");
  const responseBody = getTrimmedValue(formData, "responseBody");

  if (!projectId || !rfiId || !vendorId || !assignmentId) {
    return { ok: false, reason: "This RFI response is missing assignment context." };
  }

  if (!responderName) {
    return { ok: false, reason: "Responder name is required." };
  }

  if (!responseBody) {
    return { ok: false, reason: "Response is required." };
  }

  return {
    ok: true,
    data: {
      projectId,
      rfiId,
      vendorId,
      assignmentId,
      responderName,
      responseBody,
    },
  };
}
