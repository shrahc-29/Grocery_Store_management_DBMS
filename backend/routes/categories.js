const express = require("express");
const router  = express.Router();
const db      = require("../db");

// GET ALL CATEGORIES
router.get("/", (req, res) => {
    db.query("SELECT * FROM categories ORDER BY category_id", (err, result) => {
        if (err) {
            console.error("GET /categories error:", err);
            return res.status(500).json({ error: "Failed to fetch categories" });
        }
        res.json(result);
    });
});

module.exports = router;
