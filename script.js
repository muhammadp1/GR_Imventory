const searchBox = document.getElementById("searchBox");
const productList = document.getElementById("productList");
const lotSelector = document.getElementById("lotSelector");

// List your CSV files here
const lots = ["Croma_Bhivandi_Lot.csv", "Lucknow_Punjabi_LOT.csv", "croma_ahmdavad.csv"];
let allData = [];

async function loadData() {
  allData = [];
  for (let lot of lots) {
    try {
      const res = await fetch(lot);
      const text = await res.text();
      const rows = text.trim().split("\n").slice(1);
      const data = rows.map(row => {
        const [Title, ItemType, MRP, FloorPrice, GRPrice] = row.split(",");
        return { Title, ItemType, MRP, FloorPrice, GRPrice, lot: lot.replace(".csv", "") };
      });
      allData.push(...data);
    } catch (err) {
      console.warn(`Could not load ${lot}: ${err}`);
    }
  }
  displayProducts(allData);
}

function displayProducts(data) {
  productList.innerHTML = "";
  if (data.length === 0) {
    productList.innerHTML = "<p>No products found.</p>";
    return;
  }

  data.forEach(item => {
    const card = `
      <div class="card">
        <h2>${item.Title}</h2>
        <p><b>Item Type:</b> ${item.ItemType}</p>
        <p><b>MRP:</b> ₹${item.MRP}</p>
        <p><b>Floor Price:</b> ₹${item.FloorPrice}</p>
        <p><b>GR Price:</b> ₹${item.GRPrice}</p>
        <span class="lot-tag">${item.lot.toUpperCase()}</span>
      </div>
    `;
    productList.innerHTML += card;
  });
}

function filterProducts() {
  const query = searchBox.value.trim().toLowerCase();
  const selectedLot = lotSelector.value;

  let filtered = allData;

  if (selectedLot !== "all") {
    filtered = filtered.filter(p => p.lot === selectedLot);
  }

  if (query) {
    filtered = filtered.filter(p =>
      p.Title.toLowerCase().includes(query) ||
      (p.ItemType && p.ItemType.toLowerCase().includes(query))
    );
  }

  displayProducts(filtered);
}

searchBox.addEventListener("input", filterProducts);
lotSelector.addEventListener("change", filterProducts);

loadData();
