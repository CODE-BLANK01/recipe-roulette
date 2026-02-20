import { MongoClient } from 'mongodb';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: resolve(__dirname, '../../.env') });

const client = new MongoClient(process.env.MONGODB_URI);

// ─── 30 High-Quality Global Recipes ──────────────────────────────────────────

const recipes = [
  {
    title: 'Classic Spaghetti Bolognese',
    ingredients: ['spaghetti', 'ground beef', 'tomato sauce', 'onion', 'garlic', 'olive oil', 'parmesan'],
    instructions: 'Brown beef with onion and garlic in olive oil. Add tomato sauce and simmer 20 min. Cook spaghetti al dente, combine and top with parmesan.',
    prepTime: 30,
    difficulty: 'Easy',
  },
  {
    title: 'Chicken Stir Fry',
    ingredients: ['chicken breast', 'broccoli', 'soy sauce', 'garlic', 'ginger', 'sesame oil', 'rice'],
    instructions: 'Slice chicken thinly. Stir fry with garlic and ginger over high heat. Add broccoli and soy sauce. Serve over steamed rice with sesame oil drizzle.',
    prepTime: 20,
    difficulty: 'Easy',
  },
  {
    title: 'Vegetable Curry',
    ingredients: ['chickpeas', 'coconut milk', 'tomato', 'onion', 'garlic', 'curry powder', 'rice'],
    instructions: 'Sauté onion and garlic until golden. Add curry powder and toast 1 min. Add tomatoes, chickpeas and coconut milk. Simmer 25 min. Serve with rice.',
    prepTime: 35,
    difficulty: 'Medium',
  },
  {
    title: 'Avocado Toast with Poached Egg',
    ingredients: ['bread', 'avocado', 'lemon juice', 'salt', 'red pepper flakes', 'egg'],
    instructions: 'Toast sourdough. Mash avocado with lemon juice and salt. Spread on toast. Poach egg for 3 min, place on top. Finish with red pepper flakes.',
    prepTime: 12,
    difficulty: 'Easy',
  },
  {
    title: 'Mushroom Risotto',
    ingredients: ['arborio rice', 'mushrooms', 'onion', 'garlic', 'white wine', 'parmesan', 'butter', 'vegetable broth'],
    instructions: 'Sauté onion and mushrooms in butter. Add rice and toast 2 min. Deglaze with wine. Add warm broth one ladle at a time, stirring constantly 20 min. Finish with parmesan.',
    prepTime: 45,
    difficulty: 'Hard',
  },
  {
    title: 'Shakshuka',
    ingredients: ['egg', 'tomato', 'onion', 'garlic', 'bell pepper', 'cumin', 'paprika', 'feta cheese'],
    instructions: 'Sauté onion, garlic and peppers. Add cumin, paprika and crushed tomatoes. Simmer 10 min. Make wells and crack in eggs. Cover and cook until whites set. Top with feta.',
    prepTime: 25,
    difficulty: 'Medium',
  },
  {
    title: 'Lemon Garlic Salmon',
    ingredients: ['salmon', 'lemon', 'garlic', 'butter', 'dill', 'salt', 'black pepper'],
    instructions: 'Pat salmon dry. Season with salt and pepper. Sear in butter skin-side down 4 min. Flip, add garlic and lemon slices. Cook 3 more min. Finish with fresh dill.',
    prepTime: 20,
    difficulty: 'Medium',
  },
  {
    title: 'Beef Tacos',
    ingredients: ['ground beef', 'taco shells', 'cheddar cheese', 'lettuce', 'tomato', 'sour cream', 'taco seasoning'],
    instructions: 'Brown ground beef, drain fat. Add taco seasoning and 1/4 cup water, simmer 5 min. Warm taco shells. Fill with beef, cheese, lettuce, tomato and sour cream.',
    prepTime: 20,
    difficulty: 'Easy',
  },
  {
    title: 'Margherita Pizza',
    ingredients: ['pizza dough', 'tomato sauce', 'mozzarella', 'basil', 'olive oil', 'salt'],
    instructions: 'Stretch dough to 12 inch round. Spread thin layer of tomato sauce. Top with torn mozzarella and drizzle of olive oil. Bake at 475°F for 12 min. Top with fresh basil.',
    prepTime: 25,
    difficulty: 'Medium',
  },
  {
    title: 'Garlic Butter Shrimp Pasta',
    ingredients: ['pasta', 'shrimp', 'butter', 'garlic', 'lemon', 'parsley', 'red pepper flakes', 'parmesan'],
    instructions: 'Cook pasta. Melt butter, sauté garlic 1 min. Add shrimp and cook 2 min per side. Toss with pasta, lemon juice, parsley and pepper flakes. Top with parmesan.',
    prepTime: 20,
    difficulty: 'Easy',
  },
  {
    title: 'Greek Salad',
    ingredients: ['cucumber', 'tomato', 'red onion', 'feta cheese', 'kalamata olives', 'olive oil', 'oregano'],
    instructions: 'Chop cucumber and tomato into chunks. Thinly slice red onion. Combine with olives and feta block. Drizzle with olive oil and generous amount of dried oregano.',
    prepTime: 10,
    difficulty: 'Easy',
  },
  {
    title: 'Chicken Tikka Masala',
    ingredients: ['chicken breast', 'yogurt', 'tomato sauce', 'heavy cream', 'onion', 'garlic', 'ginger', 'garam masala', 'cumin', 'paprika', 'rice'],
    instructions: 'Marinate chicken in yogurt and spices 30 min. Grill or broil until charred. Make sauce: sauté onion, garlic, ginger, spices, tomatoes and cream. Add chicken. Serve with rice.',
    prepTime: 50,
    difficulty: 'Hard',
  },
  {
    title: 'Classic Chili',
    ingredients: ['ground beef', 'kidney beans', 'tomato', 'onion', 'garlic', 'chili powder', 'cumin', 'beef broth'],
    instructions: 'Brown beef. Sauté onion and garlic. Add chili powder and cumin, toast 1 min. Add tomatoes, beans and broth. Simmer uncovered 45 min, stirring occasionally.',
    prepTime: 60,
    difficulty: 'Medium',
  },
  {
    title: 'Teriyaki Chicken Bowl',
    ingredients: ['chicken thigh', 'soy sauce', 'honey', 'garlic', 'ginger', 'sesame seeds', 'rice', 'broccoli'],
    instructions: 'Mix soy, honey, garlic and ginger for teriyaki sauce. Pan fry chicken thighs 5 min per side. Glaze with sauce and reduce. Serve over rice with steamed broccoli and sesame seeds.',
    prepTime: 30,
    difficulty: 'Medium',
  },
  {
    title: 'Pesto Pasta',
    ingredients: ['pasta', 'basil', 'pine nuts', 'parmesan', 'garlic', 'olive oil', 'lemon juice'],
    instructions: 'Blend basil, pine nuts, parmesan and garlic while drizzling in olive oil until smooth. Cook pasta, reserve 1/2 cup pasta water. Toss pasta with pesto, adding pasta water to loosen. Finish with lemon.',
    prepTime: 20,
    difficulty: 'Easy',
  },
  {
    title: 'Beef Stew',
    ingredients: ['beef chuck', 'potato', 'carrot', 'onion', 'garlic', 'beef broth', 'tomato paste', 'thyme'],
    instructions: 'Cut beef into 2-inch cubes, season and brown in batches. Sauté onion and garlic. Add tomato paste, broth, thyme, potatoes and carrots. Simmer covered 2 hours until tender.',
    prepTime: 130,
    difficulty: 'Hard',
  },
  {
    title: 'Banana Pancakes',
    ingredients: ['banana', 'egg', 'flour', 'milk', 'baking powder', 'butter', 'maple syrup'],
    instructions: 'Mash ripe banana. Whisk with egg, milk, flour and baking powder until smooth. Cook on buttered pan over medium heat, 2 min per side. Stack and serve with maple syrup.',
    prepTime: 15,
    difficulty: 'Easy',
  },
  {
    title: 'Overnight Oats',
    ingredients: ['oats', 'milk', 'yogurt', 'honey', 'banana', 'chia seeds', 'blueberries'],
    instructions: 'Combine oats, milk, yogurt, honey and chia seeds in a jar. Stir well and refrigerate overnight. In the morning top with sliced banana and fresh blueberries.',
    prepTime: 5,
    difficulty: 'Easy',
  },
  {
    title: 'Lentil Soup',
    ingredients: ['red lentils', 'onion', 'garlic', 'carrot', 'cumin', 'turmeric', 'vegetable broth', 'lemon'],
    instructions: 'Sauté onion, garlic and carrot. Add cumin and turmeric, toast 1 min. Add rinsed lentils and broth. Simmer 25 min until lentils break down. Blend partially. Squeeze lemon before serving.',
    prepTime: 35,
    difficulty: 'Easy',
  },
  {
    title: 'Fried Rice',
    ingredients: ['rice', 'egg', 'soy sauce', 'green onion', 'garlic', 'sesame oil', 'frozen peas', 'carrot'],
    instructions: 'Use cold day-old rice for best results. Stir fry garlic, carrot and peas over high heat. Push aside and scramble eggs. Add rice and soy sauce, toss together. Finish with sesame oil and green onion.',
    prepTime: 15,
    difficulty: 'Easy',
  },
  {
    title: 'Sweet Potato Curry',
    ingredients: ['sweet potato', 'coconut milk', 'onion', 'garlic', 'ginger', 'curry powder', 'spinach', 'rice'],
    instructions: 'Sauté onion, garlic and ginger. Add curry powder and cubed sweet potato. Pour in coconut milk and simmer 20 min until potato is tender. Stir in spinach until wilted. Serve with rice.',
    prepTime: 35,
    difficulty: 'Medium',
  },
  {
    title: 'Caprese Salad',
    ingredients: ['tomato', 'mozzarella', 'basil', 'olive oil', 'balsamic glaze', 'salt', 'black pepper'],
    instructions: 'Slice tomatoes and fresh mozzarella to equal thickness. Alternate slices on a plate with basil leaves. Drizzle generously with olive oil and balsamic glaze. Season with flaky salt and pepper.',
    prepTime: 10,
    difficulty: 'Easy',
  },
  {
    title: 'Chicken Quesadillas',
    ingredients: ['chicken breast', 'tortilla', 'cheddar cheese', 'bell pepper', 'onion', 'sour cream', 'salsa'],
    instructions: 'Season and cook chicken, slice thin. Sauté peppers and onion. Layer chicken, vegetables and cheddar on half a tortilla. Fold and pan fry 2 min per side until golden. Serve with sour cream and salsa.',
    prepTime: 25,
    difficulty: 'Easy',
  },
  {
    title: 'French Omelette',
    ingredients: ['egg', 'butter', 'salt', 'black pepper', 'chives', 'gruyere cheese'],
    instructions: 'Beat 3 eggs with salt until uniform. Melt butter over medium-low heat. Add eggs and move continuously with spatula creating small curds. When almost set, add gruyere and roll omelette onto plate. Top with chives.',
    prepTime: 10,
    difficulty: 'Medium',
  },
  {
    title: 'Black Bean Soup',
    ingredients: ['black beans', 'onion', 'garlic', 'cumin', 'vegetable broth', 'lime', 'cilantro'],
    instructions: 'Sauté onion and garlic with cumin until fragrant. Add beans and broth. Simmer 20 min. Blend one third of the soup and stir back in for a creamy yet chunky texture. Top with lime and cilantro.',
    prepTime: 30,
    difficulty: 'Easy',
  },
  {
    title: 'Tomato Basil Soup',
    ingredients: ['tomato', 'onion', 'garlic', 'vegetable broth', 'cream', 'olive oil', 'basil'],
    instructions: 'Roast tomatoes and garlic at 400°F for 25 min. Sauté onion in olive oil. Blend roasted tomatoes with onion and broth until smooth. Stir in cream and torn basil. Season well.',
    prepTime: 45,
    difficulty: 'Medium',
  },
  {
    title: 'Veggie Burger',
    ingredients: ['black beans', 'oats', 'onion', 'garlic', 'cumin', 'paprika', 'egg', 'burger bun', 'lettuce', 'tomato'],
    instructions: 'Drain and mash black beans until mostly smooth. Mix in oats, finely diced onion, garlic, spices and egg. Form into 4 patties and refrigerate 30 min. Pan fry 4 min per side. Serve in bun with toppings.',
    prepTime: 30,
    difficulty: 'Medium',
  },
  {
    title: 'Spinach and Feta Omelette',
    ingredients: ['egg', 'spinach', 'feta cheese', 'garlic', 'olive oil', 'salt', 'black pepper'],
    instructions: 'Sauté spinach with garlic in olive oil until wilted, about 2 min. Beat eggs with salt and pepper. Pour eggs over spinach. Cook on medium-low until edges set. Crumble feta on top, fold and serve.',
    prepTime: 10,
    difficulty: 'Easy',
  },
  {
    title: 'Turkey Meatballs in Tomato Sauce',
    ingredients: ['ground turkey', 'breadcrumbs', 'egg', 'garlic', 'parsley', 'parmesan', 'salt', 'tomato sauce'],
    instructions: 'Mix turkey with breadcrumbs, egg, minced garlic, parsley and parmesan. Roll into 1.5-inch balls. Bake at 400°F for 18 min. Simmer in tomato sauce for 10 min to finish.',
    prepTime: 35,
    difficulty: 'Medium',
  },
  {
    title: 'Chicken Noodle Soup',
    ingredients: ['chicken breast', 'egg noodles', 'carrot', 'celery', 'onion', 'garlic', 'chicken broth', 'thyme', 'parsley'],
    instructions: 'Simmer chicken breast in broth with onion, carrot, celery, garlic and thyme for 20 min. Remove and shred chicken. Add egg noodles and cook 8 min. Return chicken. Finish with fresh parsley.',
    prepTime: 45,
    difficulty: 'Easy',
  },
];

