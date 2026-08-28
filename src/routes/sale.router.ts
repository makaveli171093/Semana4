import { Router } from "express";
import {
  getSales,
  getSaleById,
  createSale,
} from "../controllers/sale.controller.js";
import { validateSale } from "../middleware/sale.validate.js";

const router: Router = Router();

router.get("/sales", getSales);
router.get("/sales/:id", getSaleById);
router.post("/sales", validateSale, createSale);

export default router;
