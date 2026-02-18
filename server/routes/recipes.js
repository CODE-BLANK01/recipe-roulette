import express from 'express';
import { getDB } from '../db/database.js';
import { ObjectId } from 'mongodb';

const router = express.Router();

// GET recipes with search & filter
router.get('/', async (req, res) => {
  try {
    const db = getDB();
    const { search, difficulty, maxPrep, favorite } = req.query;

    let query = {};
    if (difficulty) query.difficulty = difficulty;
    if (maxPrep) query.prepTime = { $lte: Number(maxPrep) };
    if (favorite === 'true') query.favorite = true;

    let recipes = await db.collection('recipes').find(query).toArray();

    if (search) {
      const s = search.toLowerCase();
      recipes = recipes.filter(
        (r) =>
          r.title.toLowerCase().includes(s) ||
          r.ingredients.some((i) => i.toLowerCase().includes(s))
      );
    }

    res.json(recipes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ⚠️ Named routes MUST come before /:id to avoid conflicts
// MATCH recipes against inventory
router.get('/match', async (req, res) => {
  try {
    const db = getDB();
    const [recipes, inventory] = await Promise.all([
      db.collection('recipes').find().toArray(),
      db.collection('inventory').find().toArray(),
    ]);

    const inventoryNames = inventory.map((i) => i.name.toLowerCase());

    const results = recipes.map((recipe) => {
      const missing = recipe.ingredients.filter(
        (ing) => !inventoryNames.includes(ing.toLowerCase())
      );
      return {
        ...recipe,
        missingCount: missing.length,
        missingIngredients: missing,
      };
    });

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// SHOPPING LIST — only from almost-cookable recipes (missing 1-2 items)
router.get('/shopping-list', async (req, res) => {
  try {
    const db = getDB();
    const [recipes, inventory] = await Promise.all([
      db.collection('recipes').find().toArray(),
      db.collection('inventory').find().toArray(),
    ]);

    const inventoryNames = inventory.map((i) => i.name.toLowerCase());
    const missingItems = new Set();

    recipes.forEach((recipe) => {
      const missing = recipe.ingredients.filter(
        (ing) => !inventoryNames.includes(ing.toLowerCase())
      );
      if (missing.length > 0 && missing.length <= 2) {
        missing.forEach((item) => missingItems.add(item));
      }
    });

    res.json(Array.from(missingItems));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single recipe by ID
router.get('/:id', async (req, res) => {
  try {
    const db = getDB();
    const recipe = await db
      .collection('recipes')
      .findOne({ _id: new ObjectId(req.params.id) });
    if (!recipe) return res.status(404).json({ error: 'Recipe not found' });
    res.json(recipe);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ADD recipe
router.post('/', async (req, res) => {
  try {
    const { title, ingredients, prepTime, difficulty } = req.body;

    if (!title || !ingredients || !prepTime || !difficulty) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const newRecipe = {
      title,
      ingredients,
      prepTime: Number(prepTime),
      difficulty,
      favorite: false,
      createdAt: new Date(),
    };

    const result = await getDB().collection('recipes').insertOne(newRecipe);
    res.status(201).json({ ...newRecipe, _id: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// EDIT recipe
router.put('/:id', async (req, res) => {
  try {
    const db = getDB();
    const { title, ingredients, prepTime, difficulty } = req.body;

    const updates = {};
    if (title !== undefined) updates.title = title;
    if (ingredients !== undefined) updates.ingredients = ingredients;
    if (prepTime !== undefined) updates.prepTime = Number(prepTime);
    if (difficulty !== undefined) updates.difficulty = difficulty;
    updates.updatedAt = new Date();

    const result = await db
      .collection('recipes')
      .updateOne({ _id: new ObjectId(req.params.id) }, { $set: updates });

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Recipe not found' });
    }
    res.json({ message: 'Recipe updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// TOGGLE favorite
router.put('/favorite/:id', async (req, res) => {
  try {
    const db = getDB();
    const recipe = await db
      .collection('recipes')
      .findOne({ _id: new ObjectId(req.params.id) });
    if (!recipe) return res.status(404).json({ error: 'Recipe not found' });

    await db
      .collection('recipes')
      .updateOne(
        { _id: new ObjectId(req.params.id) },
        { $set: { favorite: !recipe.favorite } }
      );

    res.json({ message: 'Favorite toggled', favorite: !recipe.favorite });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE recipe
router.delete('/:id', async (req, res) => {
  try {
    const result = await getDB()
      .collection('recipes')
      .deleteOne({ _id: new ObjectId(req.params.id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Recipe not found' });
    }
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;