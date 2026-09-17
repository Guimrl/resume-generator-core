import { Router } from "express";
import PrincipalCVController from "../controllers/PrincipalCVController";
import pdfRateLimiter from "../middlewares/PDFRateLimiter";

const router = Router();

const principalCVController = new PrincipalCVController();

router.post("/principal", pdfRateLimiter, principalCVController.create);

export default router;
