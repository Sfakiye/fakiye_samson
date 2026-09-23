export interface PortfolioPerformance {
  initialInvestment: number;
  currentValue: number;
  profitOrLoss: number;
  percentageChange: number;
  performanceSummary: string;
}

export function calculatePortfolioPerformance(
  initialInvestment: number,
  currentValue: number
): PortfolioPerformance {
  if (
    typeof initialInvestment !== "number" ||
    typeof currentValue !== "number" ||
    isNaN(initialInvestment) ||
    isNaN(currentValue)
  ) {
    throw new Error("initialInvestment and currentValue must be valid numbers");
  }

  const profitOrLoss = currentValue - initialInvestment;
  const percentageChange = (profitOrLoss / initialInvestment) * 100;

  const performanceSummary =
    percentageChange >= 20
      ? `The portfolio has gained significantly with a profit of $${profitOrLoss}.`
      : `The portfolio has performed poorly.`;

  return {
    initialInvestment,
    currentValue,
    profitOrLoss,
    percentageChange,
    performanceSummary,
  };
}