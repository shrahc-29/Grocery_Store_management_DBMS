const express = require("express");
const router  = express.Router();
const db      = require("../db");

// GET INVENTORY SUMMARY (all products with movement stats)
router.get("/", (req, res) => {
    const sql = `
        SELECT
            p.product_id,
            p.product_name,
            p.stock_quantity AS remaining,
            COALESCE(SUM(oi.quantity), 0) AS total_sold
        FROM products p
        LEFT JOIN order_items oi ON p.product_id = oi.product_id
        GROUP BY p.product_id, p.product_name, p.stock_quantity
        ORDER BY p.product_id
    `;
    db.query(sql, (err, result) => {
        if (err) {
            console.error("GET /inventory error:", err);
            return res.status(500).json({ error: "Failed to fetch inventory" });
        }
        res.json(result);
    });
});

// ADJUST STOCK (add or subtract)
router.post("/adjust", (req, res) => {
    const { product_id, quantity, type, notes } = req.body;
    // type: 'receive' (add) or 'sell' (subtract)

    if (!product_id || !quantity || !type) {
        return res.status(400).json({ error: "product_id, quantity, and type are required" });
    }

    const delta = type === "receive" ? Math.abs(quantity) : -Math.abs(quantity);

    db.query(
        "UPDATE products SET stock_quantity = stock_quantity + ? WHERE product_id = ?",
        [delta, product_id],
        (err, result) => {
            if (err) {
                console.error("POST /inventory/adjust error:", err);
                return res.status(500).json({ error: "Failed to adjust stock" });
            }
            if (result.affectedRows === 0) return res.status(404).json({ error: "Product not found" });
            res.json({ message: `Stock ${type === "receive" ? "added" : "reduced"} successfully` });
        }
    );
});

module.exports = router;
