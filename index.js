    const express = require('express');
    const bodyParser = require('body-parser');
    const axios = require('axios');

    const app = express();
    const PORT = process.env.PORT || 6000;

    // Telegram bot token and chat ID
    const BOT_TOKEN = '7965465294:AAF2cKY7yoDVG80hySTK6bcwQocoX3BO9-U'; // O'z bot tokeningizni kiriting
    const CHAT_ID = '7965465294'; // O'z chat ID'ingizni kiriting

    // Middleware
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    // Endpoint to receive orders
    app.post('https://backmilliy-production.up.railway.app/orders', async (req, res) => {
    const orderData = req.body;

    // Send order data to Telegram
    const message = createTelegramMessage(orderData);
    
    try {
        await sendMessageToTelegram(message);
        res.status(200).send({ success: true, message: 'Order received and sent to Telegram' });
    } catch (error) {
        console.error('Error sending message to Telegram:', error);
        res.status(500).send({ success: false, message: 'Failed to send order to Telegram' });
    }
    });

    // Function to create a Telegram message
    const createTelegramMessage = (orderData) => {
    const products = orderData.products.map(item => `${item.productName} - ${item.quantity}`).join('\n');
    return `Получен новый заказ:\n\nТовары:\n${products}\n\nОбщая стоимость: ${orderData.totalPrice} сум\nСтатус заказа: ${orderData.orderStatus}`;
    };

    // Function to send message to Telegram
    const sendMessageToTelegram = async (message) => {
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    
    const payload = {
        chat_id: CHAT_ID,
        text: message,
        parse_mode: 'Markdown', // or 'HTML' if you prefer
    };

    await axios.post(url, payload);
    };

    // Start the server
    app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    });
