# 🚀 Quick Start Guide - Plant Nursery Website

## ⚡ Get Started in 3 Minutes

### Prerequisites
- ✅ Node.js installed
- ✅ PostgreSQL installed and running
- ✅ MongoDB installed and running

---

## 📦 Installation & Setup

### Step 1: Install Dependencies
```powershell
cd backend
npm install
```

### Step 2: Configure Environment
Create `.env` file in `backend/` directory:

```env
# PostgreSQL Configuration
PGHOST=localhost
PGUSER=postgres
PGPASSWORD=your_password
PGDATABASE=plant_nursery
PGPORT=5432

# MongoDB (for sessions)
MONGODB_URI=mongodb://127.0.0.1:27017/plant_nursery

# Server Configuration
PORT=3000
NODE_ENV=development
SESSION_SECRET=your_random_secret_key_here
```

### Step 3: Initialize Database
The tables will be created automatically when you start the server!

Alternatively, run manually:
```powershell
psql -U postgres -d plant_nursery -f backend/database/init-complete.sql
```

### Step 4: Start the Server
```powershell
cd backend
npm start
```

You should see:
```
🌱 ================================
🌱 PLANT NURSERY SERVER STARTED
🌱 ================================
📁 Serving static files from: ...
🌱 Server running on: http://localhost:3000
✅ Connected to MongoDB
✅ Connected to PostgreSQL
✅ Payment route active
✅ Newsletter route active
✅ Contact route active
🌱 ================================
```

---

## 🎯 Test the Features

### 1. Test Checkout Payment

**Visit:** http://localhost:3000/checkout

1. Add items to cart from products page
2. Click cart icon
3. Click "Proceed to Checkout"
4. Fill in shipping details
5. Select payment method
6. Click "Complete Order"
7. ✅ See success modal with order number!

**Verify in Database:**
```sql
SELECT * FROM orders ORDER BY created_at DESC LIMIT 5;
```

---

### 2. Test Newsletter Subscription

