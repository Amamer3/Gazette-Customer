# E-Gazette Authentication API Documentation

## Overview
This document outlines the authentication system requirements for the E-Gazette application. The system uses a phone number and OTP-based authentication flow with user registration capabilities.

## Authentication Flow

### 1. Phone Number Login/Registration Check
**Purpose**: Check if a phone number is registered and determine next step (login or registration)

#### Request
```
POST /api/auth/check-phone
Content-Type: application/json

{
  "phone": "+233123456789"
}
```

#### Response - Registered User
```json
{
  "success": true,
  "message": "Phone number is registered",
  "data": {
    "isRegistered": true,
    "userId": "user123",
    "phone": "+233123456789"
  }
}
```

#### Response - Unregistered User
```json
{
  "success": true,
  "message": "Phone number not registered",
  "data": {
    "isRegistered": false,
    "needsRegistration": true
  }
}
```
 
#### Response - Error
```json
{
  "success": false,
  "message": "Invalid phone number format",
  "error": "Phone number must be in international format"
}
```

---

### 2. Send OTP for Login
**Purpose**: Send OTP to registered user's phone for login verification

#### Request
```
POST /api/auth/send-login-otp
Content-Type: application/json

{
  "phone": "+233123456789"
}
```

#### Response - Success
```json
{
  "success": true,
  "message": "OTP sent successfully",
  "data": {
    "otpSent": true,
    "phone": "+233123456789",
    "expiresIn": 300
  }
}
```

#### Response - Error
```json
{
  "success": false,
  "message": "Failed to send OTP",
  "error": "Phone number not registered"
}
```

---

### 3. Verify OTP for Login
**Purpose**: Verify OTP and complete login process

#### Request
```
POST /api/auth/verify-login-otp
Content-Type: application/json

{
  "phone": "+233123456789",
  "otp": "123456"
}
```

#### Response - Success
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "user123",
      "fullName": "John Doe",
      "phone": "+233123456789",
      "email": "john.doe@example.com",
      "dateOfBirth": "1990-01-01",
      "isVerified": true
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 86400
  }
}
```

#### Response - Error
```json
{
  "success": false,
  "message": "Invalid OTP",
  "error": "OTP is incorrect or expired"
}
```

---

### 4. User Registration
**Purpose**: Register a new user with personal information

#### Request
```
POST /api/auth/register
Content-Type: application/json

{
  "fullName": "Jane Smith",
  "phone": "+233987654321",
  "email": "jane.smith@example.com",
  "dateOfBirth": "1985-03-22"
}
```

#### Response - Success
```json
{
  "success": true,
  "message": "Registration successful, OTP sent for verification",
  "data": {
    "userId": "user456",
    "phone": "+233987654321",
    "otpSent": true,
    "expiresIn": 300
  }
}
```

#### Response - Error
```json
{
  "success": false,
  "message": "Registration failed",
  "error": "Phone number already exists"
}
```

---

### 5. Send Registration OTP
**Purpose**: Send OTP for new user verification after registration

#### Request
```
POST /api/auth/send-registration-otp
Content-Type: application/json

{
  "userId": "user456"
}
```

#### Response - Success
```json
{
  "success": true,
  "message": "Registration OTP sent successfully",
  "data": {
    "otpSent": true,
    "phone": "+233987654321",
    "expiresIn": 300
  }
}
```

---

### 6. Verify Registration OTP
**Purpose**: Verify OTP and complete user registration

#### Request
```
POST /api/auth/verify-registration-otp
Content-Type: application/json

