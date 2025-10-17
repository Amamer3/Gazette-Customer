# Complete API Endpoints Documentation for E-Gazette Project

## Overview
This document outlines all the API endpoints required to complete the E-Gazette project. The application is a comprehensive gazette publication system with authentication, service management, application processing, and payment integration.

## Base Configuration
- **Base URL**: `http://209.236.119.239:2211/` (Production) or `/api` (Development with proxy)
- **Content-Type**: `application/json`
- **Required Headers**:
  - `APITocken`: `AyTRfghyNoo987-ghtuHH86YYR`
  - `APPType`: `WEB`

---

## 1. AUTHENTICATION ENDPOINTS

### 1.1 Check Phone Number Registration
**Purpose**: Verify if a phone number is registered and determine next step (login or registration)

```
POST /api/auth/check-phone
Content-Type: application/json
APITocken: AyTRfghyNoo987-ghtuHH86YYR
APPType: WEB

{
  "phone": "+233123456789"
}
```

**Response - Registered User**:
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

**Response - Unregistered User**:
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

### 1.2 Send Login OTP
**Purpose**: Send OTP to registered user's phone for login verification

```
POST /api/auth/send-login-otp
Content-Type: application/json
APITocken: AyTRfghyNoo987-ghtuHH86YYR
APPType: WEB

{
  "phone": "+233123456789"
}
```

**Response**:
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

### 1.3 Verify Login OTP
**Purpose**: Verify OTP and complete login process

```
POST /api/auth/verify-login-otp
Content-Type: application/json
APITocken: AyTRfghyNoo987-ghtuHH86YYR
APPType: WEB

{
  "phone": "+233123456789",
  "otp": "123456"
}
```

**Response**:
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

### 1.4 User Registration
**Purpose**: Register a new user with personal information

```
POST /api/auth/register
Content-Type: application/json
APITocken: AyTRfghyNoo987-ghtuHH86YYR
APPType: WEB

{
  "fullName": "Jane Smith",
  "phone": "+233987654321",
  "email": "jane.smith@example.com",
  "dateOfBirth": "1985-03-22"
}
```

**Response**:
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

### 1.5 Send Registration OTP
**Purpose**: Send OTP for new user verification after registration

```
POST /api/auth/send-registration-otp
Content-Type: application/json
APITocken: AyTRfghyNoo987-ghtuHH86YYR
APPType: WEB

{
  "userId": "user456"
}
```

### 1.6 Verify Registration OTP
**Purpose**: Verify OTP and complete user registration

```
POST /api/auth/verify-registration-otp
Content-Type: application/json
APITocken: AyTRfghyNoo987-ghtuHH86YYR
APPType: WEB

{
  "userId": "user456",
  "otp": "654321"
}
```

**Response**:
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

### 1.7 Validate Token
**Purpose**: Validate user authentication token

```
POST /api/auth/validate-token
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
APITocken: AyTRfghyNoo987-ghtuHH86YYR
APPType: WEB

{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response**:
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

### 1.8 Logout
**Purpose**: Logout user and invalidate token

```
POST /api/auth/logout
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
APITocken: AyTRfghyNoo987-ghtuHH86YYR
APPType: WEB

