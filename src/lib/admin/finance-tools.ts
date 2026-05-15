export interface LoanPaymentPlanInput {
  principal: number;
  annualRatePercent: number;
  termYears: number;
  paymentsPerYear: number;
}

export interface LoanPaymentPlan {
  payment: number;
  totalPaid: number;
  totalInterest: number;
  numberOfPayments: number;
  periodicRatePercent: number;
}

export interface EffectiveAnnualRateInput {
  nominalRatePercent: number;
  compoundingPeriodsPerYear: number;
}

export interface DrawRetainagePlanInput {
  contractValue: number;
  percentComplete: number;
  retainagePercent: number;
  paidToDate: number;
}

export interface DrawRetainagePlan {
  grossEarnedToDate: number;
  retainageHeldToDate: number;
  netEarnedToDate: number;
  currentDrawDue: number;
  remainingContractValue: number;
  remainingToCollect: number;
  percentRemaining: number;
}

export interface InvestmentDecisionInput {
  initialInvestment: number;
  discountRatePercent: number;
  cashFlows: number[];
}

export interface InvestmentDecision {
  netPresentValue: number;
  internalRateOfReturnPercent: number | null;
  paybackYears: number | null;
  totalCashIn: number;
  netCashGain: number;
  isAboveHurdleRate: boolean;
}

export interface ChangeOrderImpactInput {
  proposedPrice: number;
  laborCost: number;
  materialCost: number;
  subcontractorCost: number;
  otherCost: number;
  targetMarginPercent: number;
  scheduleDaysAdded: number;
}

export interface ChangeOrderImpact {
  totalAddedCost: number;
  grossProfit: number;
  grossMarginPercent: number;
  markupPercent: number;
  recommendedBillingAmount: number;
  marginGap: number;
  isMarginProtected: boolean;
  scheduleDaysAdded: number;
}

function roundMoney(value: number) {
  return Math.round(value * 100) / 100;
}

function roundWholeDollars(value: number) {
  return Math.round(value);
}

function roundPercent(value: number) {
  return Math.round(value * 10000) / 10000;
}

function clampPercent(value: number) {
  return Math.min(Math.max(value, 0), 100);
}

function nonNegative(value: number) {
  return Math.max(value, 0);
}

function presentValueAtRate(cashFlows: number[], rate: number) {
  return cashFlows.reduce((sum, cashFlow, index) => sum + cashFlow / (1 + rate) ** index, 0);
}

function calculateIrrPercent(cashFlows: number[]) {
  const hasNegative = cashFlows.some((cashFlow) => cashFlow < 0);
  const hasPositive = cashFlows.some((cashFlow) => cashFlow > 0);

  if (!hasNegative || !hasPositive) {
    return null;
  }

  let low = -0.9999;
  let high = 10;
  let lowValue = presentValueAtRate(cashFlows, low);
  let highValue = presentValueAtRate(cashFlows, high);

  if (Math.sign(lowValue) === Math.sign(highValue)) {
    return null;
  }

  for (let iteration = 0; iteration < 100; iteration += 1) {
    const middle = (low + high) / 2;
    const middleValue = presentValueAtRate(cashFlows, middle);

    if (Math.abs(middleValue) < 0.0001) {
      return roundMoney(middle * 100);
    }

    if (Math.sign(middleValue) === Math.sign(lowValue)) {
      low = middle;
      lowValue = middleValue;
    } else {
      high = middle;
      highValue = middleValue;
    }
  }

  return roundMoney(((low + high) / 2) * 100);
}

export function calculateMonthlyRateFromApr(aprPercent: number) {
  return roundPercent(aprPercent / 12);
}

export function calculateEffectiveAnnualRate({
  nominalRatePercent,
  compoundingPeriodsPerYear,
}: EffectiveAnnualRateInput) {
  if (compoundingPeriodsPerYear <= 0) {
    return 0;
  }

  const nominalRate = nominalRatePercent / 100;
  const effectiveRate = (1 + nominalRate / compoundingPeriodsPerYear) ** compoundingPeriodsPerYear - 1;

  return roundMoney(effectiveRate * 100);
}

export function calculateLoanPaymentPlan({
  principal,
  annualRatePercent,
  termYears,
  paymentsPerYear,
}: LoanPaymentPlanInput): LoanPaymentPlan {
  const numberOfPayments = Math.max(0, Math.round(termYears * paymentsPerYear));
  const periodicRate = paymentsPerYear > 0 ? annualRatePercent / 100 / paymentsPerYear : 0;

  if (principal <= 0 || numberOfPayments <= 0) {
    return {
      payment: 0,
      totalPaid: 0,
      totalInterest: 0,
      numberOfPayments,
      periodicRatePercent: roundPercent(periodicRate * 100),
    };
  }

  const payment =
    periodicRate === 0
      ? principal / numberOfPayments
      : (principal * periodicRate) / (1 - (1 + periodicRate) ** -numberOfPayments);
  const totalPaid = payment * numberOfPayments;

  return {
    payment: roundMoney(payment),
    totalPaid: roundWholeDollars(totalPaid),
    totalInterest: roundWholeDollars(totalPaid - principal),
    numberOfPayments,
    periodicRatePercent: roundPercent(periodicRate * 100),
  };
}

