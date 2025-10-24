const API_BASE = "https://sat-s-1.onrender.com"; // Backend URL

async function loadProducts(){
    try {
        const res = await fetch(`${API_BASE}/products`);
        const products = await res.json();
        const list = document.getElementById("product-list");
        list.innerHTML = "";
        if(products.length === 0){ list.innerHTML = "<p>Ürün bulunamadı.</p>"; return; }

        products.forEach(p=>{
            const div = document.createElement("div");
            div.className="product";
            div.innerHTML = `<strong>${p.isim}</strong> - ${p.fiyat}₺<br>
                             <button onclick="buyProduct(${p.id}, '${p.isim}')">Satın Al</button>`;
            list.appendChild(div);
        });
    } catch(err){
        document.getElementById("product-list").innerHTML = "<p>Sunucuya bağlanılamadı.</p>";
    }
}

async function buyProduct(id,name){
    const buyer_name = prompt("Lütfen adınızı girin:", "Telegram Kullanıcısı");
    if(!buyer_name) return;
    const buyer_id = parseInt(prompt("Lütfen Telegram ID'nizi girin:", "123456"));
    if(!buyer_id) return;

    try {
        const res = await fetch(`${API_BASE}/order`,{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body: JSON.stringify({ product_id:id, buyer_name, buyer_telegram_id:buyer_id })
        });
        const result = await res.json();
        const msgDiv = document.getElementById("message");
        if(result.ok) msgDiv.innerHTML = `<div class="alert success">✅ Sipariş alındı! ID: ${result.order_id}</div>`;
        else msgDiv.innerHTML = `<div class="alert error">❌ Hata: ${result.error}</div>`;
    } catch(err){
        document.getElementById("message").innerHTML = `<div class="alert error">❌ Sunucuya bağlanılamadı!</div>`;
    }
}

window.onload = loadProducts;
