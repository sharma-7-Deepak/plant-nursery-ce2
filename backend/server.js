/**
 * server.js – Main Express.js Server (CE-2 PostgreSQL + MongoDB Integrated)
 */

const express = require("express");
const path = require("path");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const MongoStore = require("connect-mongo");
const mongoose = require("mongoose");
require("dotenv").config();

const { errorHandler, asyncHandler } = require("./middleware/errorHandler");
const { logger } = require("./middleware/logger");
const productRoutes = require("./routes/products");
const cartRoutes = require("./routes/cart");
const apiRoutes = require("./routes/api");
const pool = require("./db/pool"); // PostgreSQL connection

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/plant_nursery";
const SESSION_SECRET = process.env.SESSION_SECRET || "change_this_in_env";

/* -------------------- Security & Global Middleware -------------------- */
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: [
          "'self'",
          "'unsafe-inline'",
          "https://fonts.googleapis.com",
          "https://cdnjs.cloudflare.com",
          "https://cdn.jsdelivr.net",
          "https://unpkg.com",
        ],
        fontSrc: [
          "'self'",
          "https://fonts.gstatic.com",
          "https://cdnjs.cloudflare.com",
          "https://cdn.jsdelivr.net",
          "https://unpkg.com",
        ],
        scriptSrc: [
          "'self'",
          "'unsafe-inline'",
          "https://cdn.jsdelivr.net",
          "https://cdnjs.cloudflare.com",
        ],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
  })
);

app.use(
  cors({
    origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
    credentials: true,
  })
);
app.use(compression());
if (process.env.NODE_ENV !== "production") app.use(morgan("dev"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 7 },
    store: MongoStore.create({
      mongoUrl: MONGODB_URI,
      collectionName: "sessions",
    }),
  })
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: "Too many requests. Please try again later." },
});
app.use("/api/", limiter);

/* -------------------- Static + View Engine -------------------- */
const frontendPath = path.join(__dirname, "..", "frontend");
app.use(express.static(frontendPath));
console.log(`📁 Serving static files from: ${frontendPath}`);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

/* -------------------- MongoDB (for sessions/auth) -------------------- */
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err.message));

/* -------------------- PostgreSQL Connection Test -------------------- */
(async () => {
  try {
    const client = await pool.connect();
    console.log("✅ Connected to PostgreSQL");
    client.release();
  } catch (err) {
    console.error("❌ PostgreSQL connection error:", err.message);
  }
})();

app.use((req, res, next) => {
  res.locals.currentUser = req.session?.user || null;
  next();
});
app.use(logger);

/* -------------------- PostgreSQL Helper -------------------- */
async function getProductsByCategory(category) {
  const result = await pool.query(
    "SELECT * FROM products WHERE LOWER(category)=LOWER($1)",
    [category]
  );
  return result.rows;
}
async function getAllProducts() {
  const result = await pool.query("SELECT * FROM products ORDER BY id ASC");
  return result.rows;
}

/* -------------------- Render Helper -------------------- */
function renderWithLayout(res, viewName, data = {}) {
  return new Promise((resolve, reject) => {
    res.render(viewName, { ...data }, (err, bodyHtml) => {
      if (err) return reject(err);
      res.render("layout", { ...data, body: bodyHtml }, (layoutErr, fullHtml) => {
        if (layoutErr) return reject(layoutErr);
        res.send(fullHtml);
        resolve();
      });
    });
  });
}

/* -------------------- Route Imports -------------------- */
const paymentRoutes = require("./routes/payment");
const newsletterRoutes = require("./routes/newsletter");
const contactRoutes = require("./routes/contacts");

/* -------------------- API ROUTES -------------------- */
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api", apiRoutes);
app.use("/api/auth", require("./routes/auth"));
app.use("/api/admin", require("./routes/admin")); // Admin routes for rate limit management

// ✅ Defensive middleware binding
if (paymentRoutes && typeof paymentRoutes === "function") {
  app.use("/api/payment", paymentRoutes);
  console.log("✅ Payment route active");
} else {
  console.error("❌ Payment route is not exporting a router function");
}

if (newsletterRoutes && typeof newsletterRoutes === "function") {
  app.use("/api/subscribe", newsletterRoutes);
  console.log("✅ Newsletter route active");
} else {
  console.error("❌ Newsletter route is not exporting a router function");
}

if (contactRoutes && typeof contactRoutes === "function") {
  app.use("/api/contact", contactRoutes);
  console.log("✅ Contact route active");
} else {
  console.error("❌ Contact route is not exporting a router function");
}

/* -------------------- MAIN WEB ROUTES -------------------- */

