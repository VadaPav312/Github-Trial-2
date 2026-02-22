require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const AZURE_API_URL = window.location.origin + "/api/chat";

app.post('/api/chat', async (req, res) => {
    try {
        const response = await fetch(AZURE_API_URL, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json", 
                "Authorization": `Bearer ${process.env.AZURE_AI_TOKEN}` 
            },
            body: JSON.stringify(req.body)
        });

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error("Backend Error:", error);
        res.status(500).json({ error: "Failed to fetch AI data" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Secure server running on port ${PORT}`));