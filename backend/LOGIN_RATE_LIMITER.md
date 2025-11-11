# Login Rate Limiter - Redis Implementation

## Overview
This system prevents brute force attacks by limiting failed login attempts using Redis.

## Features
✅ **5 Failed Attempts Limit** - Blocks user after 5 incorrect login attempts
✅ **15 Minute Block** - User is blocked for 15 minutes after exceeding limit
✅ **Tracking by Email or IP** - Tracks attempts per email address or IP
✅ **Automatic Reset** - Clears attempts after successful login
✅ **Admin Controls** - Check status and manually unblock users

## Configuration
- **MAX_ATTEMPTS**: 5 failed attempts allowed
- **BLOCK_DURATION**: 900 seconds (15 minutes)
- **ATTEMPT_WINDOW**: 900 seconds (15 minutes)

## How It Works

### 1. Normal Login Flow
```
Attempt 1: ❌ Wrong password → "Invalid credentials. 4 attempt(s) remaining."
Attempt 2: ❌ Wrong password → "Invalid credentials. 3 attempt(s) remaining."
Attempt 3: ❌ Wrong password → "Invalid credentials. 2 attempt(s) remaining."
Attempt 4: ❌ Wrong password → "Invalid credentials. 1 attempt(s) remaining."
Attempt 5: ❌ Wrong password → "Invalid credentials. Account will be locked after this attempt."
Attempt 6: 🚫 BLOCKED → "Account temporarily locked. Please try again in 15 minutes."
```

### 2. Successful Login
```
Attempt 1: ❌ Wrong password → Tracked in Redis
Attempt 2: ✅ Correct password → All attempts cleared automatically
```

## API Endpoints

### Login (with rate limiting)
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Logged in successfully",
  "data": {
    "id": "user_id",
    "name": "John Doe",
    "email": "user@example.com"
  }
}
```

**Failed Attempt Response (401):**
```json
{
  "success": false,
  "message": "Invalid credentials. 3 attempt(s) remaining.",
  "attemptsRemaining": 3
}
```

**Blocked Response (429):**
```json
{
  "success": false,
  "message": "Too many failed login attempts. Please try again in 14 minute(s).",
  "blockedUntil": "2025-11-10T15:30:00.000Z",
  "attemptsRemaining": 0
}
```

## Admin Endpoints

### Check Login Attempt Status
```http
GET /api/admin/login-attempts/:identifier

Example: GET /api/admin/login-attempts/user@example.com
```

**Response:**
```json
{
  "success": true,
  "data": {
    "identifier": "user@example.com",
    "blocked": true,
    "attempts": 5,
    "remaining": 0,
    "blockedFor": 840,
    "unblockAt": "2025-11-10T15:30:00.000Z",
    "maxAttempts": 5,
    "blockDuration": 900
  }
}
```

### Manually Unblock User
```http
POST /api/admin/unblock-user
Content-Type: application/json

{
  "identifier": "user@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User user@example.com has been unblocked"
}
```

### Get Rate Limit Configuration
```http
GET /api/admin/rate-limit-config
```

**Response:**
```json
{
  "success": true,
  "data": {
    "maxAttempts": 5,
    "blockDurationSeconds": 900,
    "blockDurationMinutes": 15,
    "description": "Users are blocked after exceeding max attempts within the window period"
  }
}
```

## Redis Keys Used

### Attempt Counter
```
Key: login_attempts:<email or IP>
Value: Number of failed attempts
TTL: 900 seconds (15 minutes)
```

### Block Status
```
Key: login_blocked:<email or IP>
Value: "blocked"
TTL: 900 seconds (15 minutes)
```

## Testing

### Test Failed Attempts
```bash
# Make 6 failed login attempts
for i in {1..6}; do
  curl -X POST http://localhost:3000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","password":"wrongpassword"}'
  echo ""
done
```

### Check User Status
```bash
curl http://localhost:3000/api/admin/login-attempts/test@example.com
```

### Unblock User
```bash
curl -X POST http://localhost:3000/api/admin/unblock-user \
  -H "Content-Type: application/json" \
  -d '{"identifier":"test@example.com"}'
```

## Security Features

1. **Rate Limiting**: Prevents brute force attacks
2. **Temporary Blocks**: Automatic 15-minute cooldown
3. **Graceful Degradation**: If Redis fails, allows login (fail-open)
4. **IP Tracking**: Falls back to IP if email not provided
5. **Clear Feedback**: Users know how many attempts remain

## Error Handling

- If Redis is unavailable, the middleware allows requests to proceed
- All errors are logged to console
- No sensitive information exposed in error messages

## Customization

To change limits, edit `middleware/loginRateLimiter.js`:

```javascript
const MAX_ATTEMPTS = 5;          // Change max attempts
const BLOCK_DURATION = 15 * 60;  // Change block time (seconds)
const ATTEMPT_WINDOW = 15 * 60;  // Change attempt window (seconds)
```

## Monitoring

Console logs provide real-time monitoring:

```
⚠️ Failed login attempt for user@example.com: 1/5
⚠️ Failed login attempt for user@example.com: 2/5
⚠️ Failed login attempt for user@example.com: 3/5
✅ Cleared failed attempts for user@example.com
```

## Files Created

1. **middleware/loginRateLimiter.js** - Main rate limiter logic
2. **routes/admin.js** - Admin endpoints for management
3. **routes/auth.js** - Updated login route with rate limiting

## Dependencies

- Redis (already installed: `redis@5.9.0`)
- Express
- bcrypt
- express-validator

## Production Recommendations

1. **Monitor Redis**: Set up alerts for Redis connection failures
2. **Adjust Limits**: Consider different limits for production
3. **Add Logging**: Integrate with logging service (e.g., Winston)
4. **CAPTCHA**: Add CAPTCHA after 3 failed attempts
5. **Email Alerts**: Notify users of suspicious login attempts
6. **Admin Dashboard**: Create UI for managing blocked users
