const express = require("express");
const router  = express.Router();
const db      = require("../db");

// GET ALL PRODUCTS (with category name via JOIN if categories table exists)
router.get("/", (req, res) => {
    const sql = `
        SELECT p.*, c.category_name
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.category_id
        ORDER BY p.product_id
    `;
    db.query(sql, (err, result) => {
        if (err) {
            console.error("GET /products error:", err);
            return res.status(500).json({ error: "Failed to fetch products" });
        }
        res.json(result);
    });
});

// GET SINGLE PRODUCT
router.get("/:id", (req, res) => {
    const sql = "SELECT * FROM products WHERE product_id = ?";
    db.query(sql, [req.params.id], (err, result) => {
        if (err) {
            console.error("GET /products/:id error:", err);
            return res.status(500).json({ error: "Failed to fetch product" });
        }
        if (result.length === 0) return res.status(404).json({ error: "Product not found" });
        res.json(result[0]);
    });
});

// ADD PRODUCT
router.post("/add", (req, res) => {
    const { product_name, category_id, price, stock_quantity, supplier } = req.body;

    if (!product_name || !price || stock_quantity === undefined) {
        return res.status(400).json({ error: "product_name, price, and stock_quantity are required" });
    }

    const sql =
        "INSERT INTO products (product_name, category_id, price, stock_quantity, supplier) VALUES (?, ?, ?, ?, ?)";
    db.query(sql, [product_name, category_id, price, stock_quantity, supplier], (err, result) => {
        if (err) {
            console.error("POST /products/add error:", err);
            return res.status(500).json({ error: "Failed to add product" });
        }
        res.status(201).json({ message: "Product added", insertedId: result.insertId });
    });
});

// UPDATE PRODUCT
router.put("/update/:id", (req, res) => {
    const { product_name, category_id, price, stock_quantity, supplier } = req.body;
    const id = req.params.id;

    const sql =
        "UPDATE products SET product_name=?, category_id=?, price=?, stock_quantity=?, supplier=? WHERE product_id=?";
    db.query(sql, [product_name, category_id, price, stock_quantity, supplier, id], (err, result) => {
        if (err) {
            console.error("PUT /products/update/:id error:", err);
            return res.status(500).json({ error: "Failed to update product" });
        }
        if (result.affectedRows === 0) return res.status(404).json({ error: "Product not found" });
        res.json({ message: "Product updated" });
    });
});

// DELETE PRODUCT
router.delete("/delete/:id", (req, res) => {
    db.query("DELETE FROM products WHERE product_id = ?", [req.params.id], (err, result) => {
        if (err) {
            console.error("DELETE /products/delete/:id error:", err);
            return res.status(500).json({ error: "Failed to delete product" });
        }
        if (result.affectedRows === 0) return res.status(404).json({ error: "Product not found" });
        res.json({ message: "Product deleted" });
    });
});

// GET LOW STOCK PRODUCTS (stock < threshold, default 20)
router.get("/alerts/low-stock", (req, res) => {
    const threshold = parseInt(req.query.threshold) || 20;
    db.query(
        "SELECT * FROM products WHERE stock_quantity < ? ORDER BY stock_quantity ASC",
        [threshold],
        (err, result) => {
            if (err) {
                console.error("GET /products/alerts/low-stock error:", err);
                return res.status(500).json({ error: "Failed to fetch low stock products" });
            }
            res.json(result);
        }
    );
});

module.exports = router;
