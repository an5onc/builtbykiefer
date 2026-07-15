/**
 * Tokens that signal an owner is a company, developer, government body,
 * financial institution, or utility rather than a household we'd market to.
 * Family / living trusts are intentionally NOT flagged — those owners are
 * prime custom-home prospects.
 */
const ENTITY_PATTERNS: RegExp[] = [
  /\bL\.?L\.?C\.?\b/i,
  /\bL\.?L\.?P\.?\b/i,
  /\bL\.?P\.?\b/i,
  /\bINC\b/i,
  /\bCORP(?:ORATION)?\b/i,
  /\bCOMPANY\b/i,
  /\bCO\b(?=\s|$)/, // trailing "CO" (uppercase only, to avoid surnames)
  /\bLTD\b/i,
  /\bHOLDINGS?\b/i,
  /\bPROPERTIES\b/i,
  /\bENTERPRISES?\b/i,
  /\bINVESTMENTS?\b/i,
  /\bDEVELOPMENT\b/i,
  /\bDEVELOPERS?\b/i,
  /\bBUILDERS?\b/i,
  /\bHOMES\b/i,
  /\bCONSTRUCTION\b/i,
  /\bREALTY\b/i,
  /\bPARTNERS(?:HIP)?\b/i,
  /\bASSOCIATES?\b/i,
  /\bH\.?O\.?A\.?\b/i,
  /\bASSOCIATION\b/i,
  /\bCITY OF\b/i,
  /\bTOWN OF\b/i,
  /\bCOUNTY OF\b/i,
  /\bSTATE OF\b/i,
  /\bUNITED STATES\b/i,
  /\bDISTRICT\b/i,
  /\bAUTHORITY\b/i,
  /\bDEPARTMENT\b/i,
  /\bMUNICIPAL\b/i,
  /\bCHURCH\b/i,
  /\bMINISTR(?:Y|IES)\b/i,
  /\bBANK\b/i,
  /\bMORTGAGE\b/i,
  /\bCREDIT UNION\b/i,
  /\bUTILIT(?:Y|IES)\b/i,
  /\bELECTRIC\b/i,
  /\bWATER\b/i,
  /\bFARMS?\b(?=.*\b(?:LLC|INC|CORP)\b)/i, // "X Farms LLC" (not a bare surname "Farmer")
];

export function isLikelyEntityOwner(ownerName: string): boolean {
  const name = ownerName.trim();

  if (name === "") {
    return false;
  }

  return ENTITY_PATTERNS.some((pattern) => pattern.test(name));
}
