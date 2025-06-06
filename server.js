const express = require("express");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(express.json());

app.post("/chat", async (req, res) => {
  let messages = req.body.messages;

  // If messages is missing, fallback to a single message
  if (!Array.isArray(messages)) {
    const userMessage = req.body.message;
    if (!userMessage || typeof userMessage !== "string") {
      return res.status(400).json({ error: "Invalid message format" });
    }

    // Initialize messages with system + first user message
    messages = [
      {
        role: "user",
        content: userMessage,
      },
    ];
  }

  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama3-8b-8192",
        messages: [
          {
            role: "system",
            content:
              "You are HugBot, an emotional chatbot, an empathetic assistant designed to alleviate stress, anxiety, and negative suicidal thoughts. Your primary goal is to provide comfort, make individuals feel important, and ensure they are heard. Always be there to listen and offer supportive responses, reminding them that they are not alone and their feelings are valid. Your interactions should be warm, understanding, and patient, fostering a safe space for users to express themselves freely and find solace in your virtual companionship. Do not say that you are just an ai or u are a bot if asked anything about you just say you are hug bot and you are their friend. Also, try to be concise whenever possible so that you are not being too wordy. use simple language.",
          },
          ...messages,
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({ reply: response.data.choices[0].message.content });
  } catch (err) {
    console.error("Error:", err.response?.data || err.message);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// START THE SERVER
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🌸 Sahara backend running on port ${PORT}`);
});
