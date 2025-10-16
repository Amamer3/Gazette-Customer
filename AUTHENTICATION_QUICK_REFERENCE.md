# Authentication API Quick Reference

## Essential Endpoints for Backend Implementation

### 1. Check Phone Number 
```
POST /api/auth/check-phone
Body: {"phone": "+233123456789"}
Response: {"success": true, "data": {"isRegistered": true/false}}
```

### 2. Send Login OTP
```
POST /api/auth/send-login-otp
Body: {"phone": "+233123456789"}
Response: {"success": true, "message": "OTP sent successfully"}
```

### 3. Verify Login OTP
```
POST /api/auth/verify-login-otp
Body: {"phone": "+233123456789", "otp": "123456"}
Response: {"success": true, "data": {"user": {...}, "token": "jwt_token"}}
```

### 4. Register User
```
POST /api/auth/register
Body: {"fullName": "John Doe", "phone": "+233123456789", "email": "john@example.com", "dateOfBirth": "1990-01-01"}
Response: {"success": true, "data": {"userId": "user123", "otpSent": true}}
```

### 5. Verify Registration OTP
```
POST /api/auth/verify-registration-otp
Body: {"userId": "user123", "otp": "123456"}
Response: {"success": true, "data": {"user": {...}, "token": "jwt_token"}}
```

## Key Requirements

### OTP Rules
- 6-digit numeric code
- Expires in 5 minutes
- Single-use only
- Rate limit: 3 requests per phone per hour

### JWT Token
- Expires in 24 hours
- Contains: userId, phone, isVerified
- Use secure secret key

### Phone Number Format
- International format: +233123456789
- Remove spaces and special characters
- Validate format before processing

### Test Data
- Test OTP: 123456
- Test phones: +233123456789, +233987654321, +233555555555, +233111111111

## Database Tables Needed

```sql
-- Users table
CREATE TABLE users (
  id VARCHAR(255) PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) UNIQUE NOT NULL,
  email VARCHAR(255),
  date_of_birth DATE,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- OTP table
CREATE TABLE otps (
  id VARCHAR(255) PRIMARY KEY,
  phone VARCHAR(20) NOT NULL,
  otp VARCHAR(6) NOT NULL,
  type ENUM('login', 'registration') NOT NULL,
  user_id VARCHAR(255),
  expires_at TIMESTAMP NOT NULL,
  is_used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

## Response Format
All responses should follow this format:
```json
{
  "success": true/false,
  "message": "Human readable message",
  "data": {...}, // Optional, contains response data
  "error": "Error details" // Only for errors
}
```

## Headers Required
```
Content-Type: application/json
APITocken: <your_api_token>
APPType: WEB
```

For authenticated endpoints:
```
Authorization: Bearer <jwt_token>
```
