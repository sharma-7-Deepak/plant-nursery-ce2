# 🧪 API Testing Guide - Plant Nursery Website

## Quick Test Commands

Use these commands in your terminal or tools like Postman/Thunder Client to test the API endpoints.

---

## 1️⃣ Test Payment API

### Create an Order (POST /api/payment)

**PowerShell:**
```powershell
$body = @{
    user_email = "test@example.com"
    cartItems = @(
        @{
            productId = 1
            name = "Monstera Deliciosa"
            price = 29.99
            quantity = 2
            image = "/images/monstera.jpg"
        },
        @{
            productId = 5
            name = "Snake Plant"
            price = 19.99
            quantity = 1
            image = "/images/snake-plant.jpg"
        }
    )
    totalAmount = 79.97
    paymentMethod = "card"
} | ConvertTo-Json -Depth 10

Invoke-RestMethod -Uri "http://localhost:3000/api/payment" -Method POST -Body $body -ContentType "application/json"
```

**cURL (Windows CMD/PowerShell):**
```bash
curl -X POST http://localhost:3000/api/payment ^
  -H "Content-Type: application/json" ^
  -d "{\"user_email\":\"test@example.com\",\"cartItems\":[{\"productId\":1,\"name\":\"Monstera\",\"price\":29.99,\"quantity\":2}],\"totalAmount\":59.98,\"paymentMethod\":\"card\"}"
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Payment successful! Your order has been placed.",
  "order": {
    "id": 1,
    "orderNumber": "ORD-20251106-A1B2C",
    "email": "test@example.com",
    "totalAmount": 59.98,
    "paymentStatus": "success",
    "paymentMethod": "card"
  }
}
```

### Get Orders by Email (GET /api/payment/orders/:email)

**PowerShell:**
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/payment/orders/test@example.com" -Method GET
```

**cURL:**
```bash
curl http://localhost:3000/api/payment/orders/test@example.com
```

### Get Order by Number (GET /api/payment/order/:orderNumber)

**PowerShell:**
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/payment/order/ORD-20251106-A1B2C" -Method GET
```

**cURL:**
```bash
curl http://localhost:3000/api/payment/order/ORD-20251106-A1B2C
```

---

## 2️⃣ Test Newsletter API

### Subscribe to Newsletter (POST /api/subscribe)

**PowerShell:**
```powershell
$body = @{
    email = "subscriber@example.com"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/subscribe" -Method POST -Body $body -ContentType "application/json"
```

**cURL:**
```bash
curl -X POST http://localhost:3000/api/subscribe ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"subscriber@example.com\"}"
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Thank you for subscribing! You will receive our latest updates and offers.",
  "data": {
    "email": "subscriber@example.com",
    "subscribedAt": "2025-11-06T10:30:00Z"
  }
}
```

### Get Subscriber Count (GET /api/subscribe/count)

**PowerShell:**
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/subscribe/count" -Method GET
```

**cURL:**
```bash
curl http://localhost:3000/api/subscribe/count
```

### List All Subscribers (GET /api/subscribe/list)

**PowerShell:**
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/subscribe/list" -Method GET
```

**cURL:**
```bash
curl http://localhost:3000/api/subscribe/list
```

### Unsubscribe (DELETE /api/subscribe)

**PowerShell:**
```powershell
$body = @{
    email = "subscriber@example.com"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/subscribe" -Method DELETE -Body $body -ContentType "application/json"
```

**cURL:**
```bash
curl -X DELETE http://localhost:3000/api/subscribe ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"subscriber@example.com\"}"
```

---

## 3️⃣ Test Contact API

### Submit Contact Form (POST /api/contact)

**PowerShell:**
```powershell
$body = @{
    firstName = "John"
    lastName = "Doe"
    email = "john.doe@example.com"
    phone = "555-1234"
    subject = "plant-care"
    message = "I need help with caring for my succulents. They seem to be turning brown."
    newsletter = $true
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/contact" -Method POST -Body $body -ContentType "application/json"
```

**cURL:**
```bash
curl -X POST http://localhost:3000/api/contact ^
  -H "Content-Type: application/json" ^
  -d "{\"firstName\":\"John\",\"lastName\":\"Doe\",\"email\":\"john.doe@example.com\",\"phone\":\"555-1234\",\"subject\":\"plant-care\",\"message\":\"How do I care for succulents?\",\"newsletter\":true}"
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Thank you for contacting us! We will get back to you soon.",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john.doe@example.com",
    "subject": "plant-care",
    "createdAt": "2025-11-06T10:30:00Z"
  }
}
```

### Get All Contact Messages (GET /api/contact/all)

**PowerShell:**
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/contact/all" -Method GET
```

**cURL:**
```bash
curl http://localhost:3000/api/contact/all
```

### Get Unread Messages Only (GET /api/contact/all?unreadOnly=true)

**PowerShell:**
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/contact/all?unreadOnly=true" -Method GET
```

**cURL:**
```bash
curl "http://localhost:3000/api/contact/all?unreadOnly=true"
```

### Mark Message as Read (PATCH /api/contact/:id/read)

