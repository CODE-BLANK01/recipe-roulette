import { MongoClient } from 'mongodb';
import 'dotenv/config';

const client = new MongoClient(process.env.MONGODB_URI);

// ─── Recipe Templates ────────────────────────────────────────────────────────

const recipes = [
  {
    title: 'Classic Spaghetti Bolognese',
    ingredients: ['spaghetti', 'ground beef', 'tomato sauce', 'onion', 'garlic', 'olive oil', 'parmesan'],
    instructions: 'Brown beef with onion and garlic. Add tomato sauce and simmer 20 min. Cook spaghetti, combine, top with parmesan.',
    prepTime: 30,
    difficulty: 'Easy',
    favorite: false,
  },
  {
    title: 'Chicken Stir Fry',
    ingredients: ['chicken breast', 'broccoli', 'soy sauce', 'garlic', 'ginger', 'sesame oil', 'rice'],
    instructions: 'Slice chicken, stir fry with garlic and ginger. Add broccoli and soy sauce. Serve over rice.',
    prepTime: 20,
    difficulty: 'Easy',
    favorite: false,
  },
  {
    title: 'Vegetable Curry',
    ingredients: ['chickpeas', 'coconut milk', 'tomato', 'onion', 'garlic', 'curry powder', 'rice'],
    instructions: 'Sauté onion and garlic. Add curry powder, tomatoes, chickpeas, coconut milk. Simmer 25 min. Serve with rice.',
    prepTime: 35,
    difficulty: 'Medium',
    favorite: false,
  },
  {
    title: 'Avocado Toast',
    ingredients: ['bread', 'avocado', 'lemon juice', 'salt', 'red pepper flakes', 'egg'],
    instructions: 'Toast bread. Mash avocado with lemon and salt. Spread on toast, top with fried egg and pepper flakes.',
    prepTime: 10,
    difficulty: 'Easy',
    favorite: false,
  },
  {
    title: 'Beef Tacos',
    ingredients: ['ground beef', 'taco shells', 'cheddar cheese', 'lettuce', 'tomato', 'sour cream', 'taco seasoning'],
    instructions: 'Brown beef with taco seasoning. Fill shells with beef, cheese, lettuce, tomato and sour cream.',
    prepTime: 20,
    difficulty: 'Easy',
    favorite: false,
  },
  {
    title: 'Mushroom Risotto',
    ingredients: ['arborio rice', 'mushrooms', 'onion', 'garlic', 'white wine', 'parmesan', 'butter', 'vegetable broth'],
    instructions: 'Sauté onion and mushrooms. Add rice, toast briefly. Add wine then broth ladle by ladle, stirring constantly. Finish with butter and parmesan.',
    prepTime: 45,
    difficulty: 'Hard',
    favorite: false,
  },
  {
    title: 'Caesar Salad',
    ingredients: ['romaine lettuce', 'parmesan', 'croutons', 'caesar dressing', 'lemon juice', 'black pepper'],
    instructions: 'Chop romaine. Toss with dressing, parmesan, croutons, lemon juice and black pepper.',
    prepTime: 10,
    difficulty: 'Easy',
    favorite: false,
  },
  {
    title: 'Banana Pancakes',
    ingredients: ['banana', 'egg', 'flour', 'milk', 'baking powder', 'butter', 'maple syrup'],
    instructions: 'Mash banana, mix with egg, flour, milk and baking powder. Cook on buttered pan. Serve with maple syrup.',
    prepTime: 15,
    difficulty: 'Easy',
    favorite: false,
  },
  {
    title: 'Tomato Soup',
    ingredients: ['tomato', 'onion', 'garlic', 'vegetable broth', 'cream', 'olive oil', 'basil'],
    instructions: 'Roast tomatoes. Sauté onion and garlic. Blend together with broth. Stir in cream and basil.',
    prepTime: 40,
    difficulty: 'Medium',
    favorite: false,
  },
  {
    title: 'Greek Salad',
    ingredients: ['cucumber', 'tomato', 'red onion', 'feta cheese', 'kalamata olives', 'olive oil', 'oregano'],
    instructions: 'Chop vegetables. Combine with olives and feta. Drizzle with olive oil and sprinkle oregano.',
    prepTime: 10,
    difficulty: 'Easy',
    favorite: false,
  },
  {
    title: 'Lemon Garlic Salmon',
    ingredients: ['salmon', 'lemon', 'garlic', 'butter', 'dill', 'salt', 'black pepper'],
    instructions: 'Season salmon with salt and pepper. Pan sear in butter with garlic. Finish with lemon juice and dill.',
    prepTime: 20,
    difficulty: 'Medium',
    favorite: false,
  },
  {
    title: 'Fried Rice',
    ingredients: ['rice', 'egg', 'soy sauce', 'green onion', 'garlic', 'sesame oil', 'frozen peas', 'carrot'],
    instructions: 'Use day-old rice. Stir fry with garlic, add scrambled egg, peas, carrots. Season with soy sauce and sesame oil.',
    prepTime: 15,
    difficulty: 'Easy',
    favorite: false,
  },
  {
    title: 'Margherita Pizza',
    ingredients: ['pizza dough', 'tomato sauce', 'mozzarella', 'basil', 'olive oil', 'salt'],
    instructions: 'Stretch dough, spread sauce, top with mozzarella. Bake at 475°F for 12 min. Top with fresh basil.',
    prepTime: 25,
    difficulty: 'Medium',
    favorite: false,
  },
  {
    title: 'Black Bean Soup',
    ingredients: ['black beans', 'onion', 'garlic', 'cumin', 'vegetable broth', 'lime', 'cilantro'],
    instructions: 'Sauté onion and garlic with cumin. Add beans and broth. Simmer 20 min. Blend partially. Top with lime and cilantro.',
    prepTime: 30,
    difficulty: 'Easy',
    favorite: false,
  },
  {
    title: 'Shakshuka',
    ingredients: ['egg', 'tomato', 'onion', 'garlic', 'bell pepper', 'cumin', 'paprika', 'feta cheese'],
    instructions: 'Sauté onion, garlic, peppers. Add spices and tomatoes. Simmer, crack eggs in, cover until set. Top with feta.',
    prepTime: 25,
    difficulty: 'Medium',
    favorite: false,
  },
  {
    title: 'Mac and Cheese',
    ingredients: ['macaroni', 'cheddar cheese', 'milk', 'butter', 'flour', 'salt', 'black pepper', 'mustard powder'],
    instructions: 'Cook pasta. Make roux with butter and flour. Add milk and cheese to make sauce. Combine with pasta.',
    prepTime: 30,
    difficulty: 'Medium',
    favorite: false,
  },
  {
    title: 'Chicken Quesadillas',
    ingredients: ['chicken breast', 'tortilla', 'cheddar cheese', 'bell pepper', 'onion', 'sour cream', 'salsa'],
    instructions: 'Cook chicken with peppers and onion. Fill tortillas with chicken and cheese. Pan fry until golden. Serve with sour cream and salsa.',
    prepTime: 25,
    difficulty: 'Easy',
    favorite: false,
  },
  {
    title: 'Overnight Oats',
    ingredients: ['oats', 'milk', 'yogurt', 'honey', 'banana', 'chia seeds', 'blueberries'],
    instructions: 'Mix oats, milk, yogurt, honey and chia seeds. Refrigerate overnight. Top with banana and blueberries.',
    prepTime: 5,
    difficulty: 'Easy',
    favorite: false,
  },
  {
    title: 'Lentil Soup',
    ingredients: ['red lentils', 'onion', 'garlic', 'carrot', 'cumin', 'turmeric', 'vegetable broth', 'lemon'],
    instructions: 'Sauté onion, garlic, carrot. Add spices, lentils, broth. Simmer 25 min. Blend partially. Finish with lemon.',
    prepTime: 35,
    difficulty: 'Easy',
    favorite: false,
  },
  {
    title: 'BLT Sandwich',
    ingredients: ['bread', 'bacon', 'lettuce', 'tomato', 'mayonnaise', 'salt', 'black pepper'],
    instructions: 'Cook bacon until crispy. Toast bread. Spread mayo, layer bacon, lettuce and tomato. Season and serve.',
    prepTime: 15,
    difficulty: 'Easy',
    favorite: false,
  },
  {
    title: 'Pesto Pasta',
    ingredients: ['pasta', 'basil', 'pine nuts', 'parmesan', 'garlic', 'olive oil', 'lemon juice'],
    instructions: 'Blend basil, pine nuts, parmesan, garlic and olive oil into pesto. Cook pasta, toss with pesto and lemon juice.',
    prepTime: 20,
    difficulty: 'Easy',
    favorite: false,
  },
  {
    title: 'Beef Stew',
    ingredients: ['beef chuck', 'potato', 'carrot', 'onion', 'garlic', 'beef broth', 'tomato paste', 'thyme'],
    instructions: 'Brown beef. Sauté vegetables. Add broth, tomato paste and thyme. Simmer low and slow for 2 hours.',
    prepTime: 120,
    difficulty: 'Hard',
    favorite: false,
  },
  {
    title: 'Caprese Salad',
    ingredients: ['tomato', 'mozzarella', 'basil', 'olive oil', 'balsamic glaze', 'salt', 'black pepper'],
    instructions: 'Slice tomatoes and mozzarella. Alternate slices on plate with basil. Drizzle with olive oil and balsamic.',
    prepTime: 10,
    difficulty: 'Easy',
    favorite: false,
  },
  {
    title: 'Egg Fried Noodles',
    ingredients: ['noodles', 'egg', 'soy sauce', 'garlic', 'green onion', 'sesame oil', 'cabbage'],
    instructions: 'Cook noodles. Stir fry garlic and cabbage. Add noodles, push aside, scramble egg. Combine with soy sauce and sesame oil.',
    prepTime: 15,
    difficulty: 'Easy',
    favorite: false,
  },
  {
    title: 'Stuffed Bell Peppers',
    ingredients: ['bell pepper', 'ground beef', 'rice', 'tomato sauce', 'onion', 'garlic', 'cheddar cheese'],
    instructions: 'Halve peppers. Mix cooked rice, browned beef, onion, garlic and tomato sauce. Fill peppers, top with cheese. Bake 35 min at 375°F.',
    prepTime: 55,
    difficulty: 'Medium',
    favorite: false,
  },
  {
    title: 'French Omelette',
    ingredients: ['egg', 'butter', 'salt', 'black pepper', 'chives', 'gruyere cheese'],
    instructions: 'Beat eggs. Melt butter in pan over medium heat. Add eggs, gently move with spatula. Add cheese, fold and serve.',
    prepTime: 10,
    difficulty: 'Medium',
    favorite: false,
  },
  {
    title: 'Tuna Pasta Salad',
    ingredients: ['pasta', 'tuna', 'mayonnaise', 'celery', 'red onion', 'lemon juice', 'black pepper'],
    instructions: 'Cook and cool pasta. Mix with drained tuna, mayo, celery, red onion and lemon juice. Season and chill.',
    prepTime: 20,
    difficulty: 'Easy',
    favorite: false,
  },
  {
    title: 'Garlic Butter Shrimp',
    ingredients: ['shrimp', 'butter', 'garlic', 'lemon', 'parsley', 'red pepper flakes', 'salt'],
    instructions: 'Melt butter, sauté garlic. Add shrimp and cook 2 min per side. Finish with lemon, parsley and pepper flakes.',
    prepTime: 15,
    difficulty: 'Easy',
    favorite: false,
  },
  {
    title: 'Sweet Potato Curry',
    ingredients: ['sweet potato', 'coconut milk', 'onion', 'garlic', 'ginger', 'curry powder', 'spinach', 'rice'],
    instructions: 'Sauté onion, garlic, ginger. Add curry powder and sweet potato. Pour in coconut milk, simmer 20 min. Stir in spinach.',
    prepTime: 35,
    difficulty: 'Medium',
    favorite: false,
  },
  {
    title: 'Classic Chili',
    ingredients: ['ground beef', 'kidney beans', 'tomato', 'onion', 'garlic', 'chili powder', 'cumin', 'beef broth'],
    instructions: 'Brown beef. Sauté onion and garlic. Add all remaining ingredients. Simmer uncovered 45 minutes.',
    prepTime: 60,
    difficulty: 'Medium',
    favorite: false,
  },
  {
    title: 'Hummus & Veggie Wrap',
    ingredients: ['tortilla', 'hummus', 'cucumber', 'tomato', 'spinach', 'red onion', 'feta cheese'],
    instructions: 'Spread hummus on tortilla. Layer vegetables and feta. Roll tightly and slice.',
    prepTime: 10,
    difficulty: 'Easy',
    favorite: false,
  },
  {
    title: 'Teriyaki Chicken',
    ingredients: ['chicken thigh', 'soy sauce', 'honey', 'garlic', 'ginger', 'sesame seeds', 'rice'],
    instructions: 'Marinate chicken in soy, honey, garlic and ginger. Pan fry until cooked. Glaze with remaining marinade. Serve on rice with sesame seeds.',
    prepTime: 30,
    difficulty: 'Medium',
    favorite: false,
  },
  {
    title: 'Minestrone Soup',
    ingredients: ['pasta', 'kidney beans', 'tomato', 'zucchini', 'carrot', 'celery', 'onion', 'vegetable broth', 'parmesan'],
    instructions: 'Sauté vegetables. Add broth, tomatoes and beans. Simmer 20 min. Add pasta and cook through. Top with parmesan.',
    prepTime: 45,
    difficulty: 'Medium',
    favorite: false,
  },
  {
    title: 'Cottage Cheese Bowl',
    ingredients: ['cottage cheese', 'blueberries', 'honey', 'granola', 'banana'],
    instructions: 'Scoop cottage cheese into bowl. Top with blueberries, banana slices, granola and a drizzle of honey.',
    prepTime: 5,
    difficulty: 'Easy',
    favorite: false,
  },
  {
    title: 'Sausage and Veggie Sheet Pan',
    ingredients: ['sausage', 'bell pepper', 'zucchini', 'red onion', 'olive oil', 'garlic powder', 'Italian seasoning'],
    instructions: 'Slice sausage and vegetables. Toss with olive oil and seasoning. Spread on sheet pan. Roast at 400°F for 25 min.',
    prepTime: 35,
    difficulty: 'Easy',
    favorite: false,
  },
  {
    title: 'French Toast',
    ingredients: ['bread', 'egg', 'milk', 'cinnamon', 'vanilla extract', 'butter', 'maple syrup'],
    instructions: 'Whisk egg, milk, cinnamon and vanilla. Dip bread. Cook in buttered pan until golden each side. Serve with maple syrup.',
    prepTime: 15,
    difficulty: 'Easy',
    favorite: false,
  },
  {
    title: 'Roasted Veggie Bowl',
    ingredients: ['sweet potato', 'broccoli', 'chickpeas', 'olive oil', 'garlic powder', 'paprika', 'tahini', 'lemon'],
    instructions: 'Toss veggies and chickpeas with oil and spices. Roast at 425°F for 30 min. Drizzle with tahini-lemon dressing.',
    prepTime: 40,
    difficulty: 'Easy',
    favorite: false,
  },
  {
    title: 'Clam Chowder',
    ingredients: ['clams', 'potato', 'onion', 'celery', 'bacon', 'cream', 'butter', 'flour', 'vegetable broth'],
    instructions: 'Cook bacon, sauté onion and celery. Make roux. Add broth, potatoes, clams. Stir in cream. Simmer until thick.',
    prepTime: 45,
    difficulty: 'Hard',
    favorite: false,
  },
  {
    title: 'Veggie Burger',
    ingredients: ['black beans', 'oats', 'onion', 'garlic', 'cumin', 'paprika', 'egg', 'burger bun', 'lettuce', 'tomato'],
    instructions: 'Mash beans, mix with oats, onion, garlic, spices and egg. Form patties. Pan fry 4 min each side. Serve in bun.',
    prepTime: 25,
    difficulty: 'Medium',
    favorite: false,
  },
  {
    title: 'Miso Soup',
    ingredients: ['miso paste', 'tofu', 'green onion', 'seaweed', 'dashi', 'water'],
    instructions: 'Heat dashi and water. Dissolve miso paste in broth. Add tofu and seaweed. Garnish with green onion.',
    prepTime: 10,
    difficulty: 'Easy',
    favorite: false,
  },
  {
    title: 'Pulled Pork Tacos',
    ingredients: ['pork shoulder', 'taco shells', 'coleslaw', 'lime', 'cumin', 'chili powder', 'garlic', 'onion'],
    instructions: 'Slow cook pork with spices 8 hours. Shred. Serve in taco shells with coleslaw and lime.',
    prepTime: 490,
    difficulty: 'Hard',
    favorite: false,
  },
  {
    title: 'Spinach and Feta Omelette',
    ingredients: ['egg', 'spinach', 'feta cheese', 'garlic', 'olive oil', 'salt', 'black pepper'],
    instructions: 'Sauté spinach with garlic. Beat eggs and pour over. Add feta. Fold when set.',
    prepTime: 10,
    difficulty: 'Easy',
    favorite: false,
  },
  {
    title: 'Corn Chowder',
    ingredients: ['corn', 'potato', 'onion', 'garlic', 'cream', 'vegetable broth', 'butter', 'thyme'],
    instructions: 'Sauté onion and garlic. Add potatoes, broth and corn. Simmer 20 min. Stir in cream and thyme.',
    prepTime: 35,
    difficulty: 'Medium',
    favorite: false,
  },
  {
    title: 'Turkey Meatballs',
    ingredients: ['ground turkey', 'breadcrumbs', 'egg', 'garlic', 'parsley', 'parmesan', 'salt', 'tomato sauce'],
    instructions: 'Mix turkey with breadcrumbs, egg, garlic, parsley and parmesan. Form balls. Bake at 400°F for 20 min. Serve with tomato sauce.',
    prepTime: 30,
    difficulty: 'Medium',
    favorite: false,
  },
  {
    title: 'Baked Potato',
    ingredients: ['potato', 'butter', 'sour cream', 'cheddar cheese', 'bacon', 'chives', 'salt'],
    instructions: 'Pierce potato, rub with olive oil and salt. Bake at 400°F for 1 hour. Top with butter, sour cream, cheese, bacon and chives.',
    prepTime: 65,
    difficulty: 'Easy',
    favorite: false,
  },
  {
    title: 'Chicken Noodle Soup',
    ingredients: ['chicken breast', 'egg noodles', 'carrot', 'celery', 'onion', 'garlic', 'chicken broth', 'thyme', 'parsley'],
    instructions: 'Simmer chicken in broth with vegetables. Remove and shred chicken. Add noodles and cook through. Return chicken.',
    prepTime: 45,
    difficulty: 'Easy',
    favorite: false,
  },
  {
    title: 'Bruschetta',
    ingredients: ['baguette', 'tomato', 'garlic', 'basil', 'olive oil', 'balsamic glaze', 'salt'],
    instructions: 'Toast baguette slices. Rub with garlic. Top with diced tomatoes, basil and olive oil. Drizzle balsamic.',
    prepTime: 15,
    difficulty: 'Easy',
    favorite: false,
  },
  {
    title: 'Cauliflower Fried Rice',
    ingredients: ['cauliflower', 'egg', 'soy sauce', 'garlic', 'green onion', 'frozen peas', 'sesame oil', 'carrot'],
    instructions: 'Pulse cauliflower into rice-size pieces. Stir fry with garlic, add egg, peas, carrots. Season with soy sauce and sesame oil.',
    prepTime: 20,
    difficulty: 'Easy',
    favorite: false,
  },
];

