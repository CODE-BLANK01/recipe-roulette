async function loadRecipes() {
    const search = document.getElementById("search").value;
    const difficulty = document.getElementById("filterDifficulty").value;
    const maxPrep = document.getElementById("filterPrep").value;
  
    let url = `/api/recipes?search=${search}&difficulty=${difficulty}&maxPrep=${maxPrep}`;
  
    const res = await fetch(url);
    const recipes = await res.json();
  
    const container = document.getElementById("recipes");
    container.innerHTML = "";
  
    recipes.forEach(recipe => {
      const div = document.createElement("div");
  
      div.innerHTML = `
        <h3>${recipe.title} ${recipe.favorite ? "⭐" : ""}</h3>
        <p>${recipe.ingredients.join(", ")}</p>
        <p>${recipe.prepTime} mins | ${recipe.difficulty}</p>
        <button onclick="toggleFavorite('${recipe._id}')">Favorite</button>
        <button onclick="deleteRecipe('${recipe._id}')">Delete</button>
        <hr>
      `;
  
      container.appendChild(div);
    });
  }
  
  async function addRecipe() {
    const title = document.getElementById("title").value;
    const ingredients = document
      .getElementById("ingredients")
      .value.split(",")
      .map(i => i.trim());
  
    const prepTime = Number(document.getElementById("prepTime").value);
    const difficulty = document.getElementById("difficulty").value;
  
    await fetch("/api/recipes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, ingredients, prepTime, difficulty })
    });
  
    loadRecipes();
  }
  
  async function toggleFavorite(id) {
    await fetch(`/api/recipes/favorite/${id}`, { method: "PUT" });
    loadRecipes();
  }
  
  async function deleteRecipe(id) {
    await fetch(`/api/recipes/${id}`, { method: "DELETE" });
    loadRecipes();
  }
  
  loadRecipes();
  