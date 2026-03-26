const mysql = require("mysql2");

// Use environment variables for credentials (fallback to defaults for dev)
const db = mysql.createPool({
    host:     process.env.DB_HOST     || "localhost",
    user:     process.env.DB_USER     || "root",
    password: process.env.DB_PASSWORD || "SQLshri",
    database: process.env.DB_NAME     || "grocery_store_dbms",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test connection on startup
db.getConnection((err, connection) => {
    if (err) {
        console.error("Database connection failed:", err.message);
    } else {
        console.log("MySQL Connected (pool)");
        connection.release();
    }
});

module.exports = db;
