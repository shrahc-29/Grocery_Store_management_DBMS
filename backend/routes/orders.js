const express = require("express");
const router  = express.Router();
const db      = require("../db");

// GET ALL ORDERS
router.get("/", (req, res) => {
    const sql = `
        SELECT o.*, c.customer_name
        FROM orders o
        LEFT JOIN customers c ON o.customer_id = c.customer_id
        ORDER BY o.order_id DESC
    `;
    db.query(sql, (err, result) => {
        if (err) {
            console.error("GET /orders error:", err);
            return res.status(500).json({ error: "Failed to fetch orders" });
        }
        res.json(result);
    });
});

// GET ORDER WITH ITEMS
router.get("/:id", (req, res) => {
    db.query(
        "SELECT * FROM orders WHERE order_id = ?",
        [req.params.id],
        (err, orderResult) => {
            if (err) return res.status(500).json({ error: "Failed to fetch order" });
            if (orderResult.length === 0) return res.status(404).json({ error: "Order not found" });

            db.query(
                "SELECT oi.*, p.product_name FROM order_items oi LEFT JOIN products p ON oi.product_id = p.product_id WHERE oi.order_id = ?",
                [req.params.id],
                (err2, itemsResult) => {
                    if (err2) return res.status(500).json({ error: "Failed to fetch order items" });
                    res.json({ ...orderResult[0], items: itemsResult });
                }
            );
        }
    );
});

// CREATE ORDER — uses a connection to run everything in sequence
router.post("/create", (req, res) => {
    const { customer_id, items, total_amount } = req.body;

    if (!customer_id || !items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: "customer_id and items[] are required" });
    }

    // Get a connection from the pool to ensure sequential queries
    db.getConnection((connErr, connection) => {
        if (connErr) {
            console.error("Connection error:", connErr);
            return res.status(500).json({ error: "Database connection failed" });
        }

        connection.query(
            "INSERT INTO orders (customer_id, total_amount) VALUES (?, ?)",
            [customer_id, total_amount || 0],
            (err, orderResult) => {
                if (err) {
                    connection.release();
                    console.error("INSERT order error:", err);
                    return res.status(500).json({ error: "Failed to create order" });
                }

                const order_id = orderResult.insertId;
                let pending = items.length;
                let hadError = false;

                items.forEach(item => {
                    const subtotal = item.price * item.quantity;

                    connection.query(
                        "INSERT INTO order_items (order_id, product_id, quantity, price, subtotal) VALUES (?, ?, ?, ?, ?)",
                        [order_id, item.product_id, item.quantity, item.price, subtotal],
                        (err2) => {
                            if (err2 && !hadError) {
                                hadError = true;
                                connection.release();
                                console.error("INSERT order_item error:", err2);
                                return res.status(500).json({ error: "Failed to insert order items" });
                            }

                            connection.query(
                                "UPDATE products SET stock_quantity = stock_quantity - ? WHERE product_id = ? AND stock_quantity >= ?",
                                [item.quantity, item.product_id, item.quantity],
                                (err3) => {
                                    if (err3) console.error("Stock update error:", err3);
                                    pending--;
                                    if (pending === 0 && !hadError) {
                                        connection.release();
                                        res.status(201).json({ message: "Order created", orderId: order_id });
                                    }
                                }
                            );
                        }
                    );
                });
            }
        );
    });
});

module.exports = router;
