import { Router, Request, Response } from "express";
import {
  calculatePortfolioPerformance,
  PortfolioPerformance,
} from "../../../portfolio/portfolioPerformance";

const router: Router = Router();

router.post("/portfolio/performance", (req: Request, res: Response) => {
  try {
    const { initialInvestment, currentValue } = req.body;
    const result: PortfolioPerformance = calculatePortfolioPerformance(
      initialInvestment,
      currentValue
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

export default router;