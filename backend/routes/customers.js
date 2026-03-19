const express = require("express");
const router  = express.Router();
const db      = require("../db");

// GET ALL CUSTOMERS
router.get("/", (req, res) => {
    db.query("SELECT * FROM customers ORDER BY customer_id", (err, result) => {
        if (err) {
            console.error("GET /customers error:", err);
            return res.status(500).json({ error: "Failed to fetch customers" });
        }
        res.json(result);
    });
});

// GET SINGLE CUSTOMER
router.get("/:id", (req, res) => {
    db.query("SELECT * FROM customers WHERE customer_id = ?", [req.params.id], (err, result) => {
        if (err) {
            console.error("GET /customers/:id error:", err);
            return res.status(500).json({ error: "Failed to fetch customer" });
        }
        if (result.length === 0) return res.status(404).json({ error: "Customer not found" });
        res.json(result[0]);
    });
});

// ADD CUSTOMER
router.post("/add", (req, res) => {
    const { customer_name, phone, email } = req.body;
    if (!customer_name) {
        return res.status(400).json({ error: "customer_name is required" });
    }
    db.query(
        "INSERT INTO customers (customer_name, phone, email) VALUES (?, ?, ?)",
        [customer_name, phone || null, email || null],
        (err, result) => {
            if (err) {
                console.error("POST /customers/add error:", err);
                return res.status(500).json({ error: "Failed to add customer" });
            }
            res.status(201).json({ message: "Customer added", insertedId: result.insertId });
        }
    );
});

// UPDATE CUSTOMER
router.put("/update/:id", (req, res) => {
    const { customer_name, phone, email } = req.body;
    db.query(
        "UPDATE customers SET customer_name=?, phone=?, email=? WHERE customer_id=?",
        [customer_name, phone, email, req.params.id],
        (err, result) => {
            if (err) {
                console.error("PUT /customers/update/:id error:", err);
                return res.status(500).json({ error: "Failed to update customer" });
            }
            if (result.affectedRows === 0) return res.status(404).json({ error: "Customer not found" });
            res.json({ message: "Customer updated" });
        }
    );
});

// DELETE CUSTOMER
router.delete("/delete/:id", (req, res) => {
    db.query("DELETE FROM customers WHERE customer_id = ?", [req.params.id], (err, result) => {
        if (err) {
            console.error("DELETE /customers/:id error:", err);
            return res.status(500).json({ error: "Failed to delete customer" });
        }
        if (result.affectedRows === 0) return res.status(404).json({ error: "Customer not found" });
        res.json({ message: "Customer deleted" });
    });
});

module.exports = router;
