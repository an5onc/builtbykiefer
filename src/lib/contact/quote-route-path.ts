const apiPrefix = /^[/\\]+api(?:[/\\]|$)/i;
const encodedByte = /%([0-9a-f]{2})/gi;
const maxInspectionPasses = 8;

/** Inspect only; never use the decoded spelling as a rewrite destination. */
export function rejectEncodedApiPath(pathname: string): boolean {
  if (!pathname.includes("%")) return false;
  let inspected = pathname;
  for (let pass = 0; pass < maxInspectionPasses; pass++) {
    if (apiPrefix.test(inspected)) return true;
    // Literal non-API folders (including encoded image filenames) are unrelated.
    const firstSegment = inspected.replace(/^[/\\]+/, "").split(/[/\\]/, 1)[0];
    if (!firstSegment.includes("%")) return false;
    // Byte inspection also handles malformed UTF-8 without throwing or reading a body.
    const decoded = inspected.replace(encodedByte, (_match, hex: string) => String.fromCharCode(Number.parseInt(hex, 16)));
    if (decoded === inspected) return false;
    inspected = decoded;
  }
  // Excessively nested, still ambiguous prefixes fail closed within a fixed work bound.
  return apiPrefix.test(inspected) || inspected.replace(/^[/\\]+/, "").split(/[/\\]/, 1)[0].includes("%");
}
