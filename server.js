require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// 1. Middleware
app.use(cors());
app.use(express.json());

// 2. Serve static files from the root directory
// This ensures Render can find your index.html and any other local files
app.use(express.static(__dirname));

// 3. Azure AI Configuration
const ACTUAL_AZURE_ENDPOINT = "https://models.inference.ai.azure.com/chat/completions"; 

app.post('/api/chat', async (req, res) => {
    try {
        // Check if the token exists in Render's environment
        if (!process.env.AZURE_AI_TOKEN) {
            console.error("Missing AZURE_AI_TOKEN in Environment Variables");
            return res.status(500).json({ error: "Server configuration error: Missing API Key" });
        }

        const response = await fetch(ACTUAL_AZURE_ENDPOINT, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json", 
                "Authorization": `Bearer ${process.env.AZURE_AI_TOKEN}` 
            },
            body: JSON.stringify({
                messages: req.body.messages,
                model: "gpt-4o" 
            })
        });

        const data = await response.json();

        // Forward the AI response back to your frontend
        res.json(data);

    } catch (error) {
        console.error("Backend Error:", error);
        res.status(500).json({ error: "Failed to fetch AI data" });
    }
});

// 4. Root Route: Explicitly point to your index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 5. Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
