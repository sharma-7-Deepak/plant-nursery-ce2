# Plant Nursery Backend

A comprehensive Node.js + Express.js backend API for a plant nursery e-commerce website, designed with beginner-friendly comments and extensive documentation.

## Features

### 🚀 **Core Technologies**
- **Node.js** - JavaScript runtime for server-side development
- **Express.js** - Fast, unopinionated web framework
- **EJS** - Embedded JavaScript templating engine
- **File-based Storage** - JSON files for data persistence (easily upgradeable to databases)

### 🔧 **Middleware & Security**
- **CORS** - Cross-origin resource sharing
- **Helmet** - Security headers and protection
- **Morgan** - HTTP request logging
- **Compression** - Response compression for better performance
- **Rate Limiting** - API rate limiting and abuse prevention
- **Input Validation** - Request validation using express-validator

### 📡 **API Endpoints**

#### Products API (`/api/products`)
- `GET /` - Get all products with filtering, sorting, and pagination
- `GET /:id` - Get a specific product by ID
- `GET /category/:category` - Get products by category
- `POST /` - Create a new product (admin)
- `PUT /:id` - Update a product (admin)
- `DELETE /:id` - Delete a product (admin)
- `GET /stats/summary` - Get product statistics

#### Cart API (`/api/cart`)
- `POST /create` - Create a new cart session
- `GET /:sessionId` - Get cart by session ID
- `POST /:sessionId/items` - Add item to cart
- `PUT /:sessionId/items/:productId` - Update item quantity
- `DELETE /:sessionId/items/:productId` - Remove item from cart
- `DELETE /:sessionId/clear` - Clear all cart items
- `GET /:sessionId/summary` - Get cart summary
- `POST /:sessionId/validate` - Validate cart before checkout

#### General API (`/api`)
- `GET /health` - Health check endpoint
- `GET /info` - API information and documentation
- `GET /search` - Global search across products
- `POST /contact` - Contact form submission
- `POST /newsletter/subscribe` - Newsletter subscription
- `GET /popular` - Get popular products
- `GET /featured` - Get featured products
- `GET /categories` - Get product categories with counts

### 🗂️ **Data Structure**

#### Product Object
```json
{
  "id": 1,
  "name": "Monstera Deliciosa",
  "category": "indoor",
  "price": 45.99,
  "originalPrice": 55.99,
  "discount": 18,
  "rating": 4.8,
  "reviews": 124,
  "image": "",
  "description": "A stunning tropical plant...",
  "size": "medium",
  "care": "easy",
  "inStock": true,
  "badge": "popular",
  "details": {
    "lightRequirement": "Bright, indirect light",
    "wateringFrequency": "Weekly",
    "humidity": "Moderate to high",
    "toxicity": "Toxic to pets",
    "origin": "Central America",
    "adultSize": "6-8 feet indoors"
  }
}
```

#### Cart Object
```json
{
  "sessionId": "uuid-string",
  "items": [
    {
      "productId": 1,
      "name": "Monstera Deliciosa",
      "price": 45.99,
      "quantity": 2,
      "addedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "totals": {
    "subtotal": 91.98,
    "tax": 7.82,
    "shipping": 0,
    "total": 99.80
  },
  "itemCount": 2,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

## 🏗️ **Project Structure**

```
backend/
├── server.js              # Main Express server with detailed comments
├── package.json           # Node.js dependencies and scripts
├── middleware/            # Custom middleware functions
│   ├── errorHandler.js   # Global error handling middleware
│   └── logger.js         # Request logging and monitoring
├── routes/               # API route handlers
│   ├── products.js      # Product management routes
│   ├── cart.js          # Shopping cart routes
│   └── api.js           # General API routes
├── data/                # JSON data files
│   ├── products.json    # Product catalog
│   ├── carts.json       # Cart sessions
│   ├── contacts.json    # Contact form submissions
│   └── newsletter.json  # Newsletter subscriptions
└── views/               # EJS templates
    ├── layout.ejs       # Base layout template
    └── home.ejs         # Homepage template
