import { calculatePortfolioPerformance } from "../src/portfolio/portfolioPerformance";


describe("calculatePortfolioPerformance", () => {
  it("should calculate a positive profit correctly", () => {
    // Arrange
    const initialInvestment = 10000;
    const currentValue = 12000;

    // Act
    const result = calculatePortfolioPerformance(initialInvestment, currentValue);

    // Assert
    expect(result.profitOrLoss).toBe(2000);
    expect(result.percentageChange).toBe(20);
  });

  it("should calculate a loss correctly", () => {
    // Arrange
    const initialInvestment = 5000;
    const currentValue = 4000;

    // Act
    const result = calculatePortfolioPerformance(initialInvestment, currentValue);

    // Assert
    expect(result.profitOrLoss).toBe(-1000);
    expect(result.percentageChange).toBe(-20);
  });

  it("should return the 'gained significantly' summary when change exceeds 20%", () => {
    // Arrange
    const initialInvestment = 10000;
    const currentValue = 13000;

    // Act
    const result = calculatePortfolioPerformance(initialInvestment, currentValue);

    // Assert
    expect(result.performanceSummary).toContain("gained significantly");
  });

  it("should return the 'performed poorly' summary when change is 20% or below", () => {
    // Arrange
    const initialInvestment = 10000;
    const currentValue = 9000;

    // Act
    const result = calculatePortfolioPerformance(initialInvestment, currentValue);

    // Assert
    expect(result.performanceSummary).toContain("performed poorly");
  });
});