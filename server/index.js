const express = require("express"); // Express server
const cors = require("cors");
require("dotenv").config();

const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();

app.use(cors()); //backend
app.use(express.json());
app.get("/", (req, res) => {
  res.json({ status: "Backend is working" });
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post("/api/gemini", async (req, res) => {
  console.log("Gemini request received");

  try {
    const { prompt } = req.body;

    const model = genAI.getGenerativeModel({
      model: "gemini-3.6-flash",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "ARRAY",
          items: {
            type: "OBJECT",
            properties: {
              question: { type: "STRING" },
              answer: { type: "STRING" }
            },
            required: ["question", "answer"]
          }
        }
      }
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;

    res.json({
      text: response.text()
    });

  } catch (error) {
    console.error("Gemini error:", error);

    res.status(500).json({
      error: error.message
    });
  }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Backend running on port ${PORT}`);
});