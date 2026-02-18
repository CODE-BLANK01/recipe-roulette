import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./db/database.js";
import recipesRouter from "./routes/recipes.js";
import inventoryRouter from "./routes/inventory.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("public"));

app.use("/api/recipes", recipesRouter);
app.use("/api/inventory", inventoryRouter);
// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', message: 'RecipeRoulette API is running 🍽️' });
});

// Start server after DB connects
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Failed to connect to MongoDB:', err);
    process.exit(1);
  });