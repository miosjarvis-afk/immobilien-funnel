// Simple Express backend for Telegram notifications
// Deploy on Railway.app (kostenlos)

const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

// Telegram Config
const TELEGRAM_BOT_TOKEN = '8529364495:AAEd651kGB2bgNwm9MnCx8gVtIJsIrJ3aCM';
const TELEGRAM_CHAT_ID = '830554328';

app.use(cors());
app.use(express.json());

// Health check
app.get('/', (req, res) => {
    res.json({ status: 'ok', service: 'immobilien-funnel-backend' });
});

// Lead submission endpoint
app.post('/api/lead', async (req, res) => {
    try {
        const leadData = req.body;
        
        // Format Telegram message
        const message = `
🎯 <b>NEUER LEAD - Immobilien-Check</b>

👤 <b>Name:</b> ${leadData.firstName}
📧 <b>E-Mail:</b> ${leadData.email}
📱 <b>Telefon:</b> ${leadData.phone}

📊 <b>Ergebnis:</b>
• Score: ${leadData.score} Punkte
• Level: ${leadData.level}

📋 <b>Antworten:</b>
${Object.entries(leadData.answers).map(([key, value]) => {
    return `• ${key}: ${value.value}`;
}).join('\n')}

✅ <b>Consent:</b> ${leadData.consent ? 'Ja' : 'Nein'}
🔗 <b>Source:</b> ${leadData.source}
⏰ ${new Date(leadData.timestamp).toLocaleString('de-CH')}
        `.trim();
        
        // Send to Telegram
        const telegramResponse = await fetch(
            `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: TELEGRAM_CHAT_ID,
                    text: message,
                    parse_mode: 'HTML'
                })
            }
        );
        
        const telegramResult = await telegramResponse.json();
        
        if (!telegramResult.ok) {
            throw new Error('Telegram API error: ' + JSON.stringify(telegramResult));
        }
        
        res.json({ success: true, telegram: telegramResult });
        
    } catch (error) {
        console.error('Error processing lead:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
});