{
  "userId": "user456",
  "otp": "654321"
}
```

#### Response - Success
```json
{
  "success": true,
  "message": "Registration completed successfully",
  "data": {
    "user": {
      "id": "user456",
      "fullName": "Jane Smith",
      "phone": "+233987654321",
      "email": "jane.smith@example.com",
      "dateOfBirth": "1985-03-22",
      "isVerified": true
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 86400
  }
}
```

---

### 7. Validate Token
**Purpose**: Validate user authentication token

#### Request
```
POST /api/auth/validate-token
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Response - Valid Token
```json
{
  "success": true,
  "message": "Token is valid",
  "data": {
    "user": {
      "id": "user123",
      "fullName": "John Doe",
      "phone": "+233123456789",
      "email": "john.doe@example.com",
      "isVerified": true
    },
    "isValid": true
  }
}
```

#### Response - Invalid Token
```json
{
  "success": false,
  "message": "Token is invalid or expired",
  "error": "Invalid token"
}
```

---

### 8. Logout
**Purpose**: Logout user and invalidate token

#### Request
```
POST /api/auth/logout
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Response - Success
```json
{
  "success": true,
  "message": "Logout successful"
}
```

---

## Data Models

### User Model
```json
{
  "id": "string",
  "fullName": "string",
  "phone": "string",
  "email": "string",
  "dateOfBirth": "string (YYYY-MM-DD)",
  "isVerified": "boolean",
  "createdAt": "string (ISO 8601)",
  "updatedAt": "string (ISO 8601)"
}
```

### OTP Model
```json
{
  "id": "string",
  "phone": "string",
  "otp": "string",
  "type": "string (login|registration)",
  "userId": "string (optional)",
  "expiresAt": "string (ISO 8601)",
  "isUsed": "boolean",
  "createdAt": "string (ISO 8601)"
}
```

---

## Authentication Headers

### Required Headers
All API requests should include:
```
Content-Type: application/json
```

### Authentication Headers
For protected endpoints:
```
Authorization: Bearer <jwt_token>
APITocken: <api_token>
APPType: WEB
```

---

## Error Codes

| Code | Message | Description |
|------|---------|-------------|
| 400 | Bad Request | Invalid request format |
| 401 | Unauthorized | Invalid or missing token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |

---

## Security Considerations

### 1. OTP Security
- OTP should be 6 digits
- OTP should expire in 5 minutes (300 seconds)
- OTP should be single-use only
- Rate limit OTP requests (max 3 per phone per hour)

### 2. Token Security
- JWT tokens should expire in 24 hours
- Use secure JWT secret
- Implement token refresh mechanism
- Store tokens securely on client

### 3. Phone Number Validation
- Validate international phone number format
- Sanitize phone numbers (remove spaces, special characters)
- Store phone numbers in consistent format

### 4. Rate Limiting
- Limit OTP requests per phone number
- Limit login attempts per IP
- Implement progressive delays for failed attempts

---

## Testing Data

### Test Phone Numbers
```
+233123456789 - Registered user (John Doe)
+233987654321 - Registered user (Jane Smith)
+233555555555 - Registered user (Admin User)
+233111111111 - Registered user (Test User)
```

### Test OTP
```
123456 - Valid OTP for all test numbers
```

---

## Implementation Notes

### 1. Database Schema
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

### 2. JWT Token Structure
```json
{
  "userId": "user123",
  "phone": "+233123456789",
  "isVerified": true,
  "iat": 1640995200,
  "exp": 1641081600
}
```

### 3. SMS Integration
- Integrate with SMS provider (Twilio, AWS SNS, etc.)
- Use template for OTP messages
- Handle SMS delivery failures gracefully

---

## Frontend Integration

### 1. Authentication Context
The frontend uses React Context for authentication state management:
- `isAuthenticated`: boolean
- `user`: User object
- `token`: JWT token
- `phoneNumber`: string
- `otpSent`: boolean

### 2. Local Storage
Store authentication data in localStorage:
- `authToken`: JWT token
- `userData`: User information

### 3. Protected Routes
Routes that require authentication:
- `/dashboard`
- `/applications`
- `/application/:id`
- `/payment/:id`
- `/profile`

### 4. Public Routes
Routes accessible without authentication:
- `/` (Home)
- `/login` (Phone Login)
- `/verify-otp`
- `/register`
- `/verify-registration-otp`
- `/about`
- `/services`

---

## API Endpoints Summary

| Method | Endpoint | Purpose | Auth Required |
|--------|----------|---------|---------------|
| POST | `/api/auth/check-phone` | Check if phone is registered | No |
| POST | `/api/auth/send-login-otp` | Send OTP for login | No |
| POST | `/api/auth/verify-login-otp` | Verify OTP and login | No |
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/send-registration-otp` | Send registration OTP | No |
| POST | `/api/auth/verify-registration-otp` | Verify registration OTP | No |
| POST | `/api/auth/validate-token` | Validate JWT token | Yes |
| POST | `/api/auth/logout` | Logout user | Yes |

---

## Contact Information

For questions or clarifications about this authentication system, please contact the frontend development team.

**Last Updated**: January 2024
**Version**: 1.0
