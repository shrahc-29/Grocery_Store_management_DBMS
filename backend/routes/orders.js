const express = require("express");
const router = express.Router();
const db = require("../db");

router.post("/create",(req,res)=>{
    const {customer_id, items, total_amount} = req.body;

    db.query(
        "INSERT INTO orders (customer_id,total_amount) VALUES (?,?)",
        [customer_id,total_amount],
        (err,result)=>{
            if(err) return res.json(err);

            const order_id = result.insertId;

            items.forEach(item => {

                const subtotal = item.price * item.quantity;

                db.query(
                    "INSERT INTO order_items (order_id,product_id,quantity,price,subtotal) VALUES (?,?,?,?,?)",
                    [order_id,item.product_id,item.quantity,item.price,subtotal]
                );

                db.query(
                    "UPDATE products SET stock_quantity = stock_quantity - ? WHERE product_id=?",
                    [item.quantity,item.product_id]
                );
            });

            res.json("Order Created");
        }
    );
});

module.exports = router;