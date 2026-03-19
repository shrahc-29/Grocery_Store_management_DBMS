const express = require("express");
const router  = express.Router();
const db      = require("../db");

// GET ALL SUPPLIERS
router.get("/", (req, res) => {
    db.query("SELECT * FROM suppliers ORDER BY supplier_id", (err, result) => {
        if (err) {
            console.error("GET /suppliers error:", err);
            return res.status(500).json({ error: "Failed to fetch suppliers" });
        }
        res.json(result);
    });
});

// ADD SUPPLIER
router.post("/add", (req, res) => {
    const { supplier_name, phone, email, address } = req.body;
    if (!supplier_name) return res.status(400).json({ error: "supplier_name is required" });

    db.query(
        "INSERT INTO suppliers (supplier_name, phone, email, address) VALUES (?, ?, ?, ?)",
        [supplier_name, phone || null, email || null, address || null],
        (err, result) => {
            if (err) {
                console.error("POST /suppliers/add error:", err);
                return res.status(500).json({ error: "Failed to add supplier" });
            }
            res.status(201).json({ message: "Supplier added", insertedId: result.insertId });
        }
    );
});

// UPDATE SUPPLIER
router.put("/update/:id", (req, res) => {
    const { supplier_name, phone, email, address } = req.body;
    db.query(
        "UPDATE suppliers SET supplier_name=?, phone=?, email=?, address=? WHERE supplier_id=?",
        [supplier_name, phone, email, address, req.params.id],
        (err, result) => {
            if (err) {
                console.error("PUT /suppliers/update/:id error:", err);
                return res.status(500).json({ error: "Failed to update supplier" });
            }
            if (result.affectedRows === 0) return res.status(404).json({ error: "Supplier not found" });
            res.json({ message: "Supplier updated" });
        }
    );
});

// DELETE SUPPLIER
router.delete("/delete/:id", (req, res) => {
    db.query("DELETE FROM suppliers WHERE supplier_id = ?", [req.params.id], (err, result) => {
        if (err) {
            console.error("DELETE /suppliers/:id error:", err);
            return res.status(500).json({ error: "Failed to delete supplier" });
        }
        if (result.affectedRows === 0) return res.status(404).json({ error: "Supplier not found" });
        res.json({ message: "Supplier deleted" });
    });
});

module.exports = router;
