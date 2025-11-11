// backend/db/importData.js
const fs = require("fs");
const path = require("path");
const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  port: process.env.PGPORT,
});

async function importData() {
  try {
    // ---- PRODUCTS ----
    const productsFile = path.join(__dirname, "../data/products.json");
    const productsData = JSON.parse(fs.readFileSync(productsFile, "utf8"));
    for (const p of productsData) {
      await pool.query(
        `INSERT INTO products
        (name, category, price, badge, description, instock, image,
         lightRequirement, wateringFrequency, humidity, toxicity, origin, adultSize)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
         ON CONFLICT DO NOTHING`,
        [
          p.name,
          p.category,
          p.price,
          p.badge,
          p.description,
          p.inStock,
          p.image,
          p.lightRequirement,
          p.wateringFrequency,
          p.humidity,
          p.toxicity,
          p.origin,
          p.adultSize,
        ]
      );
    }
    console.log("✅ Products imported successfully.");

    // ---- CONTACTS ----
    const contactsFile = path.join(__dirname, "../data/contacts.json");
    if (fs.existsSync(contactsFile)) {
      const contactsData = JSON.parse(fs.readFileSync(contactsFile, "utf8"));
      for (const c of contactsData) {
        await pool.query(
          "INSERT INTO contacts (name, email, message) VALUES ($1,$2,$3)",
          [c.name, c.email, c.message]
        );
      }
      console.log("✅ Contacts imported successfully.");
    }

    // ---- CARTS ----
    const cartsFile = path.join(__dirname, "../data/carts.json");
    if (fs.existsSync(cartsFile)) {
      const cartsData = JSON.parse(fs.readFileSync(cartsFile, "utf8"));
      for (const c of cartsData) {
        await pool.query(
          "INSERT INTO carts (user_email, product_id, quantity) VALUES ($1,$2,$3)",
          [c.user_email || null, c.product_id || null, c.quantity || 1]
        );
      }
      console.log("✅ Carts imported successfully.");
    }

    // ---- NEWSLETTER ----
    const newsletterFile = path.join(__dirname, "../data/newsletter.json");
    if (fs.existsSync(newsletterFile)) {
      const newsletterData = JSON.parse(fs.readFileSync(newsletterFile, "utf8"));
      for (const n of newsletterData) {
        await pool.query(
          "INSERT INTO newsletter (email) VALUES ($1) ON CONFLICT DO NOTHING",
          [n.email]
        );
      }
      console.log("✅ Newsletter imported successfully.");
    }

    console.log("🎉 All data imported successfully!");
  } catch (err) {
    console.error("❌ Error importing data:", err.message);
  } finally {
    await pool.end();
  }
}

importData();
