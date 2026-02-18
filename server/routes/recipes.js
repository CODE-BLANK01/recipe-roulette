import express from "express";
import { getDB } from "../db/database.js";
import { ObjectId } from "mongodb";

const router = express.Router();

// GET recipes with search & filter
router.get("/", async (req, res) => {
  const db = getDB();
  const { search, difficulty, maxPrep } = req.query;

  let query = {};
  if (difficulty) query.difficulty = difficulty;
  if (maxPrep) query.prepTime = { $lte: Number(maxPrep) };

  let recipes = await db.collection("recipes").find(query).toArray();

  if (search) {
    recipes = recipes.filter(r =>
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.ingredients.some(i =>
        i.toLowerCase().includes(search.toLowerCase())
      )
    );
  }

  res.json(recipes);
});

// ADD recipe
router.post("/", async (req, res) => {
  const { title, ingredients, prepTime, difficulty } = req.body;

  const newRecipe = {
    title,
    ingredients,
    prepTime,
    difficulty,
    favorite: false
  };

  const result = await getDB()
    .collection("recipes")
    .insertOne(newRecipe);

  res.json(result);
});

// TOGGLE favorite
router.put("/favorite/:id", async (req, res) => {
  const db = getDB();

  const recipe = await db.collection("recipes").findOne({
    _id: new ObjectId(req.params.id)
  });

  await db.collection("recipes").updateOne(
    { _id: new ObjectId(req.params.id) },
    { $set: { favorite: !recipe.favorite } }
  );

  res.json({ message: "Favorite toggled" });
});

// DELETE recipe
router.delete("/:id", async (req, res) => {
  await getDB()
    .collection("recipes")
    .deleteOne({ _id: new ObjectId(req.params.id) });

  res.json({ message: "Deleted" });
});

// MATCH recipes
router.get("/match", async (req, res) => {
  const db = getDB();
  const recipes = await db.collection("recipes").find().toArray();
  const inventory = await db.collection("inventory").find().toArray();

  const inventoryNames = inventory.map(i => i.name.toLowerCase());

  const results = recipes.map(recipe => {
    const missing = recipe.ingredients.filter(
      ing => !inventoryNames.includes(ing.toLowerCase())
    );

    return {
      ...recipe,
      missingCount: missing.length,
      missingIngredients: missing
    };
  });

  res.json(results);
});

// SHOPPING LIST
router.get("/shopping-list", async (req, res) => {
  const db = getDB();
  const recipes = await db.collection("recipes").find().toArray();
  const inventory = await db.collection("inventory").find().toArray();

  const inventoryNames = inventory.map(i => i.name.toLowerCase());
  const missingItems = new Set();

  recipes.forEach(recipe => {
    const missing = recipe.ingredients.filter(
      ing => !inventoryNames.includes(ing.toLowerCase())
    );

    if (missing.length > 0 && missing.length <= 2) {
      missing.forEach(item => missingItems.add(item));
    }
  });

  res.json(Array.from(missingItems));
});

export default router;
