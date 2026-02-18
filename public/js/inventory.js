async function loadInventory() {
    const res = await fetch("/api/inventory");
    const items = await res.json();
  
    const container = document.getElementById("inventory");
    container.innerHTML = "";
  
    const today = new Date();
  
    items.sort((a, b) =>
      new Date(a.expirationDate) - new Date(b.expirationDate)
    );
  
    items.forEach(item => {
      const expiry = new Date(item.expirationDate);
      const diffDays = Math.ceil(
        (expiry - today) / (1000 * 60 * 60 * 24)
      );
  
      const div = document.createElement("div");
  
      if (diffDays <= 3) div.style.backgroundColor = "#ffcccc";
      else if (diffDays <= 7) div.style.backgroundColor = "#fff3cd";
  
      div.innerHTML = `
        <h3>${item.name}</h3>
        <p>${item.quantity} ${item.unit}</p>
        <p>Category: ${item.category}</p>
        <p>Expires in: ${diffDays} days</p>
        <button onclick="deleteItem('${item._id}')">Delete</button>
        <hr>
      `;
  
      container.appendChild(div);
    });
  }
  
  async function addItem() {
    const name = document.getElementById("name").value;
    const quantity = Number(document.getElementById("quantity").value);
    const unit = document.getElementById("unit").value;
    const category = document.getElementById("category").value;
    const expirationDate = document.getElementById("expirationDate").value;
  
    await fetch("/api/inventory", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        quantity,
        unit,
        category,
        expirationDate
      })
    });
  
    loadInventory();
  }
  
  async function deleteItem(id) {
    await fetch(`/api/inventory/${id}`, { method: "DELETE" });
    loadInventory();
  }
  
  loadInventory();
  