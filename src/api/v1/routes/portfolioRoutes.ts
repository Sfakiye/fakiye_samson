import { Router, Request, Response } from "express";
import { calculatePortfolioPerformance } from "../../../portfolio/portfolioPerformance";

const router = Router();

router.post("/portfolio/performance", (req: Request, res: Response) => {
  const { initialInvestment, currentValue } = req.body;

  const result = calculatePortfolioPerformance(initialInvestment, currentValue);

  res.status(200).json(result);
});

export default router;