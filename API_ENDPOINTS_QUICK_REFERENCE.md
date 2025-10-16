# API Endpoints Quick Reference

## Essential Endpoints for E-Gazette Project

### 🔐 AUTHENTICATION (8 endpoints)
```
POST /api/auth/check-phone          - Check if phone is registered
POST /api/auth/send-login-otp       - Send OTP for login
POST /api/auth/verify-login-otp     - Verify OTP and login
POST /api/auth/register             - Register new user
POST /api/auth/send-registration-otp - Send registration OTP
POST /api/auth/verify-registration-otp - Verify registration OTP
POST /api/auth/validate-token       - Validate JWT token
POST /api/auth/logout               - Logout user
```

### 📋 SERVICE MANAGEMENT (2 endpoints)
```
POST /API/GPLoginweb/API_GetParamDetails - Get all services
POST /API/GPLoginweb/API_GazetteList     - Get gazette plans (PaymentPlan: 64,65,66)
```

### 📝 APPLICATION MANAGEMENT (4 endpoints)
```
POST /API/GPLoginweb/API_SubmitApplication    - Submit new application
POST /API/GPLoginweb/API_GetUserApplications  - Get user's applications
POST /API/GPLoginweb/API_GetApplicationDetails - Get application details
POST /API/GPLoginweb/API_UpdateApplicationStatus - Update application status
```

### 💳 PAYMENT (3 endpoints)
```
POST /API/GPLoginweb/API_InitializePayment - Initialize payment
POST /API/GPLoginweb/API_VerifyPayment     - Verify payment status
POST /API/GPLoginweb/API_GetPaymentHistory - Get payment history
```

### 📄 DOCUMENT MANAGEMENT (2 endpoints)
```
POST /API/GPLoginweb/API_UploadDocument        - Upload documents
POST /API/GPLoginweb/API_GetApplicationDocuments - Get application documents
```

### 🔔 NOTIFICATIONS (2 endpoints)
```
POST /API/GPLoginweb/API_SendNotification - Send SMS/Email notifications
POST /API/GPLoginweb/API_GetNotifications - Get user notifications
```

### 📊 REPORTING (2 endpoints)
```
POST /API/GPLoginweb/API_GenerateReceipt      - Generate payment receipt
POST /API/GPLoginweb/API_GetApplicationReport - Get application status report
```

### ⚙️ SYSTEM (2 endpoints)
```
GET  /API/GPLoginweb/API_HealthCheck     - System health check
POST /API/GPLoginweb/API_GetSystemConfig - Get system configuration
```

---

## Required Headers for All Requests
```
Content-Type: application/json
APITocken: AyTRfghyNoo987-ghtuHH86YYR
APPType: WEB
```

For authenticated endpoints, also include:
```
Authorization: Bearer <jwt_token>
```

---

## Payment Plan Structure
- **"64"** → PREMIUM PLUS (Fastest processing, premium features)
- **"65"** → PREMIUM GAZETTE (Balanced processing, enhanced features)  
- **"66"** → REGULAR GAZETTE (Standard processing, essential features)

---

## Implementation Priority

### 🚨 Phase 1 (Critical - Must Have)
1. Authentication endpoints (phone/OTP flow)
2. Service and plan retrieval
3. Application submission
4. Basic payment initialization

### ⚡ Phase 2 (Important - Should Have)
1. Application management
2. Payment verification
3. Document upload
4. Basic notifications

### 🎯 Phase 3 (Nice to Have)
1. Advanced reporting
2. System monitoring
3. Analytics

---

## Test Data
- **Test Phones**: `+233123456789`, `+233987654321`, `+233555555555`, `+233111111111`
- **Test OTP**: `123456`
- **Test Service ID**: `59`
- **Test Payment Plans**: `64`, `65`, `66`

---

## Response Format
All endpoints should return:
```json
{
  "success": true/false,
  "message": "Human readable message",
  "data": {...},
  "error": "Error details (if any)"
}
```

**Total: 25+ endpoints across 8 categories**
