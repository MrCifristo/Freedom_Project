require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure 'uploads' directory exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log(`Directory ${uploadDir} created.`);
}

const app = express();
app.use(cors({ origin: "http://localhost:3000" })); // Replace with your frontend URL
app.use(express.json());

// Serve static files for images
app.use("/uploads", express.static(uploadDir));

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB", err));

// Schema for Items
const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  imageUrl: String, // Field for storing image URL
});

const Item = mongoose.model("Item", itemSchema);

// Schema for Purchases
const purchaseSchema = new mongoose.Schema({
  itemId: { type: mongoose.Schema.Types.ObjectId, ref: "Item", required: true },
  buyer: { type: String, required: true }, // Buyer's wallet address
  price: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
});

const Purchase = mongoose.model("Purchase", purchaseSchema);

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedExtensions = /jpeg|jpg|png/;
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedExtensions.test(ext)) {
      cb(null, true);
    } else {
      cb(new Error("Only JPEG, JPG, and PNG files are allowed"));
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
});

// Routes

// Fetch all items
app.get("/api/items", async (req, res) => {
  try {
    const items = await Item.find();
    res.status(200).send(items);
  } catch (error) {
    console.error("Error fetching items:", error);
    res.status(500).send({ message: "Error fetching items" });
  }
});

// Add a new item
app.post("/api/items", upload.single("image"), async (req, res) => {
  try {
    const { name, description, price } = req.body;

    if (!name || !description || price === undefined) {
      return res.status(400).send({ message: "Name, description, and price are required" });
    }

    if (price < 0) {
      return res.status(400).send({ message: "Price must be a positive number" });
    }

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const newItem = new Item({ name, description, price, imageUrl });
    await newItem.save();

    res.status(201).send(newItem);
  } catch (error) {
    console.error("Error adding item:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

// Update an item
app.put("/api/items/:id", upload.single("image"), async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({ message: "Invalid item ID" });
  }

  const { name, description, price } = req.body;

  if (!name || !description || price === undefined) {
    return res.status(400).send({ message: "Name, description, and price are required" });
  }

  if (price < 0) {
    return res.status(400).send({ message: "Price must be a positive number" });
  }

  let imageUrl;

  if (req.file) {
    imageUrl = `/uploads/${req.file.filename}`;
  }

  try {
    const updatedItem = await Item.findByIdAndUpdate(
      id,
      { name, description, price, ...(imageUrl && { imageUrl }) },
      { new: true }
    );

    if (!updatedItem) {
      return res.status(404).send({ message: "Item not found" });
    }

    res.status(200).send(updatedItem);
  } catch (error) {
    console.error("Error updating item:", error);
    res.status(500).send({ message: "Error updating item" });
  }
});

// Delete an item
app.delete("/api/items/:id", async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({ message: "Invalid item ID" });
  }

  try {
    const deletedItem = await Item.findByIdAndDelete(id);

    if (!deletedItem) {
      return res.status(404).send({ message: "Item not found" });
    }

    if (deletedItem.imageUrl) {
      const filePath = path.join(__dirname, deletedItem.imageUrl);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    res.send({ message: "Item deleted successfully" });
  } catch (error) {
    console.error("Error deleting item:", error);
    res.status(500).send({ message: "Error deleting item" });
  }
});

// Fetch total sales
app.get("/api/sales", async (req, res) => {
  try {
    const purchases = await Purchase.find();
    const totalSales = purchases.reduce((sum, purchase) => sum + purchase.price, 0);
    res.status(200).send({ totalSales });
  } catch (error) {
    console.error("Error calculating total sales:", error);
    res.status(500).send({ message: "Error calculating total sales" });
  }
});

// Fetch purchase history
app.get("/api/purchases", async (req, res) => {
  try {
    const purchases = await Purchase.find().populate("itemId");
    res.status(200).send(purchases);
  } catch (error) {
    console.error("Error fetching purchases:", error);
    res.status(500).send({ message: "Error fetching purchase history" });
  }
});

// Record a purchase
app.post("/api/purchases", async (req, res) => {
  const { itemId, buyer, price } = req.body;

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return res.status(400).send({ message: "Invalid item ID" });
  }

  if (!buyer || price === undefined) {
    return res.status(400).send({ message: "Buyer and price are required" });
  }

  try {
    const newPurchase = new Purchase({ itemId, buyer, price });
    await newPurchase.save();

    res.status(201).send(newPurchase);
  } catch (error) {
    console.error("Error recording purchase:", error);
    res.status(500).send({ message: "Error recording purchase" });
  }
});

// Catch-all route for undefined endpoints
app.use((req, res) => {
  res.status(404).send({ message: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.message);
  res.status(500).send({ message: "Something went wrong" });
});

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));