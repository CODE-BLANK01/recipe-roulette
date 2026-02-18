import express from "express";
import { getDB } from "../db/database.js";
import { ObjectId } from "mongodb";

const router = express.Router();

router.get("/", async (req, res) => {
  const items = await getDB().collection("inventory").find().toArray();
  res.json(items);
});

router.post("/", async (req, res) => {
  const { name, quantity, unit, category, expirationDate } = req.body;

  const newItem = {
    name,
    quantity,
    unit,
    category,
    expirationDate: new Date(expirationDate)
  };

  const result = await getDB()
    .collection("inventory")
    .insertOne(newItem);

  res.json(result);
});

router.delete("/:id", async (req, res) => {
  await getDB()
    .collection("inventory")
    .deleteOne({ _id: new ObjectId(req.params.id) });

  res.json({ message: "Deleted" });
});

export default router;
