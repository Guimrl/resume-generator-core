import express from "express";
import PrincipalCVController from "../controllers/PrincipalCVController";

const router = express.Router();

const principalCVController = new PrincipalCVController();

router.post("/principal", principalCVController.create);

export default router;
