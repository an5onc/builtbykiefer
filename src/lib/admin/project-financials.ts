import { getTrimmedValue, parseNonNegativeMoney } from "./form-utils";

export interface ProjectFinancialTargetInput {
  contractValue: number;
  budgetedCost: number;
  targetMarginPercent: number;
  contingencyPercent: number;
}

export type ProjectFinancialTargetParseResult =
  | { ok: true; data: ProjectFinancialTargetInput }
  | { ok: false; reason: string };

function parsePercent(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 && parsed <= 100 ? parsed : null;
}

export function parseProjectFinancialTargetFormData(
  formData: FormData,
): ProjectFinancialTargetParseResult {
  const contractValue = parseNonNegativeMoney(getTrimmedValue(formData, "contractValue"));
  const budgetedCost = parseNonNegativeMoney(getTrimmedValue(formData, "budgetedCost"));
  const targetMarginPercent = parsePercent(getTrimmedValue(formData, "targetMarginPercent"));
  const contingencyPercent = parsePercent(getTrimmedValue(formData, "contingencyPercent"));

  if (contractValue === null || contractValue <= 0) {
    return { ok: false, reason: "Use a valid contract value." };
  }

  if (budgetedCost === null) {
    return { ok: false, reason: "Use a valid budgeted cost." };
  }

  if (targetMarginPercent === null) {
    return { ok: false, reason: "Use a target margin between 0 and 100." };
  }

  if (contingencyPercent === null) {
    return { ok: false, reason: "Use a contingency between 0 and 100." };
  }

  return {
    ok: true,
    data: {
      contractValue,
      budgetedCost,
      targetMarginPercent,
      contingencyPercent,
    },
  };
}
