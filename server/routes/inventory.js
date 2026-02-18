import express from 'express';
import { getDB } from '../db/database.js';
import { ObjectId } from 'mongodb';

const router = express.Router();

// Helper — attach expiry status to an item so frontend can color-code
function withExpiryStatus(item) {
  if (!item.expirationDate) return { ...item, expiryStatus: 'none' };

  const now = new Date();
  const expiry = new Date(item.expirationDate);
  const daysLeft = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));

  let expiryStatus;
  if (daysLeft < 0) expiryStatus = 'expired';
  else if (daysLeft <= 3) expiryStatus = 'critical'; // red
  else if (daysLeft <= 7) expiryStatus = 'warning';  // yellow
  else expiryStatus = 'fresh';                        // green

  return { ...item, expiryStatus, daysLeft };
}

// GET all inventory items (filter by category, sort by expiry)
router.get('/', async (req, res) => {
  try {
    const db = getDB();
    const { category, sortByExpiry } = req.query;

    const query = {};
    if (category) query.category = category;

    const sort = sortByExpiry === 'true' ? { expirationDate: 1 } : {};

    const items = await db
      .collection('inventory')
      .find(query)
      .sort(sort)
      .toArray();

    res.json(items.map(withExpiryStatus));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single inventory item by ID
router.get('/:id', async (req, res) => {
  try {
    const db = getDB();
    const item = await db
      .collection('inventory')
      .findOne({ _id: new ObjectId(req.params.id) });

    if (!item) return res.status(404).json({ error: 'Item not found' });
    res.json(withExpiryStatus(item));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST add new inventory item
router.post('/', async (req, res) => {
  try {
    const { name, quantity, unit, category, expirationDate } = req.body;

    if (!name || !quantity || !unit || !category) {
      return res
        .status(400)
        .json({ error: 'Name, quantity, unit, and category are required' });
    }

    const newItem = {
      name,
      quantity: Number(quantity),
      unit,
      category,
      expirationDate: expirationDate ? new Date(expirationDate) : null,
      addedAt: new Date(),
    };

    const result = await getDB().collection('inventory').insertOne(newItem);
    res.status(201).json({ ...newItem, _id: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update inventory item (quantity, expiry date, or any field)
router.put('/:id', async (req, res) => {
  try {
    const db = getDB();
    const { name, quantity, unit, category, expirationDate } = req.body;

    const updates = {};
    if (name !== undefined) updates.name = name;
    if (quantity !== undefined) updates.quantity = Number(quantity);
    if (unit !== undefined) updates.unit = unit;
    if (category !== undefined) updates.category = category;
    if (expirationDate !== undefined) {
      updates.expirationDate = expirationDate ? new Date(expirationDate) : null;
    }
    updates.updatedAt = new Date();

    const result = await db
      .collection('inventory')
      .updateOne({ _id: new ObjectId(req.params.id) }, { $set: updates });

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json({ message: 'Item updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE inventory item
router.delete('/:id', async (req, res) => {
  try {
    const result = await getDB()
      .collection('inventory')
      .deleteOne({ _id: new ObjectId(req.params.id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;