// ─── Demo Users with Realistic Pantries ──────────────────────────────────────

const demoUsers = [
  {
    name: 'Maria Garcia',
    email: 'maria@demo.com',
    password: 'demo1234',
    // Busy parent — family staples, produce nearing expiry
    inventory: [
      { name: 'chicken breast', quantity: 2, unit: 'lbs', category: 'Meat', daysUntilExpiry: 2 },
      { name: 'ground beef', quantity: 1, unit: 'lbs', category: 'Meat', daysUntilExpiry: 3 },
      { name: 'egg', quantity: 12, unit: 'count', category: 'Dairy', daysUntilExpiry: 14 },
      { name: 'milk', quantity: 2, unit: 'cups', category: 'Dairy', daysUntilExpiry: 5 },
      { name: 'cheddar cheese', quantity: 1, unit: 'cups', category: 'Dairy', daysUntilExpiry: 10 },
      { name: 'butter', quantity: 4, unit: 'tbsp', category: 'Dairy', daysUntilExpiry: 30 },
      { name: 'onion', quantity: 3, unit: 'count', category: 'Produce', daysUntilExpiry: 14 },
      { name: 'garlic', quantity: 6, unit: 'cloves', category: 'Produce', daysUntilExpiry: 21 },
      { name: 'tomato', quantity: 4, unit: 'count', category: 'Produce', daysUntilExpiry: 3 },
      { name: 'carrot', quantity: 5, unit: 'count', category: 'Produce', daysUntilExpiry: 7 },
      { name: 'broccoli', quantity: 1, unit: 'heads', category: 'Produce', daysUntilExpiry: 4 },
      { name: 'spinach', quantity: 2, unit: 'cups', category: 'Produce', daysUntilExpiry: 2 },
      { name: 'spaghetti', quantity: 16, unit: 'oz', category: 'Pantry', daysUntilExpiry: null },
      { name: 'rice', quantity: 3, unit: 'cups', category: 'Pantry', daysUntilExpiry: null },
      { name: 'tomato sauce', quantity: 2, unit: 'cups', category: 'Pantry', daysUntilExpiry: null },
      { name: 'olive oil', quantity: 8, unit: 'tbsp', category: 'Pantry', daysUntilExpiry: null },
      { name: 'chicken broth', quantity: 4, unit: 'cups', category: 'Pantry', daysUntilExpiry: null },
      { name: 'cumin', quantity: 3, unit: 'tsp', category: 'Spices', daysUntilExpiry: null },
      { name: 'paprika', quantity: 3, unit: 'tsp', category: 'Spices', daysUntilExpiry: null },
      { name: 'salt', quantity: 10, unit: 'tsp', category: 'Spices', daysUntilExpiry: null },
      { name: 'black pepper', quantity: 5, unit: 'tsp', category: 'Spices', daysUntilExpiry: null },
    ],
  },
  {
    name: 'Dev Patel',
    email: 'dev@demo.com',
    password: 'demo1234',
    // College student — cheap staples, limited fresh produce
    inventory: [
      { name: 'egg', quantity: 6, unit: 'count', category: 'Dairy', daysUntilExpiry: 10 },
      { name: 'milk', quantity: 1, unit: 'cups', category: 'Dairy', daysUntilExpiry: 4 },
      { name: 'butter', quantity: 2, unit: 'tbsp', category: 'Dairy', daysUntilExpiry: 21 },
      { name: 'banana', quantity: 3, unit: 'count', category: 'Produce', daysUntilExpiry: 3 },
      { name: 'onion', quantity: 2, unit: 'count', category: 'Produce', daysUntilExpiry: 10 },
      { name: 'garlic', quantity: 4, unit: 'cloves', category: 'Produce', daysUntilExpiry: 14 },
      { name: 'rice', quantity: 4, unit: 'cups', category: 'Pantry', daysUntilExpiry: null },
      { name: 'pasta', quantity: 12, unit: 'oz', category: 'Pantry', daysUntilExpiry: null },
      { name: 'oats', quantity: 3, unit: 'cups', category: 'Pantry', daysUntilExpiry: null },
      { name: 'soy sauce', quantity: 4, unit: 'tbsp', category: 'Pantry', daysUntilExpiry: null },
      { name: 'olive oil', quantity: 4, unit: 'tbsp', category: 'Pantry', daysUntilExpiry: null },
      { name: 'black beans', quantity: 2, unit: 'cans', category: 'Pantry', daysUntilExpiry: null },
      { name: 'tuna', quantity: 3, unit: 'cans', category: 'Pantry', daysUntilExpiry: null },
      { name: 'honey', quantity: 3, unit: 'tbsp', category: 'Pantry', daysUntilExpiry: null },
      { name: 'flour', quantity: 2, unit: 'cups', category: 'Pantry', daysUntilExpiry: null },
      { name: 'cumin', quantity: 2, unit: 'tsp', category: 'Spices', daysUntilExpiry: null },
      { name: 'salt', quantity: 8, unit: 'tsp', category: 'Spices', daysUntilExpiry: null },
      { name: 'black pepper', quantity: 4, unit: 'tsp', category: 'Spices', daysUntilExpiry: null },
    ],
  },
  {
    name: 'Taylor Kim',
    email: 'taylor@demo.com',
    password: 'demo1234',
    // Meal prep enthusiast — bulk ingredients, lots of variety, fresh produce
    inventory: [
      { name: 'chicken breast', quantity: 4, unit: 'lbs', category: 'Meat', daysUntilExpiry: 5 },
      { name: 'chicken thigh', quantity: 2, unit: 'lbs', category: 'Meat', daysUntilExpiry: 4 },
      { name: 'salmon', quantity: 1.5, unit: 'lbs', category: 'Seafood', daysUntilExpiry: 2 },
      { name: 'egg', quantity: 18, unit: 'count', category: 'Dairy', daysUntilExpiry: 21 },
      { name: 'greek yogurt', quantity: 3, unit: 'cups', category: 'Dairy', daysUntilExpiry: 7 },
      { name: 'parmesan', quantity: 1, unit: 'cups', category: 'Dairy', daysUntilExpiry: 14 },
      { name: 'feta cheese', quantity: 0.5, unit: 'cups', category: 'Dairy', daysUntilExpiry: 7 },
      { name: 'broccoli', quantity: 2, unit: 'heads', category: 'Produce', daysUntilExpiry: 5 },
      { name: 'sweet potato', quantity: 4, unit: 'count', category: 'Produce', daysUntilExpiry: 14 },
      { name: 'spinach', quantity: 4, unit: 'cups', category: 'Produce', daysUntilExpiry: 4 },
      { name: 'bell pepper', quantity: 3, unit: 'count', category: 'Produce', daysUntilExpiry: 6 },
      { name: 'lemon', quantity: 4, unit: 'count', category: 'Produce', daysUntilExpiry: 14 },
      { name: 'garlic', quantity: 10, unit: 'cloves', category: 'Produce', daysUntilExpiry: 21 },
      { name: 'onion', quantity: 4, unit: 'count', category: 'Produce', daysUntilExpiry: 14 },
      { name: 'rice', quantity: 5, unit: 'cups', category: 'Pantry', daysUntilExpiry: null },
      { name: 'olive oil', quantity: 12, unit: 'tbsp', category: 'Pantry', daysUntilExpiry: null },
      { name: 'soy sauce', quantity: 6, unit: 'tbsp', category: 'Pantry', daysUntilExpiry: null },
      { name: 'coconut milk', quantity: 2, unit: 'cans', category: 'Pantry', daysUntilExpiry: null },
      { name: 'chickpeas', quantity: 2, unit: 'cans', category: 'Pantry', daysUntilExpiry: null },
      { name: 'honey', quantity: 5, unit: 'tbsp', category: 'Pantry', daysUntilExpiry: null },
      { name: 'sesame oil', quantity: 3, unit: 'tbsp', category: 'Pantry', daysUntilExpiry: null },
      { name: 'curry powder', quantity: 4, unit: 'tsp', category: 'Spices', daysUntilExpiry: null },
      { name: 'cumin', quantity: 4, unit: 'tsp', category: 'Spices', daysUntilExpiry: null },
      { name: 'paprika', quantity: 4, unit: 'tsp', category: 'Spices', daysUntilExpiry: null },
      { name: 'ginger', quantity: 3, unit: 'tsp', category: 'Spices', daysUntilExpiry: null },
      { name: 'salt', quantity: 10, unit: 'tsp', category: 'Spices', daysUntilExpiry: null },
      { name: 'black pepper', quantity: 6, unit: 'tsp', category: 'Spices', daysUntilExpiry: null },
    ],
  },
];

