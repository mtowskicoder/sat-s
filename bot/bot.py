import telebot
from telebot import types

BOT_TOKEN = "8389421211:AAFpS885ESGYHyEz4dxuXz0_nnYg1BFNDr8"
ADMIN_ID = 6126105727
WEBAPP_URL = "https://sat-sx.vercel.app"  # Frontend (Vercel) URL

bot = telebot.TeleBot(BOT_TOKEN)

@bot.message_handler(commands=['start'])
def start(msg):
    markup = types.ReplyKeyboardMarkup(resize_keyboard=True)
    web = types.InlineKeyboardMarkup()
    web.add(types.InlineKeyboardButton("🛒 Mağazayı Aç", web_app=types.WebAppInfo(url=WEBAPP_URL)))
    bot.send_message(msg.chat.id, "Hoşgeldiniz! Mağazayı açmak için tıklayın.", reply_markup=web)

print("Bot çalışıyor...")
bot.infinity_polling()
