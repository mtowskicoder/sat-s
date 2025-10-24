const API_BASE = "http://localhost:8000"; // Deploy sonrası backend URL ile değiştir

async function loadProducts(){
    const res = await fetch(API_BASE + "/products");
    const products = await res.json();
    const list = document.getElementById("product-list");
    list.innerHTML = "";
    products.forEach(p=>{
        const div = document.createElement("div");
        div.className="product";
        div.innerHTML = `<strong>${p.isim}</strong> - ${p.fiyat}₺ <br>
        <button onclick="buyProduct(${p.id}, '${p.isim}')">Satın Al</button>`;
        list.appendChild(div);
    });
}

async function buyProduct(id,name){
    const data = { product_id:id, buyer_name:"Test Kullanıcı", buyer_telegram_id:123456 };
    const res = await fetch(API_BASE+"/order",{method:"POST",headers:{"Content-Type":"application/json"}, body: JSON.stringify(data)});
    const result = await res.json();
    if(result.ok) alert("Sipariş alındı! ID: "+result.order_id);
    else alert("Hata: "+result.error);
}

window.onload = loadProducts;
