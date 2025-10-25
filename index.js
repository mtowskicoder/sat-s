import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// 🔹 Ürün verileri (örnek SMS onay hizmetleri)
const products = [
  {
    id: 1,
    service: "WhatsApp",
    country: "TR",
    stock: 120,
    price: 1.5,
  },
  {
    id: 2,
    service: "Telegram",
    country: "US",
    stock: 95,
    price: 1.2,
  },
  {
    id: 3,
    service: "Discord",
    country: "DE",
    stock: 75,
    price: 1.8,
  },
  {
    id: 4,
    service: "Instagram",
    country: "FR",
    stock: 60,
    price: 2.0,
  },
];

// 🔹 API endpoint: Ürün listesini döndürür
app.get("/api/products", (req, res) => {
  res.json(products);
});

// 🔹 Ana sayfa (Telegram Web App)
app.get("/", (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>SMS Onay Kataloğu</title>
  <script src="https://telegram.org/js/telegram-web-app.js"></script>
  <style>
    body {
      font-family: 'Arial', sans-serif;
      background: #0e1621;
      color: #fff;
      margin: 0;
      padding: 20px;
    }
    h1 {
      text-align: center;
      color: #00aaff;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 15px;
      margin-top: 25px;
    }
    .card {
      background: #1c2a39;
      border-radius: 12px;
      padding: 15px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      text-align: center;
      transition: all 0.3s ease;
    }
    .card:hover {
      transform: translateY(-5px);
      box-shadow: 0 6px 15px rgba(0,0,0,0.5);
    }
    .service {
      font-size: 20px;
      font-weight: bold;
      color: #00e1ff;
    }
    .country {
      margin-top: 5px;
      font-size: 16px;
      color: #bbb;
    }
    .price {
      margin-top: 10px;
      font-size: 18px;
      color: #0ff;
    }
    button {
      margin-top: 10px;
      background: #00aaff;
      color: #fff;
      border: none;
      padding: 8px 14px;
      border-radius: 8px;
      cursor: pointer;
      transition: background 0.3s ease;
    }
    button:hover {
      background: #0090dd;
    }
  </style>
</head>
<body>
  <h1>SMS Onay Ürün Kataloğu</h1>
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

// 🔹 Port (Render veya Vercel)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("✅ Sunucu çalışıyor port:", PORT));
