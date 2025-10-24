// script.js — Telegram Web App örneği
// Bu dosya, Telegram WebApp API ile etkileşim kurar.
// - Kullanıcı bilgilerini gösterir
// - Ürün seçimi / adet / not alır
// - Telegram botuna sendData ile JSON gönderir

// Basit örnek ürün listesi (istediğin gibi güncelle)
const PRODUCTS = [
  { id: 1, isim: "Sanal Ürün A", fiyat: 25.0, ozellik: "Hızlı teslim", seri: "ABC12345" },
  { id: 2, isim: "Sanal Ürün B", fiyat: 45.0, ozellik: "Garanti 7 gün", seri: "DEF67890" },
  { id: 3, isim: "Sanal Ürün C", fiyat: 99.0, ozellik: "Premium destek", seri: "GHI24680" }
];

const tg = window.Telegram.WebApp;
tg.ready();

const userInfoEl = document.getElementById("userInfo");
const productsEl = document.getElementById("products");
const buyPanel = document.getElementById("buyPanel");
const buyTitle = document.getElementById("buyTitle");
const buyDesc = document.getElementById("buyDesc");
const qtyInput = document.getElementById("qtyInput");
const qtyMinus = document.getElementById("qtyMinus");
const qtyPlus = document.getElementById("qtyPlus");
const buyNote = document.getElementById("buyNote");
const sendToBotBtn = document.getElementById("sendToBot");
const cancelBuyBtn = document.getElementById("cancelBuy");
const closePanelBtn = document.getElementById("closePanel");
const closeAppBtn = document.getElementById("closeApp");
const openMainBtn = document.getElementById("openMain");

// Başlangıç: Telegram'dan alınabilecek bilgileri göster
function showUserInfo() {
  try {
    const init = tg.initDataUnsafe || {};
    const user = init.user || tg.initDataUnsafe?.user || {}; // fallback
    if (user && user.first_name) {
      userInfoEl.innerText = ${user.first_name}${user.last_name ? " " + user.last_name : ""} (@${user.username || "?"});
    } else {
      // Eğer initData yoksa, Telegram mobil uygulaması üzerinden alınamıyorsa basit bir metin göster
      userInfoEl.innerText = "Telegram bilgisi yüklenemedi";
    }
  } catch (e) {
    userInfoEl.innerText = "Kullanıcı bilgisi alınamadı";
  }
}

// Ürünleri DOM'a yaz
function renderProducts() {
  productsEl.innerHTML = "";
  PRODUCTS.forEach(p => {
    const card = document.createElement("div");
    card.className = "product";
    card.innerHTML = `
      <div class="title">${escapeHtml(p.isim)}</div>
      <div class="muted">${escapeHtml(p.ozellik)}</div>
      <div class="price">${p.fiyat.toFixed(2)}₺</div>
      <div style="margin-top:8px;display:flex;gap:8px">
        <button class="btn primary" data-id="${p.id}">Satın Al</button>
        <button class="btn ghost" data-id="${p.id}" onclick="viewDetails(${p.id})">Detay</button>
      </div>
    `;
    productsEl.appendChild(card);
  });
}

// Güvenlik: basit escape
function escapeHtml(s){ if(!s) return ""; return String(s).replace(/[&<>"']/g,c=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c])); }

// Detay göster (popup yok, alert ile kısa)
function viewDetails(id){
  const p = PRODUCTS.find(x=>x.id===id);
  if(!p) return;
  alert(${p.isim}\n\nÖzellik: ${p.ozellik}\nFiyat: ${p.fiyat}₺\nSeri: ${p.seri});
}

// Seçilen ürünü saklayacağımız değişken
let selectedProduct = null;

function openBuyPanel(product){
  selectedProduct = product;
  buyTitle.innerText = product.isim;
  buyDesc.innerText = ${product.ozellik}\nFiyat (adet başı): ${product.fiyat.toFixed(2)}₺\nSeri: ${product.seri};
  qtyInput.value = 1;
  buyNote.value = "";
  buyPanel.setAttribute("aria-hidden","false");
  buyPanel.style.display = "flex";
}

// Panel Kapat / İptal
function closeBuyPanel(){
  selectedProduct = null;
  buyPanel.setAttribute("aria-hidden","true");
  buyPanel.style.display = "none";
}

// Adet butonları
qtyMinus.addEventListener("click", ()=> { qtyInput.value = Math.max(1, Number(qtyInput.value) - 1); });
qtyPlus.addEventListener("click", ()=> { qtyInput.value = Math.max(1, Number(qtyInput.value) + 1); });

// Ürün kartındaki "Satın Al" butonları - event delegation
productsEl.addEventListener("click", (ev)=>{
  const btn = ev.target.closest("button.primary");
  if(!btn) return;
  const id = Number(btn.dataset.id);
  const p = PRODUCTS.find(x=>x.id===id);
  if(!p) return;
  openBuyPanel(p);
});

// Gönder butonu: bot'a JSON gönder
sendToBotBtn.addEventListener("click", ()=>{
  if(!selectedProduct) return;
  const qty = Math.max(1, Number(qtyInput.value) || 1);
  const note = buyNote.value || "";
  // Telegram kullanıcı bilgilerini de ekleyelim (initDataUnsafe)
  const init = tg.initDataUnsafe || {};
  const user = init.user || {};
  const payload = {
    type: "purchase_request",
    product: {
      id: selectedProduct.id,
      name: selectedProduct.isim,
      price: selectedProduct.fiyat,
      seri: selectedProduct.seri
    },
    qty,
    note,
    user: {
      id: user.id || null,
      first_name: user.first_name || null,
      username: user.username || null,
    },
    sent_at: new Date().toISOString()
  };

  // sendData ile bot'a gönder (bot tarafında web_app_data ile yakalanır)
  try {
    tg.sendData(JSON.stringify(payload));
    // Kullanıcıya kısa bir onay göster
    tg.showAlert("Satın alma isteği gönderildi. Teşekkürler!");
    closeBuyPanel();
  } catch (e) {
    console.error(e);
    tg.showAlert("Gönderilemedi. Lütfen tekrar deneyin.");
  }
});

// İptal / Kapat
cancelBuyBtn.addEventListener("click", closeBuyPanel);
closePanelBtn.addEventListener("click", closeBuyPanel);

// Uygulamayı kapatma (Telegram içinden)
closeAppBtn.addEventListener("click", ()=> tg.close());

// Ana menüye dön (Telegram client'ta bot ile yeniden etkileşim)
openMainBtn.addEventListener("click", ()=> tg.BackButton && tg.BackButton.show() );

// Başlangıç
(function init(){
  showUserInfo();
  renderProducts();

  // Eğer Telegram üst çubuğunda bir buton göstermek istersen:
  try {
    tg.MainButton.setText("Sepete Git");
    tg.MainButton.show();
    tg.MainButton.onClick(()=> {
      // Örnek: MainButton'a tıklanırsa sepet göster (burada sadece alert)
      tg.showAlert("Sepet şu an basit demo amaçlıdır.");
    });
  } catch(e){
    // bazı Telegram client'lar farklı davranabilir
    console.warn("MainButton ayarlanamadı:", e);
  }
})();
