const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config(); // Load environment variables
connectDB(); // Connect to MongoDB

const app = express();
app.use(express.json());
app.use(cors()); // Allow requests from frontend

app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 1229;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Import routes
app.use("/api/notes", require("./routes/noteRoutes"));
app.use("/api/users", require("./routes/userRoutes"));