import express from "express";

const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// --- Connexion MySQL ---
const db = mysql.createConnection({
    host: "192.168.100.7",
    user: "root",        // adapte si besoin
    password: "azerty",        // adapte si besoin
    database: "jeux" // ta base
});

db.connect((err) => {
    if (err) {
        console.error("❌ Erreur de connexion MySQL :", err);
        return;
    }
    console.log("✅ Connecté à la base MySQL (jeux) sur 192.168.100.7");
});

// --- Lancer le serveur Express ---
app.listen(5000, () => {
    console.log("🚀 Serveur Express démarré sur http://localhost:5000");
});