// ─── Inventory Templates ─────────────────────────────────────────────────────

const inventoryTemplates = [
  { name: 'chicken breast', unit: 'lbs', category: 'Meat' },
  { name: 'ground beef', unit: 'lbs', category: 'Meat' },
  { name: 'salmon', unit: 'lbs', category: 'Seafood' },
  { name: 'shrimp', unit: 'lbs', category: 'Seafood' },
  { name: 'bacon', unit: 'strips', category: 'Meat' },
  { name: 'egg', unit: 'count', category: 'Dairy' },
  { name: 'milk', unit: 'cups', category: 'Dairy' },
  { name: 'butter', unit: 'tbsp', category: 'Dairy' },
  { name: 'cheddar cheese', unit: 'cups', category: 'Dairy' },
  { name: 'mozzarella', unit: 'cups', category: 'Dairy' },
  { name: 'parmesan', unit: 'cups', category: 'Dairy' },
  { name: 'feta cheese', unit: 'cups', category: 'Dairy' },
  { name: 'sour cream', unit: 'cups', category: 'Dairy' },
  { name: 'yogurt', unit: 'cups', category: 'Dairy' },
  { name: 'cottage cheese', unit: 'cups', category: 'Dairy' },
  { name: 'spaghetti', unit: 'oz', category: 'Pantry' },
  { name: 'pasta', unit: 'oz', category: 'Pantry' },
  { name: 'rice', unit: 'cups', category: 'Pantry' },
  { name: 'oats', unit: 'cups', category: 'Pantry' },
  { name: 'flour', unit: 'cups', category: 'Pantry' },
  { name: 'bread', unit: 'slices', category: 'Pantry' },
  { name: 'olive oil', unit: 'tbsp', category: 'Pantry' },
  { name: 'soy sauce', unit: 'tbsp', category: 'Pantry' },
  { name: 'tomato sauce', unit: 'cups', category: 'Pantry' },
  { name: 'vegetable broth', unit: 'cups', category: 'Pantry' },
  { name: 'chicken broth', unit: 'cups', category: 'Pantry' },
  { name: 'black beans', unit: 'cans', category: 'Pantry' },
  { name: 'kidney beans', unit: 'cans', category: 'Pantry' },
  { name: 'chickpeas', unit: 'cans', category: 'Pantry' },
  { name: 'tuna', unit: 'cans', category: 'Pantry' },
  { name: 'honey', unit: 'tbsp', category: 'Pantry' },
  { name: 'maple syrup', unit: 'tbsp', category: 'Pantry' },
  { name: 'garlic', unit: 'cloves', category: 'Produce' },
  { name: 'onion', unit: 'count', category: 'Produce' },
  { name: 'tomato', unit: 'count', category: 'Produce' },
  { name: 'potato', unit: 'count', category: 'Produce' },
  { name: 'sweet potato', unit: 'count', category: 'Produce' },
  { name: 'carrot', unit: 'count', category: 'Produce' },
  { name: 'broccoli', unit: 'heads', category: 'Produce' },
  { name: 'spinach', unit: 'cups', category: 'Produce' },
  { name: 'bell pepper', unit: 'count', category: 'Produce' },
  { name: 'cucumber', unit: 'count', category: 'Produce' },
  { name: 'avocado', unit: 'count', category: 'Produce' },
  { name: 'lemon', unit: 'count', category: 'Produce' },
  { name: 'banana', unit: 'count', category: 'Produce' },
  { name: 'blueberries', unit: 'cups', category: 'Produce' },
  { name: 'mushrooms', unit: 'cups', category: 'Produce' },
  { name: 'zucchini', unit: 'count', category: 'Produce' },
  { name: 'celery', unit: 'stalks', category: 'Produce' },
  { name: 'corn', unit: 'ears', category: 'Produce' },
  { name: 'ginger', unit: 'tsp', category: 'Spices' },
  { name: 'cumin', unit: 'tsp', category: 'Spices' },
  { name: 'paprika', unit: 'tsp', category: 'Spices' },
  { name: 'curry powder', unit: 'tsp', category: 'Spices' },
  { name: 'cinnamon', unit: 'tsp', category: 'Spices' },
  { name: 'thyme', unit: 'tsp', category: 'Spices' },
  { name: 'oregano', unit: 'tsp', category: 'Spices' },
  { name: 'chili powder', unit: 'tsp', category: 'Spices' },
  { name: 'salt', unit: 'tsp', category: 'Spices' },
  { name: 'black pepper', unit: 'tsp', category: 'Spices' },
  { name: 'sesame oil', unit: 'tbsp', category: 'Pantry' },
  { name: 'coconut milk', unit: 'cans', category: 'Pantry' },
  { name: 'tofu', unit: 'oz', category: 'Protein' },
  { name: 'red lentils', unit: 'cups', category: 'Pantry' },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function randomBetween(min, max) {
  return +(Math.random() * (max - min) + min).toFixed(1);
}

function randomExpiryDate() {
  const options = [
    -2,   // already expired
    1,    // critical (≤3 days)
    2,
    3,
    5,    // warning (≤7 days)
    7,
    10,   // fresh
    14,
    21,
    30,
    60,
    90,
    null, // no expiry (e.g. spices)
  ];
  const days = options[Math.floor(Math.random() * options.length)];
  if (days === null) return null;
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
}

// ─── Seed Function ────────────────────────────────────────────────────────────

async function seed() {
  try {
    await client.connect();
    const db = client.db('recipeRoulette');

    // ── Clear existing data ──
    await db.collection('recipes').deleteMany({});
    await db.collection('inventory').deleteMany({});
    console.log('🗑️  Cleared existing collections');

    // ── Seed recipes ──
    const recipeDocs = recipes.map((r) => ({
      ...r,
      createdAt: new Date(),
    }));
    await db.collection('recipes').insertMany(recipeDocs);
    console.log(`✅ Inserted ${recipeDocs.length} recipes`);

    // ── Seed inventory (repeat templates with random values to hit 1000+) ──
    const inventoryDocs = [];
    const totalInventoryTarget = 1000;
    let i = 0;

    while (inventoryDocs.length < totalInventoryTarget) {
      const template = inventoryTemplates[i % inventoryTemplates.length];
      inventoryDocs.push({
        ...template,
        quantity: randomBetween(0.5, 20),
        expirationDate: randomExpiryDate(),
        addedAt: new Date(),
      });
      i++;
    }

    await db.collection('inventory').insertMany(inventoryDocs);
    console.log(`✅ Inserted ${inventoryDocs.length} inventory items`);

    const total = recipeDocs.length + inventoryDocs.length;
    console.log(`🎉 Seed complete! Total records: ${total}`);
  } catch (err) {
    console.error('❌ Seed failed:', err);
  } finally {
    await client.close();
  }
}

seed();