// backend/db.js
const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  port: 3000,
  user: "root",
  password: "",
  database: "librali",
  connectTimeout: 20000
});

db.connect((err) => {
  if (err) {
    console.error("❌ Erro ao conectar ao banco:", err);
    return;
  }
  console.log("✅ Conexão bem-sucedida com o banco MySQL!");
});

module.exports = db;


//db.js