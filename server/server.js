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

await connectDB();

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
