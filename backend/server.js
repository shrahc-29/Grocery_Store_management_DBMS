const express = require("express");
const cors    = require("cors");

const app = express();

// ROUTES
const productRoutes   = require("./routes/products");
const customerRoutes  = require("./routes/customers");
const orderRoutes     = require("./routes/orders");
const inventoryRoutes = require("./routes/inventory");
const supplierRoutes  = require("./routes/suppliers");
const categoryRoutes  = require("./routes/categories");

// MIDDLEWARE
app.use(cors());
app.use(express.json());

// API ROUTES
app.use("/api/products",   productRoutes);
app.use("/api/customers",  customerRoutes);
app.use("/api/orders",     orderRoutes);
app.use("/api/inventory",  inventoryRoutes);
app.use("/api/suppliers",  supplierRoutes);
app.use("/api/categories", categoryRoutes);

// HEALTH CHECK
app.get("/", (req, res) => {
    res.json({ status: "ok", message: "Grocery Store API Running" });
});

// GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
    console.error("Unhandled error:", err);
    res.status(500).json({ error: "Internal server error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