// ─── Helper ───────────────────────────────────────────────────────────────────

function expiryDate(daysFromNow) {
  if (daysFromNow === null) return null;
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d;
}

// ─── Seed ─────────────────────────────────────────────────────────────────────

async function seed() {
  try {
    await client.connect();
    const db = client.db('recipeRoulette');

    // ── Clear all collections ──
    await Promise.all([
      db.collection('recipes').deleteMany({}),
      db.collection('inventory').deleteMany({}),
      db.collection('users').deleteMany({}),
      db.collection('favorites').deleteMany({}),
    ]);
    console.log('🗑️  Cleared all collections');

    // ── Seed global recipes (no userId) ──
    const recipeDocs = recipes.map((r) => ({ ...r, createdAt: new Date() }));
    await db.collection('recipes').insertMany(recipeDocs);
    console.log(`✅ Inserted ${recipeDocs.length} global recipes`);

    // ── Seed demo users + their inventory ──
    let totalInventory = 0;

    for (const user of demoUsers) {
      // Hash password
      const hashedPassword = await bcrypt.hash(user.password, 10);
      const userDoc = {
        name: user.name,
        email: user.email,
        password: hashedPassword,
        createdAt: new Date(),
      };

      const userResult = await db.collection('users').insertOne(userDoc);
      const userId = userResult.insertedId.toString();
      console.log(`👤 Created user: ${user.name} (${user.email})`);

      // Seed their inventory
      const inventoryDocs = user.inventory.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        unit: item.unit,
        category: item.category,
        expirationDate: expiryDate(item.daysUntilExpiry),
        userId,
        addedAt: new Date(),
      }));

      await db.collection('inventory').insertMany(inventoryDocs);
      totalInventory += inventoryDocs.length;
      console.log(`   🧺 Seeded ${inventoryDocs.length} inventory items`);
    }

    // ── Summary ──
    const total =
      recipeDocs.length + totalInventory + demoUsers.length;
    console.log('─────────────────────────────────────');
    console.log(`🎉 Seed complete!`);
    console.log(`   📖 Recipes:   ${recipeDocs.length}`);
    console.log(`   👤 Users:     ${demoUsers.length}`);
    console.log(`   🧺 Inventory: ${totalInventory} items across ${demoUsers.length} users`);
    console.log(`   📦 Total:     ${total} documents`);
    console.log('─────────────────────────────────────');
    console.log('Demo login credentials:');
    demoUsers.forEach((u) => {
      console.log(`   ${u.email} / demo1234`);
    });
  } catch (err) {
    console.error('❌ Seed failed:', err);
  } finally {
    await client.close();
  }
}

seed();