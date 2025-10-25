import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import TelegramBot from "node-telegram-bot-api";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname)); // index.html & admin.html sunulacak

// Telegram bot token ve admin ID
const BOT_TOKEN = "8389421211:AAFpS885ESGYHyEz4dxuXz0_nnYg1BFNDr8";
const ADMIN_CHAT_ID = 6126105727; // kendi Telegram ID'in

const bot = new TelegramBot(BOT_TOKEN, { polling: false });

// Ürünler dosyası
const DATA_FILE = path.join(__dirname, "products.json");
if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, "[]");

function loadProducts() {
  return JSON.parse(fs.readFileSync(DATA_FILE));
}

function saveProducts(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// Şifreli admin girişi
const ADMIN_PASSWORD = "S9x@12ZbR!7KqT8pL0f"; // güçlü şifre 🔒

// 🔹 Ürünleri listele (satılmayanlar)
app.get("/api/products", (req, res) => {
  const data = loadProducts().filter(p => !p.sold);
  res.json(data);
});

// 🔹 Admin doğrulama
app.post("/api/admin/login", (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    res.json({ success: true });
  } else {
    res.status(403).json({ success: false, message: "Yetkisiz giriş" });
  }
});

// 🔹 Ürün ekleme
app.post("/api/admin/add", (req, res) => {
  const products = loadProducts();
  const newProduct = {
    id: Date.now(),
    category: req.body.category,
    name: req.body.name,
    stock: req.body.stock,
    price: req.body.price,
    info: req.body.info,
    sold: false
  };
  products.push(newProduct);
  saveProducts(products);
  res.json({ success: true, message: "Ürün eklendi!" });
});

// 🔹 Ürün güncelleme
app.post("/api/admin/update", (req, res) => {
  const products = loadProducts();
  const index = products.findIndex(p => p.id === req.body.id);
  if (index === -1) return res.status(404).json({ error: "Ürün bulunamadı" });
  products[index] = { ...products[index], ...req.body };
  saveProducts(products);
  res.json({ success: true });
});

// 🔹 Ürünü satıldı olarak işaretle
app.post("/api/admin/sold", (req, res) => {
  const products = loadProducts();
  const product = products.find(p => p.id === req.body.id);
  if (product) {
    product.sold = true;
    saveProducts(products);
  }
  res.json({ success: true });
});

// 🔹 Kullanıcı satın alırsa Telegram’dan admin’e gönder
app.post("/api/purchase", async (req, res) => {
  const { name, price, user } = req.body;
  const message = `
📦 Yeni Satın Alma Talebi:
👤 Kullanıcı: ${user || "Bilinmiyor"}
🛍 Ürün: ${name}
💰 Fiyat: ${price} ₺
  `;
  await bot.sendMessage(ADMIN_CHAT_ID, message, {
    reply_markup: {
      inline_keyboard: [
        [{ text: "📞 Kullanıcıyla İletişim", url: "https://t.me/" + user }],
      ],
    },
  });
  res.json({ success: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Sunucu aktif: ${PORT}`));