// Homepage
app.get(
  "/",
  asyncHandler(async (req, res) => {
    const allProducts = await getAllProducts();

    const featuredProducts = allProducts.filter(
      (p) => p.badge && ["popular", "new", "sale"].includes(p.badge)
    );
    const popularProducts = allProducts.sort((a, b) => b.rating - a.rating).slice(0, 8);

    const stats = {
      totalProducts: allProducts.length,
      inStock: allProducts.filter((p) => p.instock).length,
      averageRating:
        allProducts.length > 0
          ? (
              allProducts.reduce((sum, p) => sum + (p.rating || 0), 0) /
              allProducts.length
            ).toFixed(1)
          : 0,
    };

    await renderWithLayout(res, "home", {
      pageTitle: "PlantNursery - Premium Plants & Garden Supplies",
      currentPage: "home",
      featuredProducts,
      popularProducts,
      stats,
      cartSessionId: req.session?.cartId || "",
    });
  })
);

// Products page
app.get(
  "/products",
  asyncHandler(async (req, res) => {
    const category = req.query.category;
    let products = [];
    if (category) {
      const result = await pool.query(
        "SELECT * FROM products WHERE LOWER(category)=LOWER($1)",
        [category]
      );
      products = result.rows;
    } else {
      products = await getAllProducts();
    }

    await renderWithLayout(res, "categories", {
      pageTitle: category
        ? `${category.charAt(0).toUpperCase() + category.slice(1)} Plants`
        : "All Plants - PlantNursery",
      currentPage: "products",
      products,
      currentCategory: category || "all",
      cartSessionId: req.session?.cartId || "",
    });
  })
);

// Pots Page
app.get(
  "/pots",
  asyncHandler(async (req, res) => {
    const pots = await getProductsByCategory("outdoor");
    await renderWithLayout(res, "aux-grid", {
      pageTitle: "Pots & Planters - PlantNursery",
      currentPage: "pots",
      heading: "Pots & Planters",
      subheading: "Style your plants with beautiful planters",
      items: pots,
      ctaLabel: "Add to Cart",
      cartSessionId: req.session?.cartId || "",
    });
  })
);

// Tools Page
app.get(
  "/tools",
  asyncHandler(async (req, res) => {
    const tools = await getProductsByCategory("succulent");
    await renderWithLayout(res, "aux-grid", {
      pageTitle: "Garden Tools - PlantNursery",
      currentPage: "tools",
      heading: "Garden Tools",
      subheading: "Everything you need to help plants thrive",
      items: tools,
      ctaLabel: "Add to Cart",
      cartSessionId: req.session?.cartId || "",
    });
  })
);

// Static Pages
app.get("/about", (req, res) =>
  renderWithLayout(res, "about", { pageTitle: "About Us", currentPage: "about" })
);
app.get("/services", (req, res) =>
  renderWithLayout(res, "services", { pageTitle: "Services", currentPage: "services" })
);
app.get("/contact", (req, res) =>
  renderWithLayout(res, "contact", { pageTitle: "Contact", currentPage: "contact" })
);
app.get("/gifting", (req, res) =>
  renderWithLayout(res, "gifting", { pageTitle: "Plant Gifting", currentPage: "gifting" })
);
app.get("/care", (req, res) =>
  renderWithLayout(res, "care", { pageTitle: "Plant Care Guide", currentPage: "care" })
);

// Checkout Page
app.get("/checkout", (req, res) =>
  renderWithLayout(res, "checkout", {
    pageTitle: "Checkout - Complete Your Order",
    metaDescription:
      "Complete your order securely. Fast checkout and multiple payment options available.",
    currentPage: "checkout",
    cartSessionId: req.session?.cartId || "",
    allProducts: [],
  })
);

/* -------------------- Health Check -------------------- */
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    env: process.env.NODE_ENV || "development",
  });
});

/* -------------------- Error Handling -------------------- */
app.use("*", (req, res) => {
  console.log("❌ 404 Not Found:", req.originalUrl);
  if (req.originalUrl.startsWith("/api/"))
    res.status(404).json({ success: false, error: "API endpoint not found" });
  else res.status(404).sendFile(path.join(frontendPath, "404.html"));
});
app.use(errorHandler);

/* -------------------- Server Startup -------------------- */
const server = app.listen(PORT, () => {
  console.log("\n🌱 ================================");
  console.log("🌱 PLANT NURSERY SERVER STARTED");
  console.log("🌱 ================================");
  console.log(`📁 Serving static files from: ${frontendPath}`);
  console.log(`🌱 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`🌱 Server running on: http://localhost:${PORT}`);
  console.log("✅ Connected to MongoDB");
  console.log("✅ Connected to PostgreSQL");
  console.log("🌱 ================================\n");
});

/* -------------------- Graceful Shutdown -------------------- */
process.on("SIGINT", () => {
  console.log("\n🛑 Server stopping...");
  server.close(() => process.exit(0));
});
process.on("SIGTERM", () => server.close(() => process.exit(0)));
process.on("unhandledRejection", (reason) => {
  console.error("💥 Unhandled Rejection:", reason);
  process.exit(1);
});
process.on("uncaughtException", (err) => {
  console.error("💥 Uncaught Exception:", err);
  process.exit(1);
});

module.exports = app;
