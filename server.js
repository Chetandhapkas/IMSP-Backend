const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

app.use(cors());
app.use(express.json());

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("✅ DB Connected"))
.catch(err => console.log("❌ DB Error:", err));

// ✅ Schema
const formSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true }
});

const Form = mongoose.model("Form", formSchema);

// ✅ Test route
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// ✅ Form API (SAVE DATA IN DB)
app.post("/api/submitForm", async (req, res) => {
  try {
    const data = req.body;

    const newForm = new Form(data);
    await newForm.save();

    console.log("Saved:", data);

    res.status(200).json({
      message: "Form submitted & saved to DB ✅",
    });

  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({
      message: "Error saving data ❌",
    });
  }
});

// ✅ Port
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});