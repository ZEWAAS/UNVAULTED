import { Router } from "express";
import { nominatimProxy } from "../controllers/geocode";

const router = Router();

router.get("/", nominatimProxy);

export default router;
