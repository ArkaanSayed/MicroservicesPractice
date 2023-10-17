import express, { Request, Response } from "express";
import { requireAuth } from "@learningmc/common";
import { Order, OrderStatus } from "../models/orders";
const router = express.Router();

router.get("/api/orders", requireAuth, async (req, res) => {
  const orders = await Order.find({ userId: req.currentUser!.id }).populate(
    "ticket"
  );
  res.status(200).send(orders);
});

export { router as indexOrderRouter };
