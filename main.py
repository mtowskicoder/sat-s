from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import json, os
from datetime import datetime

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Frontend URL deploy sonrası buraya ekle
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATA_FOLDER = "data"
PRODUCT_FILE = f"{DATA_FOLDER}/products.json"
ORDER_FILE = f"{DATA_FOLDER}/orders.json"

if not os.path.exists(DATA_FOLDER): os.makedirs(DATA_FOLDER)

def load_json(path, default):
    if os.path.exists(path):
        with open(path,"r",encoding="utf-8") as f: return json.load(f)
    return default

def save_json(path,data):
    with open(path,"w",encoding="utf-8") as f: json.dump(data,f,ensure_ascii=False, indent=2)

products = load_json(PRODUCT_FILE, [])
orders = load_json(ORDER_FILE, [])

class OrderRequest(BaseModel):
    product_id: int
    buyer_name: str
    buyer_telegram_id: int

@app.get("/products")
def get_products():
    return products

@app.post("/order")
def create_order(order: OrderRequest):
    prod = next((p for p in products if p["id"]==order.product_id), None)
    if not prod:
        return {"error":"Ürün bulunamadı"}
    orders.append({
        "order_id": max([o["order_id"] for o in orders] or [0])+1,
        "product_id": order.product_id,
        "product_name": prod["isim"],
        "buyer_name": order.buyer_name,
        "buyer_telegram_id": order.buyer_telegram_id,
        "datetime": datetime.now().strftime("%d.%m.%Y %H:%M")
    })
    save_json(ORDER_FILE, orders)
    return {"ok": True, "order_id": orders[-1]["order_id"]}
