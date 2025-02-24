const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");

dotenv.config();
const app = express();

// ✅ Enable CORS for frontend access
app.use(cors({
  origin: "http://localhost:5173", // Allow requests from Vite React app
  credentials: true // Allow cookies and authorization headers
}));

app.use(express.json()); // Parse JSON request bodies
app.use("/api/auth", authRoutes); // Use authentication routes

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.error("MongoDB Connection Error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