**Visit any page with footer (e.g., http://localhost:3000/)**

1. Scroll to footer
2. Enter email in newsletter form
3. Click "Subscribe"
4. ✅ See success message!

**Verify in Database:**
```sql
SELECT * FROM newsletter WHERE is_active = true;
```

**Or use API:**
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/subscribe/count"
```

---

### 3. Test Contact Form

**Visit:** http://localhost:3000/contact

1. Fill in all form fields
2. Check "Subscribe to newsletter" (optional)
3. Click "Send Message"
4. ✅ See success notification!

**Verify in Database:**
```sql
SELECT * FROM contacts ORDER BY created_at DESC LIMIT 5;
```

---

## 🧪 Quick API Tests

### Test Payment API
```powershell
$body = @{
    user_email = "test@example.com"
    cartItems = @(@{productId=1; name="Test Plant"; price=29.99; quantity=1; image="/images/plant.jpg"})
    totalAmount = 29.99
    paymentMethod = "card"
} | ConvertTo-Json -Depth 5

Invoke-RestMethod -Uri "http://localhost:3000/api/payment" -Method POST -Body $body -ContentType "application/json"
```

### Test Newsletter API
```powershell
$body = @{email = "newsletter@test.com"} | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:3000/api/subscribe" -Method POST -Body $body -ContentType "application/json"
```

### Test Contact API
```powershell
$body = @{
    firstName = "Test"
    lastName = "User"
    email = "contact@test.com"
    subject = "Test Subject"
    message = "This is a test message."
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/contact" -Method POST -Body $body -ContentType "application/json"
```

---

## 📊 View Statistics

### Check Database Stats

```sql
-- Order statistics
SELECT * FROM order_stats;

-- Newsletter statistics
SELECT * FROM newsletter_stats;

-- Contact statistics
SELECT * FROM contact_stats;

-- Quick overview
SELECT 
    (SELECT COUNT(*) FROM orders) as total_orders,
    (SELECT COUNT(*) FROM newsletter WHERE is_active = true) as subscribers,
    (SELECT COUNT(*) FROM contacts WHERE is_read = false) as unread_messages;
```

---

## 🔍 Troubleshooting

### Server won't start
**Check:**
- Is PostgreSQL running?
- Is MongoDB running?
- Is port 3000 available?
- Are .env credentials correct?

**Fix:**
```powershell
# Check PostgreSQL
# Windows: Services → PostgreSQL

# Check MongoDB
# Windows: Services → MongoDB

# Check if port is in use
netstat -ano | findstr :3000
```

### Database connection error
**Fix:**
```powershell
# Test PostgreSQL connection
psql -U postgres -d plant_nursery -c "SELECT 1;"

# Check .env file has correct values
# Make sure PGDATABASE exists
```

### Tables not created
**Fix:**
```powershell
# Run SQL script manually
cd backend
psql -U postgres -d plant_nursery -f database/init-complete.sql
```

### Frontend not loading
**Check:**
- Is server running on port 3000?
- Check browser console for errors (F12)
- Check server terminal for errors

---

## 📁 Important URLs

### Web Pages:
- **Home:** http://localhost:3000/
- **Products:** http://localhost:3000/products
- **Contact:** http://localhost:3000/contact
- **Checkout:** http://localhost:3000/checkout
- **Services:** http://localhost:3000/services
- **Care Guide:** http://localhost:3000/care

### API Endpoints:
- **Payment:** POST http://localhost:3000/api/payment
- **Newsletter:** POST http://localhost:3000/api/subscribe
- **Contact:** POST http://localhost:3000/api/contact

---

## 🎨 Feature Highlights

### ✅ Payment Checkout System
- Multi-step checkout process
- Real-time order summary
- Multiple payment methods
- Order tracking
- PostgreSQL storage
- Success confirmation

### ✅ Newsletter Subscription
- Footer integration
- AJAX submission
- Duplicate prevention
- Email validation
- PostgreSQL storage
- Admin endpoints

### ✅ Contact Form
- Comprehensive form
- AJAX submission
- Input validation
- Optional newsletter signup
- PostgreSQL storage
- Admin management

---

## 📚 Next Steps

### 1. Customize Styling
Edit CSS files in:
- `frontend/css/style.css`
- `frontend/css/responsive.css`

### 2. Add Products
Insert products into PostgreSQL:
```sql
INSERT INTO products (name, description, price, category, instock, image) 
VALUES ('Monstera Deliciosa', 'Beautiful indoor plant', 29.99, 'indoor', true, '/images/monstera.jpg');
```

### 3. Configure Email Notifications
Add email service (e.g., SendGrid, Mailgun) to send:
- Order confirmations
- Contact auto-replies
- Newsletter welcome emails

### 4. Add Razorpay Integration
Uncomment Razorpay code in `routes/payment.js` and add API keys to `.env`

---

## 🔐 Security Checklist

Before deploying to production:

- [ ] Change SESSION_SECRET to random string
- [ ] Use strong database passwords
- [ ] Enable HTTPS/SSL
- [ ] Add rate limiting (already configured)
- [ ] Add authentication for admin endpoints
- [ ] Remove development error messages
- [ ] Set NODE_ENV=production
- [ ] Enable database backups
- [ ] Add CSRF protection
- [ ] Configure Content Security Policy (already in place)

---

## 📖 Documentation

For detailed information, see:
- **`IMPLEMENTATION_GUIDE.md`** - Complete feature documentation
- **`API_TESTING_GUIDE.md`** - API testing examples
- **`IMPLEMENTATION_SUMMARY.md`** - Summary of changes

---

## 💻 Development Commands

```powershell
# Start server
npm start

# Start with nodemon (auto-reload)
npm run dev

# Test database connection
psql -U postgres -d plant_nursery -c "SELECT NOW();"

# View server logs
# Server logs appear in the terminal where you ran `npm start`

# Clear console
cls
```

---

## ✨ Success Indicators

You'll know everything is working when:

✅ Server starts without errors  
✅ Console shows "Connected to PostgreSQL"  
✅ Console shows "Connected to MongoDB"  
✅ Console shows route activation messages  
✅ Can visit http://localhost:3000/  
✅ Can add items to cart  
✅ Can checkout successfully  
✅ Can subscribe to newsletter  
✅ Can submit contact form  
✅ Data appears in database tables  

---

## 🎉 You're All Set!

Your Plant Nursery Website is now running with:
- ✅ Full payment checkout system
- ✅ Newsletter subscription
- ✅ Contact form integration
- ✅ PostgreSQL database
- ✅ Clean, commented code
- ✅ Complete documentation

**Happy coding! 🌱**

---

### Need Help?

Check the documentation files:
1. `IMPLEMENTATION_GUIDE.md` - Feature details
2. `API_TESTING_GUIDE.md` - Testing examples
3. `IMPLEMENTATION_SUMMARY.md` - What was changed

Or review server console logs for error messages.

---

*Last Updated: November 6, 2025*