```

## 🚀 **Getting Started**

### Prerequisites
- **Node.js** (v14.0.0 or higher)
- **npm** (comes with Node.js)

### Installation

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **For production:**
   ```bash
   npm start
   ```

### Available Scripts

- `npm start` - Start the production server
- `npm run dev` - Start development server with auto-restart (nodemon)
- `npm test` - Run tests (placeholder for now)
- `npm run setup` - Install dependencies and show setup completion message

## 🔍 **API Usage Examples**

### Get All Products
```bash
curl "http://localhost:3001/api/products"
```

### Get Products with Filters
```bash
curl "http://localhost:3001/api/products?category=indoor&care=easy&sort=price-low&limit=12"
```

### Search Products
```bash
curl "http://localhost:3001/api/search?q=monstera&limit=5"
```

### Create a New Cart
```bash
curl -X POST "http://localhost:3001/api/cart/create"
```

### Add Item to Cart
```bash
curl -X POST "http://localhost:3001/api/cart/{sessionId}/items" \
  -H "Content-Type: application/json" \
  -d '{"productId": 1, "quantity": 2}'
```

## 🛠️ **Development Features**

### Extensive Comments
Every file includes detailed comments explaining:
- **What** each piece of code does
- **Why** it's implemented that way
- **How** it fits into the larger system
- **When** certain approaches should be used

### Error Handling
- Global error handler with custom error types
- Async error handling wrapper
- Detailed error logging and monitoring
- User-friendly error responses

### Input Validation
- Request parameter validation
- Query parameter sanitization
- Request body validation
- File upload validation (prepared for future use)

### Logging & Monitoring
- HTTP request logging with Morgan
- Custom security monitoring
- Rate limiting monitoring
- File-based logging for production

## 🔐 **Security Features**

- **Helmet.js** - Security headers (XSS, CSRF protection, etc.)
- **CORS** - Properly configured cross-origin requests
- **Rate Limiting** - Prevents API abuse and DDoS attacks
- **Input Validation** - Prevents injection attacks
- **Error Sanitization** - Prevents information leakage

## 📚 **Learning Objectives**

This backend is designed to teach:

1. **Node.js Fundamentals**
   - Module system and require/import
   - Asynchronous programming with async/await
   - File system operations
   - HTTP server creation

2. **Express.js Framework**
   - Routing and middleware
   - Request/response handling
   - Static file serving
   - Template engine integration

3. **RESTful API Design**
   - HTTP methods and status codes
   - Resource-based URLs
   - JSON API responses
   - Pagination and filtering

4. **Error Handling**
   - Try-catch patterns
   - Global error handlers
   - Custom error types
   - Error logging

5. **Security Best Practices**
   - Input validation
   - Security headers
   - Rate limiting
   - CORS configuration

6. **Data Management**
   - JSON file operations
   - Data validation
   - CRUD operations
   - Data relationships

## 🌐 **API Documentation**

Visit `http://localhost:3001/api/info` for complete API documentation and available endpoints.

## 🤝 **Contributing**

This project is designed for learning purposes. Feel free to:
- Add more features
- Improve documentation
- Enhance error handling
- Add database integration
- Implement authentication

## 📝 **Next Steps for Enhancement**

1. **Database Integration** - Replace JSON files with MongoDB or PostgreSQL
2. **Authentication** - Add user login and JWT tokens
3. **Payment Processing** - Integrate with Stripe or PayPal
4. **Image Upload** - Add multer middleware for plant images
5. **Email Service** - Send confirmation emails and newsletters
6. **Caching** - Add Redis for better performance
7. **Testing** - Add unit and integration tests

## 🐛 **Troubleshooting**

### Common Issues

**Port already in use:**
```bash
Error: listen EADDRINUSE: address already in use :::3001
```
Solution: Change the port in server.js or kill the process using the port.

**Module not found:**
```bash
Error: Cannot find module 'express'
```
Solution: Run `npm install` to install dependencies.

**Permission denied:**
```bash
EACCES: permission denied
```
Solution: Check file permissions or run with appropriate privileges.

## 📞 **Support**

For questions or issues:
1. Check the extensive comments in the code
2. Review the API documentation at `/api/info`
3. Look at the example requests in this README
4. Check the troubleshooting section

---

**Happy coding! 🌱**