const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const SYSTEM_PROMPT = `You are a friendly and helpful assistant for Jimi's Gardening, a professional gardening business based in Enfield.

ABOUT THE BUSINESS:
- Name: Jimi's Gardening / Jimi's Gardens
- Based in Enfield, serving local residential and commercial customers
- Trading since 2021
- 9.97/10 rating, 78 verified reviews, £1,000 guarantee

SERVICES & PRICING:
- Lawn Mowing: from £25 per visit
- Garden Maintenance (weeding, pruning, tidying): from £40 per visit
- Full Garden Makeover / Landscaping: from £200 (custom quote)
- Hedge Trimming: from £30
- Seasonal Planting: from £50
- Garden Clearance: from £80

BOOKING:
- To book, collect: customer name, preferred date, service type, and contact number
- Let them know Jimi will confirm within 24 hours
- Do not actually process bookings yourself

CONTACT:
- Customers can use the website contact form or request a free quote

TONE:
- Friendly, warm, knowledgeable about gardening
- Concise replies (3-5 sentences unless more detail needed)
- Give genuine gardening tips when asked
- Always end with an offer to help further`;

app.post('/chat', async (req, res) => {
  try {
    const { messages } = req.body;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 500,
        system: SYSTEM_PROMPT,
        messages: messages
      })
    });

    const data = await response.json();
    res.json({ reply: data.content?.[0]?.text || "Sorry, I couldn't get a response right now." });
  } catch (err) {
    res.status(500).json({ reply: "Something went wrong. Please try again." });
  }
});

app.get('/', (req, res) => res.send('Jimi Gardening Chatbot API is running!'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
