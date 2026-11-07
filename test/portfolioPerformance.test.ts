import {
  calculatePortfolioPerformance,
  PortfolioPerformance,
} from "../src/portfolio/portfolioPerformance";

describe("calculatePortfolioPerformance", () => {
  it("should calculate a positive profit correctly", () => {
    const initialInvestment: number = 10000;
    const currentValue: number = 12000;

    const result: PortfolioPerformance = calculatePortfolioPerformance(
      initialInvestment,
      currentValue
    );

    expect(result.profitOrLoss).toBe(2000);
    expect(result.percentageChange).toBe(20);
  });

  it("should calculate a loss correctly", () => {
    const initialInvestment: number = 5000;
    const currentValue: number = 4000;

    const result: PortfolioPerformance = calculatePortfolioPerformance(
      initialInvestment,
      currentValue
    );

    expect(result.profitOrLoss).toBe(-1000);
    expect(result.percentageChange).toBe(-20);
  });

  it("should return the 'gained significantly' summary when change is 20% or more", () => {
    const initialInvestment: number = 10000;
    const currentValue: number = 13000;

    const result: PortfolioPerformance = calculatePortfolioPerformance(
      initialInvestment,
      currentValue
    );

    expect(result.performanceSummary).toContain("gained significantly");
  });

  it("should return the 'performed poorly' summary when change is below 20%", () => {
    const initialInvestment: number = 10000;
    const currentValue: number = 10500;

    const result: PortfolioPerformance = calculatePortfolioPerformance(
      initialInvestment,
      currentValue
    );

    expect(result.performanceSummary).toContain("performed poorly");
  });

  it("should return 'performed poorly' when there is no change", () => {
    const initialInvestment: number = 10000;
    const currentValue: number = 10000;

    const result: PortfolioPerformance = calculatePortfolioPerformance(
      initialInvestment,
      currentValue
    );

    expect(result.profitOrLoss).toBe(0);
    expect(result.percentageChange).toBe(0);
    expect(result.performanceSummary).toContain("performed poorly");
  });
});