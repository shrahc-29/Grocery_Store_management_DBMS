const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/",(req,res)=>{
    db.query("SELECT * FROM customers",(err,result)=>{
        if(err) return res.json(err);
        res.json(result);
    });
});

router.post("/add",(req,res)=>{
    const {customer_name, phone, email} = req.body;

    db.query(
        "INSERT INTO customers (customer_name,phone,email) VALUES (?,?,?)",
        [customer_name,phone,email],
        (err,result)=>{
            if(err) return res.json(err);
            res.json("Customer Added");
        }
    );
});

module.exports = router;