const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

app.use(cors({
  origin: "https://chetandhapkas.github.io",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.options("*", cors());
app.use(express.json());

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("✅ DB Connected"))
.catch(err => console.log("❌ DB Error:", err));

// ✅ Schema with validation
const formSchema = new mongoose.Schema({
  name: { type: String, required: true },
  studentClass: { type: String, required: true },
  parentEmail: { 
    type: String, 
    required: true,
    match: [/.+\@.+\..+/, "Please enter valid email"]   // email validation
  },
  parentMobile: { 
    type: String, 
    required: true,
    minlength: 10,
    maxlength: 10
  }
});

const Form = mongoose.model("Form", formSchema);

// ✅ Test route
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});


// ===================================================
// ✅ 1. FORM SUBMIT (WITH VALIDATION)
// ===================================================
app.post("/api/submitForm", async (req, res) => {
  try {
    const { name, studentClass, parentEmail, parentMobile } = req.body;

    // 🔴 Manual validation
    if (!name || !studentClass || !parentEmail || !parentMobile) {
      return res.status(400).json({
        message: "All fields are required ❌"
      });
    }

    if (!parentEmail.includes("@")) {
      return res.status(400).json({
        message: "Invalid Email ❌"
      });
    }

    if (parentMobile.length !== 10) {
      return res.status(400).json({
        message: "Mobile must be 10 digits ❌"
      });
    }

    const newForm = new Form({
      name,
      studentClass,
      parentEmail,
      parentMobile
    });

    await newForm.save();

    res.status(201).json({
      message: "Form submitted & saved to DB ✅"
    });

  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({
      message: "Server Error ❌"
    });
  }
});


// ===================================================
// ✅ 2. ADMIN PANEL - GET ALL DATA
// ===================================================
app.get("/api/forms", async (req, res) => {
  try {
    const allForms = await Form.find().sort({ _id: -1 }); // latest first

    res.status(200).json(allForms);

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error fetching data ❌"
    });
  }
});


// ===================================================
// ✅ 3. ADMIN PANEL - DELETE DATA
// ===================================================
app.delete("/api/forms/:id", async (req, res) => {
  try {
    await Form.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Deleted successfully ✅"
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Delete failed ❌"
    });
  }
});


// ===================================================
// ✅ Port
// ===================================================
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});