{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## 2. SERVICE MANAGEMENT ENDPOINTS

### 2.1 Get All Services
**Purpose**: Retrieve all available gazette services

```
POST /API/GPLoginweb/API_GetParamDetails
Content-Type: application/json
APITocken: AyTRfghyNoo987-ghtuHH86YYR
APPType: WEB

{
  "RequestID": "16"
}
```

**Response**:
```json
{
  "success": true,
  "Message": "Record Found.",
  "SearchDetail": [
    {
      "ID": "59",
      "Nm": "CHANGE OF NAME/CORRECTION OF NAME/CHANGE OF DATE OF BIRTH"
    },
    {
      "ID": "60",
      "Nm": "MARRIAGE OFFICER REGISTRATION"
    },
    {
      "ID": "61",
      "Nm": "COMPANY INCORPORATION"
    }
  ]
}
```

### 2.2 Get Gazette Types/Plans
**Purpose**: Retrieve gazette plans for a specific service with different payment tiers

```
POST /API/GPLoginweb/API_GazetteList
Content-Type: application/json
APITocken: AyTRfghyNoo987-ghtuHH86YYR
APPType: WEB

{
  "GazetteType": "59",
  "PaymentPlan": "64"
}
```

**PaymentPlan Values**:
- `"64"` → PREMIUM PLUS (Fastest processing, premium features)
- `"65"` → PREMIUM GAZETTE (Balanced processing, enhanced features)
- `"66"` → REGULAR GAZETTE (Standard processing, essential features)

**Response**:
```json
{
  "success": true,
  "Message": "Record Found.",
  "SearchDetail": [
    {
      "FeeID": "1",
      "GazzeteType": "CHANGE OF NAME/CORRECTION OF NAME/CHANGE OF DATE OF BIRTH",
      "PaymentPlan": "PREMIUM PLUS APPLICATION",
      "GazetteName": "CHANGE OF NAME",
      "GazetteDetails": "Change of name of persons",
      "ProcessDays": 1,
      "GazetteFee": 2000.0,
      "TaxRate": 0.0,
      "FormTypeCode": "CNM",
      "FormTypeName": "CHANGE OF NAMES",
      "OnWeb": "Y",
      "DocRequired": [
        {
          "ID": "1",
          "DocName": "DU",
          "DocDetails": "ID Proof"
        },
        {
          "ID": "2",
          "DocName": "DU",
          "DocDetails": "Certificate of Name Change"
        }
      ]
    }
  ]
}
```

---

## 3. APPLICATION MANAGEMENT ENDPOINTS

### 3.1 Submit Application
**Purpose**: Submit a new gazette application

```
POST /API/GPLoginweb/API_SubmitApplication
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
APITocken: AyTRfghyNoo987-ghtuHH86YYR
APPType: WEB

{
  "userId": "user123",
  "serviceId": "59",
  "planId": "1",
  "planName": "CHANGE OF NAME",
  "planPrice": 2000.0,
  "paymentPlanType": "64",
  "paymentPlanCategory": "PREMIUM PLUS",
  "formData": {
    "fullName": "John Doe",
    "currentName": "John Smith",
    "newName": "John Doe",
    "dateOfBirth": "1990-01-01",
    "placeOfBirth": "Accra, Ghana",
    "nationality": "Ghanaian",
    "occupation": "Software Developer",
    "address": "123 Main Street, Accra",
    "phoneNumber": "+233123456789",
    "email": "john.doe@example.com",
    "reasonForChange": "Marriage",
    "supportingDocuments": [
      {
        "name": "marriage_certificate.pdf",
        "type": "application/pdf",
        "size": 1024000
      }
    ]
  },
  "submittedAt": "2024-01-15T10:30:00Z",
  "status": "submitted"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Application submitted successfully",
  "data": {
    "applicationId": "APP-2024-001234",
    "referenceNumber": "GZ-2024-001234",
    "status": "submitted",
    "submittedAt": "2024-01-15T10:30:00Z",
    "estimatedProcessingTime": "1 day",
    "nextSteps": [
      "Application received and under review",
      "Document verification in progress",
      "Payment processing required"
    ]
  }
}
```

### 3.2 Get User Applications
**Purpose**: Retrieve all applications for the authenticated user

```
POST /API/GPLoginweb/API_GetUserApplications
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
APITocken: AyTRfghyNoo987-ghtuHH86YYR
APPType: WEB

{
  "userId": "user123",
  "status": "all",
  "limit": 50,
  "offset": 0
}
```

**Response**:
```json
{
  "success": true,
  "message": "Applications retrieved successfully",
  "data": {
    "applications": [
      {
        "id": "APP-2024-001234",
        "referenceNumber": "GZ-2024-001234",
        "serviceName": "CHANGE OF NAME",
        "planName": "PREMIUM PLUS - CHANGE OF NAME",
        "status": "submitted",
        "submittedAt": "2024-01-15T10:30:00Z",
        "estimatedCompletion": "2024-01-16T10:30:00Z",
        "amount": 2000.0,
        "currency": "GHS"
      }
    ],
    "total": 1,
    "hasMore": false
  }
}
```

### 3.3 Get Application Details
**Purpose**: Retrieve detailed information about a specific application

```
POST /API/GPLoginweb/API_GetApplicationDetails
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
APITocken: AyTRfghyNoo987-ghtuHH86YYR
APPType: WEB

{
  "applicationId": "APP-2024-001234",
  "userId": "user123"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Application details retrieved successfully",
  "data": {
    "id": "APP-2024-001234",
    "referenceNumber": "GZ-2024-001234",
    "serviceName": "CHANGE OF NAME",
    "planName": "PREMIUM PLUS - CHANGE OF NAME",
    "status": "submitted",
    "submittedAt": "2024-01-15T10:30:00Z",
    "estimatedCompletion": "2024-01-16T10:30:00Z",
    "amount": 2000.0,
    "currency": "GHS",
    "formData": {
      "fullName": "John Doe",
      "currentName": "John Smith",
      "newName": "John Doe",
      "dateOfBirth": "1990-01-01",
      "placeOfBirth": "Accra, Ghana",
      "nationality": "Ghanaian",
      "occupation": "Software Developer",
      "address": "123 Main Street, Accra",
      "phoneNumber": "+233123456789",
      "email": "john.doe@example.com",
      "reasonForChange": "Marriage"
    },
    "documents": [
      {
        "id": "doc-001",
        "name": "marriage_certificate.pdf",
        "type": "application/pdf",
        "size": 1024000,
        "uploadedAt": "2024-01-15T10:30:00Z",
        "status": "verified"
      }
    ],
    "statusHistory": [
      {
        "status": "submitted",
        "timestamp": "2024-01-15T10:30:00Z",
        "description": "Application submitted successfully"
      }
    ],
    "nextSteps": [
      "Document verification in progress",
      "Payment processing required"
    ]
  }
}
```

### 3.4 Update Application Status
**Purpose**: Update application status (admin/backend use)

```
POST /API/GPLoginweb/API_UpdateApplicationStatus
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
APITocken: AyTRfghyNoo987-ghtuHH86YYR
APPType: WEB

{
  "applicationId": "APP-2024-001234",
  "status": "approved",
  "notes": "Application approved after document verification",
  "updatedBy": "admin123"
}
```

---

## 4. PAYMENT ENDPOINTS

### 4.1 Initialize Payment
**Purpose**: Initialize payment for an application

```
POST /API/GPLoginweb/API_InitializePayment
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
APITocken: AyTRfghyNoo987-ghtuHH86YYR
APPType: WEB

{
  "applicationId": "APP-2024-001234",
  "amount": 2000.0,
  "currency": "GHS",
  "paymentMethod": "mobile_money",
  "phoneNumber": "+233123456789",
  "callbackUrl": "https://e-gazette.com/payment/callback"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Payment initialized successfully",
  "data": {
    "paymentId": "PAY-2024-001234",
    "transactionId": "TXN-2024-001234",
    "amount": 2000.0,
    "currency": "GHS",
    "paymentMethod": "mobile_money",
    "status": "pending",
    "paymentUrl": "https://payments.gateway.com/pay/TXN-2024-001234",
    "expiresAt": "2024-01-15T11:30:00Z"
  }
}
```

### 4.2 Verify Payment
**Purpose**: Verify payment status

```
POST /API/GPLoginweb/API_VerifyPayment
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
APITocken: AyTRfghyNoo987-ghtuHH86YYR
APPType: WEB

{
  "paymentId": "PAY-2024-001234",
  "transactionId": "TXN-2024-001234"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Payment verified successfully",
  "data": {
    "paymentId": "PAY-2024-001234",
    "transactionId": "TXN-2024-001234",
    "status": "completed",
    "amount": 2000.0,
    "currency": "GHS",
    "paidAt": "2024-01-15T10:45:00Z",
    "receipt": {
      "receiptNumber": "RCP-2024-001234",
      "receiptUrl": "https://e-gazette.com/receipts/RCP-2024-001234.pdf"
    }
  }
}
```

### 4.3 Get Payment History
**Purpose**: Retrieve payment history for a user

```
POST /API/GPLoginweb/API_GetPaymentHistory
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
APITocken: AyTRfghyNoo987-ghtuHH86YYR
APPType: WEB

{
  "userId": "user123",
  "limit": 50,
  "offset": 0
}
```

**Response**:
```json
{
  "success": true,
  "message": "Payment history retrieved successfully",
  "data": {
    "payments": [
      {
        "paymentId": "PAY-2024-001234",
        "transactionId": "TXN-2024-001234",
        "applicationId": "APP-2024-001234",
        "amount": 2000.0,
        "currency": "GHS",
        "status": "completed",
        "paymentMethod": "mobile_money",
        "paidAt": "2024-01-15T10:45:00Z",
        "receiptNumber": "RCP-2024-001234"
      }
    ],
    "total": 1,
    "hasMore": false
  }
}
```

---

## 5. DOCUMENT MANAGEMENT ENDPOINTS

### 5.1 Upload Document
**Purpose**: Upload supporting documents for an application

```
POST /API/GPLoginweb/API_UploadDocument
Content-Type: multipart/form-data
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
APITocken: AyTRfghyNoo987-ghtuHH86YYR
APPType: WEB

Form Data:
- file: [binary file data]
- applicationId: "APP-2024-001234"
- documentType: "marriage_certificate"
- description: "Marriage certificate for name change"
```

**Response**:
```json
{
  "success": true,
  "message": "Document uploaded successfully",
  "data": {
    "documentId": "DOC-2024-001234",
    "fileName": "marriage_certificate.pdf",
    "fileSize": 1024000,
    "fileType": "application/pdf",
    "uploadedAt": "2024-01-15T10:30:00Z",
    "status": "uploaded",
    "downloadUrl": "https://e-gazette.com/documents/DOC-2024-001234.pdf"
  }
}
```

### 5.2 Get Application Documents
**Purpose**: Retrieve all documents for an application

```
POST /API/GPLoginweb/API_GetApplicationDocuments
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
APITocken: AyTRfghyNoo987-ghtuHH86YYR
APPType: WEB

{
  "applicationId": "APP-2024-001234"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Documents retrieved successfully",
  "data": {
    "documents": [
      {
        "documentId": "DOC-2024-001234",
        "fileName": "marriage_certificate.pdf",
        "fileSize": 1024000,
        "fileType": "application/pdf",
        "documentType": "marriage_certificate",
        "uploadedAt": "2024-01-15T10:30:00Z",
        "status": "verified",
        "downloadUrl": "https://e-gazette.com/documents/DOC-2024-001234.pdf"
      }
    ]
  }
}
```

---

## 6. NOTIFICATION ENDPOINTS

### 6.1 Send Notification
**Purpose**: Send notification to user (SMS/Email)

```
POST /API/GPLoginweb/API_SendNotification
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
APITocken: AyTRfghyNoo987-ghtuHH86YYR
APPType: WEB

{
  "userId": "user123",
  "type": "sms",
  "message": "Your application GZ-2024-001234 has been approved. Please check your dashboard for details.",
  "phoneNumber": "+233123456789"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Notification sent successfully",
  "data": {
    "notificationId": "NOT-2024-001234",
    "status": "sent",
    "sentAt": "2024-01-15T10:30:00Z"
  }
}
```

### 6.2 Get Notifications
**Purpose**: Retrieve notifications for a user

```
POST /API/GPLoginweb/API_GetNotifications
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
APITocken: AyTRfghyNoo987-ghtuHH86YYR
APPType: WEB

{
  "userId": "user123",
  "limit": 50,
  "offset": 0
}
```

---

## 7. REPORTING ENDPOINTS

### 7.1 Generate Receipt
**Purpose**: Generate receipt for completed payment

```
POST /API/GPLoginweb/API_GenerateReceipt
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
APITocken: AyTRfghyNoo987-ghtuHH86YYR
APPType: WEB

{
  "paymentId": "PAY-2024-001234",
  "applicationId": "APP-2024-001234"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Receipt generated successfully",
  "data": {
    "receiptNumber": "RCP-2024-001234",
    "receiptUrl": "https://e-gazette.com/receipts/RCP-2024-001234.pdf",
    "generatedAt": "2024-01-15T10:45:00Z"
  }
}
```

### 7.2 Get Application Status Report
**Purpose**: Get detailed status report for an application

```
POST /API/GPLoginweb/API_GetApplicationReport
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
APITocken: AyTRfghyNoo987-ghtuHH86YYR
APPType: WEB

{
  "applicationId": "APP-2024-001234"
}
```

---

## 8. SYSTEM ENDPOINTS

### 8.1 Health Check
**Purpose**: Check system health and availability

```
GET /API/GPLoginweb/API_HealthCheck
Content-Type: application/json
APITocken: AyTRfghyNoo987-ghtuHH86YYR
APPType: WEB
```

**Response**:
```json
{
  "success": true,
  "message": "System is healthy",
  "data": {
    "status": "healthy",
    "timestamp": "2024-01-15T10:30:00Z",
    "version": "1.0.0",
    "database": "connected",
    "services": {
      "sms": "available",
      "email": "available",
      "payment": "available"
    }
  }
}
```

### 8.2 Get System Configuration
**Purpose**: Retrieve system configuration and settings

```
POST /API/GPLoginweb/API_GetSystemConfig
Content-Type: application/json
APITocken: AyTRfghyNoo987-ghtuHH86YYR
APPType: WEB

{}
```

---

## 9. ERROR RESPONSES

All endpoints should return consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message",
  "errorCode": "ERROR_CODE",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Common Error Codes:
- `AUTH_001`: Invalid credentials
- `AUTH_002`: Token expired
- `AUTH_003`: Unauthorized access
- `VALID_001`: Validation error
- `PAYMENT_001`: Payment failed
- `PAYMENT_002`: Payment timeout
- `DOCUMENT_001`: File upload failed
- `DOCUMENT_002`: Invalid file type
- `SYSTEM_001`: Internal server error
- `SYSTEM_002`: Service unavailable

---

## 10. IMPLEMENTATION PRIORITY

### Phase 1 (Critical - Must Have):
1. Authentication endpoints (1.1-1.8)
2. Service management endpoints (2.1-2.2)
3. Application submission (3.1)
4. Basic payment initialization (4.1)

### Phase 2 (Important - Should Have):
1. Application management (3.2-3.4)
2. Payment verification (4.2-4.3)
3. Document upload (5.1-5.2)
4. Basic notifications (6.1-6.2)

### Phase 3 (Nice to Have):
1. Advanced reporting (7.1-7.2)
2. System monitoring (8.1-8.2)
3. Advanced notification features
4. Analytics and reporting

---

## 11. TESTING ENDPOINTS

### Test Data:
- **Test Phone Numbers**: `+233123456789`, `+233987654321`, `+233555555555`, `+233111111111`
- **Test OTP**: `123456`
- **Test Service ID**: `59`
- **Test Payment Plans**: `64`, `65`, `66`

### Test Scenarios:
1. **Authentication Flow**: Phone check → OTP → Login/Register
2. **Service Selection**: Get services → Select service → Get plans
3. **Application Flow**: Submit application → Upload documents → Initialize payment
4. **Payment Flow**: Initialize → Verify → Generate receipt
5. **Status Tracking**: Get applications → Check status → Receive notifications

---

## 12. SECURITY CONSIDERATIONS

### Authentication:
- JWT tokens with 24-hour expiry
- OTP with 5-minute expiry and single-use
- Rate limiting on authentication endpoints
- Secure password hashing (if applicable)

### Data Protection:
- Encrypt sensitive data in transit and at rest
- Validate all input data
- Sanitize file uploads
- Implement proper CORS policies

### API Security:
- Use HTTPS for all endpoints
- Implement API rate limiting
- Log all API requests for monitoring
- Regular security audits

---

**Last Updated**: January 2024
**Version**: 1.0
**Total Endpoints**: 25+ endpoints across 8 categories
