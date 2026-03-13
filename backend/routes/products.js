const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/",(req,res)=>{
    db.query("SELECT * FROM products",(err,result)=>{
        if(err) return res.json(err);
        res.json(result);
    });
});

router.post("/add",(req,res)=>{
    const {product_name, category_id, price, stock_quantity, supplier} = req.body;

    const sql = "INSERT INTO products (product_name,category_id,price,stock_quantity,supplier) VALUES (?,?,?,?,?)";

    db.query(sql,[product_name,category_id,price,stock_quantity,supplier],(err,result)=>{
        if(err) return res.json(err);
        res.json("Product Added");
    });
});

router.put("/update/:id",(req,res)=>{
    const id = req.params.id;
    const {product_name,price,stock_quantity} = req.body;

    db.query(
        "UPDATE products SET product_name=?, price=?, stock_quantity=? WHERE product_id=?",
        [product_name,price,stock_quantity,id],
        (err,result)=>{
            if(err) return res.json(err);
            res.json("Product Updated");
        }
    );
});

router.delete("/delete/:id",(req,res)=>{
    const id = req.params.id;

    db.query("DELETE FROM products WHERE product_id=?",[id],(err,result)=>{
        if(err) return res.json(err);
        res.json("Product Deleted");
    });
});

module.exports = router;