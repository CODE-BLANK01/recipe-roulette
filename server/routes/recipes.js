import express from 'express';
import { getDB } from '../db/database.js';
import { ObjectId } from 'mongodb';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// All recipe routes require authentication
router.use(requireAuth);

// GET recipes with search & filter
// Everyone sees all recipes, but favorites are per-user
router.get('/', async (req, res) => {
  try {
    const db = getDB();
    const { search, difficulty, maxPrep, favorite } = req.query;

    let query = {};
    if (difficulty) query.difficulty = difficulty;
    if (maxPrep) query.prepTime = { $lte: Number(maxPrep) };

    let recipes = await db.collection('recipes').find(query).toArray();

    // Fetch this user's favorited recipe IDs
    const userFavs = await db
      .collection('favorites')
      .find({ userId: req.userId })
      .toArray();
    const favSet = new Set(userFavs.map((f) => f.recipeId));

    // Attach per-user favorite flag and ownership flag
    recipes = recipes.map((r) => ({
      ...r,
      favorite: favSet.has(r._id.toString()),
      isOwner: r.userId === req.userId,
    }));

    // Filter by favorite if requested
    if (favorite === 'true') {
      recipes = recipes.filter((r) => r.favorite);
    }

    // Search filter
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
// MATCH recipes against THIS user's inventory only
router.get('/match', async (req, res) => {
  try {
    const db = getDB();
    const [recipes, inventory] = await Promise.all([
      db.collection('recipes').find().toArray(),
      db.collection('inventory').find({ userId: req.userId }).toArray(),
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
// Uses THIS user's inventory only
router.get('/shopping-list', async (req, res) => {
  try {
    const db = getDB();
    const [recipes, inventory] = await Promise.all([
      db.collection('recipes').find().toArray(),
      db.collection('inventory').find({ userId: req.userId }).toArray(),
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

// GET single recipe by ID — attach favorite + ownership for this user
router.get('/:id', async (req, res) => {
  try {
    const db = getDB();
    const recipe = await db
      .collection('recipes')
      .findOne({ _id: new ObjectId(req.params.id) });
    if (!recipe) return res.status(404).json({ error: 'Recipe not found' });

    const fav = await db
      .collection('favorites')
      .findOne({ userId: req.userId, recipeId: req.params.id });

    res.json({
      ...recipe,
      favorite: !!fav,
      isOwner: recipe.userId === req.userId,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ADD recipe — always owned by the requesting user
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
      userId: req.userId, // owner
      createdAt: new Date(),
    };

    const result = await getDB().collection('recipes').insertOne(newRecipe);
    res.status(201).json({ ...newRecipe, _id: result.insertedId, favorite: false, isOwner: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// EDIT recipe — only owner can edit
router.put('/:id', async (req, res) => {
  try {
    const db = getDB();
    const recipe = await db
      .collection('recipes')
      .findOne({ _id: new ObjectId(req.params.id) });

    if (!recipe) return res.status(404).json({ error: 'Recipe not found' });
    if (recipe.userId !== req.userId) {
      return res.status(403).json({ error: 'You can only edit your own recipes' });
    }

    const { title, ingredients, prepTime, difficulty } = req.body;
    const updates = {};
    if (title !== undefined) updates.title = title;
    if (ingredients !== undefined) updates.ingredients = ingredients;
    if (prepTime !== undefined) updates.prepTime = Number(prepTime);
    if (difficulty !== undefined) updates.difficulty = difficulty;
    updates.updatedAt = new Date();

    await db
      .collection('recipes')
      .updateOne({ _id: new ObjectId(req.params.id) }, { $set: updates });

    res.json({ message: 'Recipe updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// TOGGLE favorite — stored in favorites collection, per user, not on recipe doc
router.put('/favorite/:id', async (req, res) => {
  try {
    const db = getDB();
    const recipeId = req.params.id;

    // Verify recipe exists
    const recipe = await db
      .collection('recipes')
      .findOne({ _id: new ObjectId(recipeId) });
    if (!recipe) return res.status(404).json({ error: 'Recipe not found' });

    const existing = await db
      .collection('favorites')
      .findOne({ userId: req.userId, recipeId });

    if (existing) {
      await db.collection('favorites').deleteOne({ _id: existing._id });
      res.json({ message: 'Removed from favorites', favorite: false });
    } else {
      await db.collection('favorites').insertOne({
        userId: req.userId,
        recipeId,
        createdAt: new Date(),
      });
      res.json({ message: 'Added to favorites', favorite: true });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE recipe — only owner can delete
router.delete('/:id', async (req, res) => {
  try {
    const db = getDB();
    const recipe = await db
      .collection('recipes')
      .findOne({ _id: new ObjectId(req.params.id) });

    if (!recipe) return res.status(404).json({ error: 'Recipe not found' });
    if (recipe.userId !== req.userId) {
      return res.status(403).json({ error: 'You can only delete your own recipes' });
    }

    await db.collection('recipes').deleteOne({ _id: new ObjectId(req.params.id) });
    // Clean up any favorites referencing this recipe
    await db.collection('favorites').deleteMany({ recipeId: req.params.id });

    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;