**PowerShell:**
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/contact/1/read" -Method PATCH
```

**cURL:**
```bash
curl -X PATCH http://localhost:3000/api/contact/1/read
```

### Get Contact Statistics (GET /api/contact/stats/summary)

**PowerShell:**
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/contact/stats/summary" -Method GET
```

**cURL:**
```bash
curl http://localhost:3000/api/contact/stats/summary
```

---

## 🌐 Browser Testing

### Test in Browser Console

Open browser console (F12) on any page and run:

```javascript
// Test Payment
fetch('/api/payment', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    user_email: 'browser@test.com',
    cartItems: [
      {productId: 1, name: 'Test Plant', price: 25.00, quantity: 1}
    ],
    totalAmount: 25.00,
    paymentMethod: 'card'
  })
})
.then(r => r.json())
.then(console.log);

// Test Newsletter
fetch('/api/subscribe', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({email: 'newsletter@test.com'})
})
.then(r => r.json())
.then(console.log);

// Test Contact
fetch('/api/contact', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    firstName: 'Browser',
    lastName: 'Test',
    email: 'contact@test.com',
    subject: 'Test Subject',
    message: 'This is a test message from browser console.',
    newsletter: false
  })
})
.then(r => r.json())
.then(console.log);
```

---

## 🔍 Direct PostgreSQL Queries

Connect to your database and run:

```sql
-- View all orders
SELECT * FROM orders ORDER BY created_at DESC;

-- View all newsletter subscribers
SELECT * FROM newsletter WHERE is_active = true;

-- View all contact messages
SELECT * FROM contacts ORDER BY created_at DESC;

-- Get statistics
SELECT * FROM order_stats;
SELECT * FROM newsletter_stats;
SELECT * FROM contact_stats;

-- Count records
SELECT 
    (SELECT COUNT(*) FROM orders) as total_orders,
    (SELECT COUNT(*) FROM newsletter WHERE is_active = true) as active_subscribers,
    (SELECT COUNT(*) FROM contacts) as total_messages;
```

---

## ✅ Testing Checklist

### Payment System
- [ ] Create order with valid data ✅
- [ ] Create order with empty cart (should fail) ❌
- [ ] Create order with invalid email (should fail) ❌
- [ ] Get orders by email ✅
- [ ] Get order by number ✅
- [ ] Verify order stored in database ✅

### Newsletter System
- [ ] Subscribe with valid email ✅
- [ ] Subscribe with duplicate email (should return success but not duplicate) ✅
- [ ] Subscribe with invalid email (should fail) ❌
- [ ] Unsubscribe ✅
- [ ] Get subscriber count ✅
- [ ] List all subscribers ✅

### Contact System
- [ ] Submit contact form with all fields ✅
- [ ] Submit with newsletter subscription ✅
- [ ] Submit with missing required fields (should fail) ❌
- [ ] Get all messages ✅
- [ ] Get unread messages only ✅
- [ ] Mark message as read ✅
- [ ] Get statistics ✅

---

## 🐛 Common Issues & Solutions

### Issue: Connection refused
**Solution:** Make sure the server is running on port 3000:
```bash
cd backend
npm start
```

### Issue: Database connection error
**Solution:** Check PostgreSQL is running and .env credentials are correct:
```bash
# Check PostgreSQL service
# Windows: Services.msc → PostgreSQL
# Check .env file has correct credentials
```

### Issue: 404 Not Found
**Solution:** Ensure routes are registered in server.js

### Issue: CORS error
**Solution:** Check CORS configuration in server.js allows your origin

---

## 📊 Expected Database State After Testing

After running all tests, your database should have:

```
orders table:
- Multiple test orders
- Different payment methods
- Valid order numbers

newsletter table:
- Several subscriber emails
- Some active, some inactive (if tested unsubscribe)

contacts table:
- Multiple contact messages
- Some marked as read
- Some with newsletter subscription flag
```

---

## 🎯 Quick Test Script

Create `test-apis.ps1` and run all tests at once:

```powershell
# Test Payment API
Write-Host "Testing Payment API..." -ForegroundColor Green
$paymentBody = @{
    user_email = "auto-test@example.com"
    cartItems = @(@{productId=1; name="Test Plant"; price=29.99; quantity=1})
    totalAmount = 29.99
} | ConvertTo-Json -Depth 5
Invoke-RestMethod -Uri "http://localhost:3000/api/payment" -Method POST -Body $paymentBody -ContentType "application/json"

# Test Newsletter API
Write-Host "`nTesting Newsletter API..." -ForegroundColor Green
$newsletterBody = @{email = "auto-test-newsletter@example.com"} | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:3000/api/subscribe" -Method POST -Body $newsletterBody -ContentType "application/json"

# Test Contact API
Write-Host "`nTesting Contact API..." -ForegroundColor Green
$contactBody = @{
    firstName = "Auto"
    lastName = "Test"
    email = "auto-test-contact@example.com"
    subject = "Automated Test"
    message = "This is an automated test message."
} | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:3000/api/contact" -Method POST -Body $contactBody -ContentType "application/json"

Write-Host "`n✅ All tests completed!" -ForegroundColor Green
```

Run with:
```powershell
.\test-apis.ps1
```

---

**Happy Testing! 🚀**