export function calculateDrawRetainagePlan({
  contractValue,
  percentComplete,
  retainagePercent,
  paidToDate,
}: DrawRetainagePlanInput): DrawRetainagePlan {
  const normalizedContractValue = nonNegative(contractValue);
  const normalizedPaidToDate = nonNegative(paidToDate);
  const normalizedPercentComplete = clampPercent(percentComplete);
  const normalizedRetainagePercent = clampPercent(retainagePercent);

  const grossEarnedToDate = normalizedContractValue * (normalizedPercentComplete / 100);
  const retainageHeldToDate = grossEarnedToDate * (normalizedRetainagePercent / 100);
  const netEarnedToDate = grossEarnedToDate - retainageHeldToDate;
  const currentDrawDue = Math.max(netEarnedToDate - normalizedPaidToDate, 0);
  const remainingContractValue = Math.max(normalizedContractValue - grossEarnedToDate, 0);
  const remainingToCollect = Math.max(normalizedContractValue - normalizedPaidToDate, 0);

  return {
    grossEarnedToDate: roundWholeDollars(grossEarnedToDate),
    retainageHeldToDate: roundWholeDollars(retainageHeldToDate),
    netEarnedToDate: roundWholeDollars(netEarnedToDate),
    currentDrawDue: roundWholeDollars(currentDrawDue),
    remainingContractValue: roundWholeDollars(remainingContractValue),
    remainingToCollect: roundWholeDollars(remainingToCollect),
    percentRemaining: roundPercent(100 - normalizedPercentComplete),
  };
}

export function calculateInvestmentDecision({
  initialInvestment,
  discountRatePercent,
  cashFlows,
}: InvestmentDecisionInput): InvestmentDecision {
  const normalizedInitialInvestment = nonNegative(initialInvestment);
  const normalizedCashFlows = cashFlows.map((cashFlow) => Math.max(cashFlow, 0));
  const totalCashIn = normalizedCashFlows.reduce((sum, cashFlow) => sum + cashFlow, 0);
  const netCashGain = totalCashIn - normalizedInitialInvestment;
  const discountRate = discountRatePercent / 100;
  const discountedCashFlows = [-normalizedInitialInvestment, ...normalizedCashFlows];
  const netPresentValue = presentValueAtRate(discountedCashFlows, discountRate);
  const internalRateOfReturnPercent = calculateIrrPercent(discountedCashFlows);

  let cumulativeCash = 0;
  let paybackYears: number | null = null;

  normalizedCashFlows.forEach((cashFlow, index) => {
    if (paybackYears !== null) {
      return;
    }

    const previousCash = cumulativeCash;
    cumulativeCash += cashFlow;

    if (cumulativeCash >= normalizedInitialInvestment && cashFlow > 0) {
      paybackYears = index + (normalizedInitialInvestment - previousCash) / cashFlow + 1;
    }
  });

  return {
    netPresentValue: roundWholeDollars(netPresentValue),
    internalRateOfReturnPercent,
    paybackYears: paybackYears === null ? null : roundMoney(paybackYears),
    totalCashIn: roundWholeDollars(totalCashIn),
    netCashGain: roundWholeDollars(netCashGain),
    isAboveHurdleRate:
      internalRateOfReturnPercent !== null && internalRateOfReturnPercent >= discountRatePercent && netPresentValue >= 0,
  };
}

export function calculateChangeOrderImpact({
  proposedPrice,
  laborCost,
  materialCost,
  subcontractorCost,
  otherCost,
  targetMarginPercent,
  scheduleDaysAdded,
}: ChangeOrderImpactInput): ChangeOrderImpact {
  const normalizedProposedPrice = nonNegative(proposedPrice);
  const normalizedCosts = [laborCost, materialCost, subcontractorCost, otherCost].map(nonNegative);
  const totalAddedCost = normalizedCosts.reduce((sum, cost) => sum + cost, 0);
  const grossProfit = normalizedProposedPrice - totalAddedCost;
  const grossMarginPercent =
    normalizedProposedPrice > 0 ? (grossProfit / normalizedProposedPrice) * 100 : 0;
  const markupPercent = totalAddedCost > 0 ? (grossProfit / totalAddedCost) * 100 : 0;
  const normalizedTargetMargin = Math.min(Math.max(targetMarginPercent, 0), 99.99);
  const recommendedBillingAmount =
    normalizedTargetMargin >= 99.99 ? totalAddedCost : totalAddedCost / (1 - normalizedTargetMargin / 100);
  const marginGap = Math.max(recommendedBillingAmount - normalizedProposedPrice, 0);

  return {
    totalAddedCost: roundWholeDollars(totalAddedCost),
    grossProfit: roundWholeDollars(grossProfit),
    grossMarginPercent: roundMoney(grossMarginPercent),
    markupPercent: roundMoney(markupPercent),
    recommendedBillingAmount: roundWholeDollars(recommendedBillingAmount),
    marginGap: roundWholeDollars(marginGap),
    isMarginProtected: normalizedProposedPrice >= recommendedBillingAmount,
    scheduleDaysAdded: roundWholeDollars(nonNegative(scheduleDaysAdded)),
  };
}
