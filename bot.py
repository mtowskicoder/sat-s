import telebot
BOT_TOKEN = "8389421211:AAFpS885ESGYHyEz4dxuXz0_nnYg1BFNDr8" 
ADMIN_ID = 6126105727
bot = telebot.TeleBot(BOT_TOKEN)

@bot.message_handler(commands=['start'])
def start(msg):
    markup = telebot.types.ReplyKeyboardMarkup(resize_keyboard=True)
    markup.row("🛒 Mağaza")
    bot.send_message(msg.chat.id, "Hoşgeldiniz! Mağazayı açmak için tıklayın.", reply_markup=markup)

print("Bot çalışıyor...")
bot.infinity_polling()
