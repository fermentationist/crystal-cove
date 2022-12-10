import { Router } from "express";
import {runErinsCheck} from "../getCampsiteAvailability.js";

const router = Router();

router.get("/campsite_availability", async (req, res) => {
  const results = await runErinsCheck();
  return res.send(results);
});

export default router;