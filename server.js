const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// ✅ Test route
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// ✅ Form API
app.post("/api/submitForm", (req, res) => {
  const data = req.body;
  console.log("Received:", data);

  res.status(200).json({
    message: "Form submitted successfully",
  });
});

// ✅ Port
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});