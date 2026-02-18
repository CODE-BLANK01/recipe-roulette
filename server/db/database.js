import { MongoClient } from "mongodb";

let db;

export async function connectDB() {
  if (db) return db;
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  db = client.db("recipeRoulette");
  console.log("Connected to MongoDB");
  return db;
}

export function getDB() {
  return db;
}
