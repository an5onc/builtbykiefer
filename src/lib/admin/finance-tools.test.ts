import { describe, expect, it } from "vitest";
import {
  calculateChangeOrderImpact,
  calculateDrawRetainagePlan,
  calculateEffectiveAnnualRate,
  calculateInvestmentDecision,
  calculateJobCostVariance,
  calculateLoanPaymentPlan,
  calculateMonthlyRateFromApr,
  calculateProjectCashFlowForecast,
} from "./finance-tools";

describe("finance tools", () => {
  it("calculates a Kiefer Built payment plan for a financed purchase", () => {
    expect(
      calculateLoanPaymentPlan({
        principal: 85000,
        annualRatePercent: 7.25,
        termYears: 5,
        paymentsPerYear: 12,
      }),
    ).toEqual({
      payment: 1693.15,
      totalPaid: 101589,
      totalInterest: 16589,
      numberOfPayments: 60,
      periodicRatePercent: 0.6042,
    });
  });

  it("handles zero-interest payment plans", () => {
    expect(
      calculateLoanPaymentPlan({
        principal: 24000,
        annualRatePercent: 0,
        termYears: 2,
        paymentsPerYear: 12,
      }),
    ).toMatchObject({
      payment: 1000,
      totalPaid: 24000,
      totalInterest: 0,
    });
  });

  it("converts APR to monthly and effective annual rates", () => {
    expect(calculateMonthlyRateFromApr(7.2)).toBe(0.6);
    expect(calculateEffectiveAnnualRate({ nominalRatePercent: 7.2, compoundingPeriodsPerYear: 12 })).toBe(7.44);
  });

  it("calculates draw and retainage exposure for a progress billing cycle", () => {
    expect(
      calculateDrawRetainagePlan({
        contractValue: 500000,
        percentComplete: 62.5,
        retainagePercent: 10,
        paidToDate: 225000,
      }),
    ).toEqual({
      grossEarnedToDate: 312500,
      retainageHeldToDate: 31250,
      netEarnedToDate: 281250,
      currentDrawDue: 56250,
      remainingContractValue: 187500,
      remainingToCollect: 275000,
      percentRemaining: 37.5,
    });
  });

  it("clamps completed progress and avoids negative draw amounts", () => {
    expect(
      calculateDrawRetainagePlan({
        contractValue: 120000,
        percentComplete: 140,
        retainagePercent: 5,
        paidToDate: 130000,
      }),
    ).toMatchObject({
      grossEarnedToDate: 120000,
      retainageHeldToDate: 6000,
      netEarnedToDate: 114000,
      currentDrawDue: 0,
      remainingContractValue: 0,
      remainingToCollect: 0,
      percentRemaining: 0,
    });
  });

  it("calculates NPV, IRR, and payback for an equipment investment", () => {
    expect(
      calculateInvestmentDecision({
        initialInvestment: 85000,
        discountRatePercent: 12,
        cashFlows: [22000, 24000, 25000, 26000, 28000],
      }),
    ).toEqual({
      netPresentValue: 3981,
      internalRateOfReturnPercent: 13.8,
      paybackYears: 4.54,
      totalCashIn: 125000,
      netCashGain: 40000,
      isAboveHurdleRate: true,
    });
  });

  it("handles investments that do not pay back within the provided cash flows", () => {
    expect(
      calculateInvestmentDecision({
        initialInvestment: 90000,
        discountRatePercent: 10,
        cashFlows: [12000, 14000, 15000],
      }),
    ).toMatchObject({
      netPresentValue: -56251,
      internalRateOfReturnPercent: -30.19,
      paybackYears: null,
      totalCashIn: 41000,
      netCashGain: -49000,
      isAboveHurdleRate: false,
    });
  });

  it("calculates change order margin impact against a target margin", () => {
    expect(
      calculateChangeOrderImpact({
        proposedPrice: 9500,
        laborCost: 3200,
        materialCost: 2100,
        subcontractorCost: 1500,
        otherCost: 700,
        targetMarginPercent: 25,
        scheduleDaysAdded: 4,
      }),
    ).toEqual({
      totalAddedCost: 7500,
      grossProfit: 2000,
      grossMarginPercent: 21.05,
      markupPercent: 26.67,
      recommendedBillingAmount: 10000,
      marginGap: 500,
      isMarginProtected: false,
      scheduleDaysAdded: 4,
    });
  });

  it("flags change orders that protect the target margin", () => {
    expect(
      calculateChangeOrderImpact({
        proposedPrice: 12000,
        laborCost: 3200,
        materialCost: 2100,
        subcontractorCost: 1500,
        otherCost: 700,
        targetMarginPercent: 25,
        scheduleDaysAdded: -2,
      }),
    ).toMatchObject({
      grossProfit: 4500,
      grossMarginPercent: 37.5,
      recommendedBillingAmount: 10000,
      marginGap: 0,
      isMarginProtected: true,
      scheduleDaysAdded: 0,
    });
  });

  it("calculates job cost variance and flags contingency watch items", () => {
    expect(
      calculateJobCostVariance({
        budgetedCost: 420000,
        actualCost: 260000,
        committedCost: 138000,
        pendingExposure: 29000,
        contingencyPercent: 3,
      }),
    ).toEqual({
      projectedFinalCost: 427000,
      varianceAmount: 7000,
      variancePercent: 1.67,
      contingencyAllowance: 12600,
      remainingBudget: 0,
      status: "watch",
      managerNote: "Projected cost is above budget but inside the contingency allowance.",
    });
  });

  it("flags over-budget jobs beyond contingency", () => {
    expect(
      calculateJobCostVariance({
        budgetedCost: 300000,
        actualCost: 210000,
        committedCost: 90000,
        pendingExposure: 25000,
        contingencyPercent: 5,
      }),
    ).toMatchObject({
      projectedFinalCost: 325000,
      varianceAmount: 25000,
      variancePercent: 8.33,
      contingencyAllowance: 15000,
      remainingBudget: 0,
      status: "over-budget",
      managerNote: "Projected cost is beyond the contingency allowance. Review commitments and scope exposure.",
    });
  });

  it("keeps under-budget jobs on track", () => {
    expect(
      calculateJobCostVariance({
        budgetedCost: 500000,
        actualCost: 210000,
        committedCost: 170000,
        pendingExposure: 15000,
        contingencyPercent: 4,
      }),
    ).toMatchObject({
      projectedFinalCost: 395000,
      varianceAmount: -105000,
      variancePercent: -21,
      remainingBudget: 105000,
      status: "on-track",
      managerNote: "Projected cost is tracking within budget.",
    });
  });

  it("forecasts project cash flow pressure from draws and near-term obligations", () => {
    expect(
      calculateProjectCashFlowForecast({
        contractValue: 500000,
        approvedChangeOrders: 25000,
        percentComplete: 60,
        retainagePercent: 10,
        paidToDate: 240000,
        pendingDrawsSubmitted: 18000,
        vendorPaymentsDue: 42000,
        payrollDue: 31000,
        overheadDue: 9500,
        cashOnHand: 20000,
      }),
    ).toEqual({
      adjustedContractValue: 525000,
      grossEarnedToDate: 315000,
      retainageHeldToDate: 31500,
      netEarnedToDate: 283500,
      currentDrawReady: 25500,
      expectedCashIn: 43500,
      scheduledCashOut: 82500,
      projectedEndingCash: -19000,
      cashGap: 19000,
      status: "funding-needed",
      managerNote: "Projected outflows exceed cash plus expected receipts. Review draw timing or short-term funding.",
    });
  });

  it("marks cash forecasts healthy when receipts and reserves cover obligations", () => {
    expect(
      calculateProjectCashFlowForecast({
        contractValue: 500000,
        approvedChangeOrders: 0,
        percentComplete: 70,
        retainagePercent: 10,
        paidToDate: 280000,
        pendingDrawsSubmitted: 15000,
        vendorPaymentsDue: 30000,
        payrollDue: 18000,
        overheadDue: 5000,
        cashOnHand: 75000,
      }),
    ).toMatchObject({
      expectedCashIn: 35000,
      scheduledCashOut: 53000,
      projectedEndingCash: 57000,
      cashGap: 0,
      status: "healthy",
    });
  });
});
