import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  return res.send({answer: 42});
});

export default router;