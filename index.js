import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// 🔹 SMS Onay Ürünleri
const products = [
  {
    id: 1,
    service: "WhatsApp",
    country: "TR",
    stock: 120,
    price: 1.5,
    logo: "https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg",
  },
  {
    id: 2,
    service: "Telegram",
    country: "US",
    stock: 95,
    price: 1.2,
    logo: "https://upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.svg",
  },
  {
    id: 3,
    service: "Discord",
    country: "DE",
    stock: 75,
    price: 1.8,
    logo: "https://upload.wikimedia.org/wikipedia/commons/9/98/Discord_logo.svg",
  },
  {
    id: 4,
    service: "Instagram",
    country: "FR",
    stock: 60,
    price: 2.0,
    logo: "https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg",
  },
  {
    id: 5,
    service: "Twitter (X)",
    country: "TR",
    stock: 40,
    price: 2.3,
    logo: "https://upload.wikimedia.org/wikipedia/commons/5/53/X_logo_2023_original.svg",
  },
];

// 🔹 API
app.get("/api/products", (req, res) => {
  res.json(products);
});

// 🔹 Arayüz (HTML)
app.get("/", (req, res) => {
  res.type("html").send(`
<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <title>SMS Onay Kataloğu</title>
  <script src="https://telegram.org/js/telegram-web-app.js"></script>
  <style>
    body {
      font-family: 'Poppins', sans-serif;
      background: linear-gradient(145deg, #0f172a, #1e293b);
      color: #fff;
      margin: 0;
      padding: 20px;
      min-height: 100vh;
    }
    h1 {
      text-align: center;
      color: #38bdf8;
      margin-bottom: 20px;
    }
    .controls {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      gap: 10px;
      margin-bottom: 20px;
    }
    input, select {
      padding: 10px;
      border-radius: 8px;
      border: none;
      outline: none;
      font-size: 15px;
      background: #1e293b;
      color: #fff;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 15px;
    }
    .card {
      background: #1e293b;
      border-radius: 15px;
      padding: 15px;
      text-align: center;
      transition: all 0.3s ease;
      box-shadow: 0 4px 10px rgba(0,0,0,0.3);
    }
    .card:hover {
      transform: scale(1.03);
      box-shadow: 0 6px 20px rgba(0,0,0,0.5);
    }
    img.logo {
      width: 50px;
      height: 50px;
      margin-bottom: 10px;
      border-radius: 8px;
    }
    .service {
      font-size: 20px;
      font-weight: bold;
      color: #38bdf8;
    }
    .country {
      margin-top: 5px;
      font-size: 15px;
      color: #bbb;
    }
    .price {
      margin-top: 10px;
      font-size: 17px;
      color: #22d3ee;
    }
    button {
      margin-top: 10px;
      background: #38bdf8;
      color: #fff;
      border: none;
      padding: 8px 14px;
      border-radius: 8px;
      cursor: pointer;
      font-weight: bold;
      transition: 0.3s;
    }
    button:hover {
      background: #0ea5e9;
    }
    .empty {
      text-align: center;
      color: #aaa;
      font-size: 16px;
      margin-top: 30px;
    }
  </style>
</head>
<body>
  <h1>📦 SMS Onay Ürünleri</h1>

  <div class="controls">
    <input type="text" id="searchInput" placeholder="Servis ara...">
    <select id="countryFilter">
      <option value="">Tüm Ülkeler</option>
      <option value="TR">Türkiye</option>
      <option value="US">ABD</option>
      <option value="DE">Almanya</option>
      <option value="FR">Fransa</option>
    </select>
  </div>

  <div id="productList" class="grid"></div>
  <div id="emptyMsg" class="empty" style="display:none;">Hiç ürün bulunamadı.</div>

  <script>
    const tg = window.Telegram.WebApp;
    tg.expand();

    let allProducts = [];

    async function loadProducts() {
      const res = await fetch("/api/products");
      const data = await res.json();
      allProducts = data;
      displayProducts(data);
    }

    function displayProducts(data) {
      const container = document.getElementById("productList");
      const emptyMsg = document.getElementById("emptyMsg");
      if (!data.length) {
        container.innerHTML = "";
        emptyMsg.style.display = "block";
        return;
      }
      emptyMsg.style.display = "none";
      container.innerHTML = data.map(p => \`
        <div class="card">
          <img src="\${p.logo}" class="logo" alt="\${p.service}">
          <div class="service">\${p.service}</div>
          <div class="country">Ülke: \${p.country}</div>
          <div class="stock">Stok: \${p.stock}</div>
          <div class="price">Fiyat: \${p.price} ₺</div>
          <button onclick="buy('\${p.service}', \${p.price})">Satın Al</button>
        </div>
      \`).join('');
    }

    function buy(service, price) {
      tg.sendData(JSON.stringify({ service, price }));
      tg.close();
    }

    document.getElementById("searchInput").addEventListener("input", filterProducts);
    document.getElementById("countryFilter").addEventListener("change", filterProducts);

    function filterProducts() {
      const search = document.getElementById("searchInput").value.toLowerCase();
      const country = document.getElementById("countryFilter").value;
      const filtered = allProducts.filter(p =>
        p.service.toLowerCase().includes(search) &&
        (country ? p.country === country : true)
      );
      displayProducts(filtered);
    }

    loadProducts();
  </script>
</body>
</html>
  `);
});

// 🔹 PORT
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("✅ Sunucu aktif: " + PORT));
