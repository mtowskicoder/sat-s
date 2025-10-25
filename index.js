import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Ürünler (örnek)
const products = [
  { id: 1, service: "WhatsApp", country: "TR", stock: 120, price: 1.5 },
  { id: 2, service: "Telegram", country: "US", stock: 95, price: 1.2 },
  { id: 3, service: "Discord", country: "DE", stock: 75, price: 1.8 },
  { id: 4, service: "Instagram", country: "FR", stock: 60, price: 2.0 },
];

// API endpoint
app.get("/api/products", (req, res) => {
  res.json(products);
});

// Arayüz (HTML)
app.get("/", (req, res) => {
  res.type("html").send(`
<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>SMS Onay Kataloğu</title>
  <script src="https://telegram.org/js/telegram-web-app.js"></script>
  <style>
    body {
      font-family: 'Poppins', sans-serif;
      background: #0f172a;
      color: #fff;
      margin: 0;
      padding: 20px;
    }
    h1 {
      text-align: center;
      color: #38bdf8;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 15px;
      margin-top: 25px;
    }
    .card {
      background: #1e293b;
      border-radius: 12px;
      padding: 15px;
      text-align: center;
      transition: all 0.3s ease;
    }
    .card:hover {
      transform: translateY(-5px);
      box-shadow: 0 0 10px #38bdf8;
    }
    .service {
      font-size: 20px;
      font-weight: bold;
      color: #38bdf8;
    }
    .country {
      margin-top: 5px;
      font-size: 16px;
      color: #bbb;
    }
    .price {
      margin-top: 10px;
      font-size: 18px;
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
      transition: 0.3s;
    }
    button:hover {
      background: #0ea5e9;
    }
  </style>
</head>
<body>
  <h1>📱 SMS Onay Hizmetleri</h1>
  <div id="productList" class="grid"></div>

  <script>
    const tg = window.Telegram.WebApp;
    tg.expand();

    async function loadProducts() {
      const res = await fetch("/api/products");
      const data = await res.json();
      const container = document.getElementById("productList");
      container.innerHTML = data.map(p => \`
        <div class="card">
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

    loadProducts();
  </script>
</body>
</html>
  `);
});

// Port ayarı
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("✅ Sunucu aktif: " + PORT));
