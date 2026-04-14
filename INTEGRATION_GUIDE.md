# Frontend-Backend Integration Guide

## Overview
The StaySpot application is now fully integrated with:
- **Backend**: Spring Boot 3.3.0 running on `http://localhost:8080`
- **Frontend**: React with Vite running on `http://localhost:5173`
- **Database**: MySQL 8.4 with stayspot_db

## Components Integrated

### 1. Register Page (`frontend/src/pages/Register.jsx`)
- **Fields**: Username, Full Name, Email, Password
- **API Endpoint**: `POST /api/auth/register`
- **Flow**:
  1. User fills registration form
  2. Form submission calls `authService.register()`
  3. Backend validates and creates user
  4. JWT token stored in localStorage
  5. Redirects to login page

### 2. Login Page (`frontend/src/pages/Login.jsx`)
- **Fields**: Username, Password
- **API Endpoint**: `POST /api/auth/login`
- **Flow**:
  1. User enters credentials
  2. Form submission calls `authService.login()`
  3. Backend validates credentials
  4. JWT token and user data stored in localStorage
  5. Redirects to dashboard on success

### 3. Dashboard Page (`frontend/src/pages/Dashboard.jsx`)
- **Protection**: Checks for JWT token in localStorage
- **Features**:
  - Displays user information (username, email, fullName)
  - Shows logout button
  - Redirects to login if not authenticated

### 4. API Service (`frontend/src/services/api.js`)
- **Base URL**: `http://localhost:8080/api`
- **Methods**:
  - `authService.register(username, email, password, fullName)`
  - `authService.login(username, password)`
  - `authService.logout()`
  - `authService.getAuthToken()`
  - `authService.isAuthenticated()`
- **Storage**:
  - JWT token: `localStorage.authToken`
  - User data: `localStorage.user` (JSON stringified)

## Prerequisites

### Backend Requirements
- Java 17+ installed
- MySQL 8.4+ running
- Database: `stayspot_db` created
- Database credentials: root / AnshJain29@

### Frontend Requirements
- Node.js 16+ installed
- npm or yarn package manager

## Starting the Application

### 1. Start Backend
```bash
cd backend
mvn clean package -DskipTests
java -jar target/stayspot-1.0.0.jar
```
Expected output:
```
Tomcat started on port 8080
Started StaySpotApplication in X.XXX seconds
```

### 2. Start Frontend
```bash
cd frontend
npm install  # if not already installed
npm run dev
```
Expected output:
```
VITE v4.X.X ready in XXX ms

➜  Local:   http://localhost:5173/
```

## Testing the Integration

### Test 1: User Registration
1. Navigate to `http://localhost:5173/register`
2. Fill in the registration form:
   - Username: `testuser`
   - Full Name: `Test User`
   - Email: `testuser@example.com`
   - Password: `Test@123`
3. Click "Register"
4. Expected: Success message and redirect to login

**Verification**:
- Check MySQL: `SELECT * FROM users WHERE username='testuser';`
- Check browser console: Should see success response with token

### Test 2: User Login
1. Navigate to `http://localhost:5173/login`
2. Enter credentials:
   - Username: `testuser`
   - Password: `Test@123`
3. Click "Login"
4. Expected: Redirect to dashboard

**Verification**:
- Check browser storage (F12 → Application → Local Storage)
- `authToken` should be populated
- `user` should contain user data as JSON

### Test 3: Dashboard Access
1. After login, you should see dashboard with:
   - Welcome message with user's full name
   - User information display
   - Logout button
2. Verify user data is displayed correctly

**Verification**:
- User info matches what was registered
- All fields populated correctly

### Test 4: Logout
1. Click "Logout" button on dashboard
2. Expected: Redirect to login page
3. Verify localStorage is cleared

**Verification**:
- Check browser storage: authToken and user should be removed
- Try accessing dashboard directly: should redirect to login

### Test 5: Authentication Protection
1. Clear localStorage manually (F12 → Application → Local Storage → Clear All)
2. Try navigating to `http://localhost:5173/dashboard`
3. Expected: Automatic redirect to login page

## API Endpoints

### Register
```http
POST http://localhost:8080/api/auth/register
Content-Type: application/json

{
  "username": "testuser",
  "email": "testuser@example.com",
  "password": "Test@123",
  "fullName": "Test User"
}
```

**Response** (201 Created):
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "username": "testuser",
  "email": "testuser@example.com",
  "fullName": "Test User"
}
```

### Login
```http
POST http://localhost:8080/api/auth/login
Content-Type: application/json

{
  "username": "testuser",
  "password": "Test@123"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "username": "testuser",
  "email": "testuser@example.com",
  "fullName": "Test User"
}
```

### Health Check
```http
GET http://localhost:8080/api/health
```

**Response** (200 OK):
```json
{
  "status": "UP"
}
```

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## Troubleshooting

### Backend Not Starting
- Check MySQL is running: `mysql -u root -p`
- Verify database exists: `SHOW DATABASES;`
- Check port 8080 is free: `netstat -ano | findstr :8080`

### Frontend Cannot Connect to Backend
- Ensure backend is running on port 8080
- Check browser console for CORS errors
- Verify `http://localhost:5173` is in CORS allowed origins

### Registration/Login Fails
- Check backend logs for error messages
- Verify database connection: `SELECT COUNT(*) FROM users;`
- Test endpoint with Postman or curl

### Token Not Stored
- Check browser console for errors
- Verify localStorage is enabled
- Check API response includes `token` field

## Environment Configuration

### Backend (application.properties)
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/stayspot_db
spring.datasource.username=root
spring.datasource.password=AnshJain29@
spring.jpa.hibernate.ddl-auto=update
jwt.secret=your_secret_key_here
jwt.expiration=86400000
```

### Frontend (api.js)
```javascript
const API_BASE_URL = "http://localhost:8080/api";
```

## File Structure

```
StaySpot/
├── backend/
│   ├── src/main/java/com/stayspot/
│   │   ├── StaySpotApplication.java
│   │   ├── controller/
│   │   │   ├── AuthController.java
│   │   │   └── HealthController.java
│   │   ├── dto/
│   │   │   ├── AuthResponse.java
│   │   │   ├── LoginRequest.java
│   │   │   └── RegisterRequest.java
│   │   ├── model/
│   │   │   └── User.java
│   │   ├── repository/
│   │   │   └── UserRepository.java
│   │   ├── security/
│   │   │   ├── JwtUtil.java
│   │   │   ├── PasswordEncoderConfig.java
│   │   │   └── SecurityConfig.java
│   │   └── service/
│   │       └── UserService.java
│   └── pom.xml
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Register.jsx (Updated)
│   │   │   ├── Login.jsx (Updated)
│   │   │   └── Dashboard.jsx (Updated)
│   │   ├── services/
│   │   │   └── api.js (Updated)
│   │   └── App.jsx
│   └── package.json
└── INTEGRATION_GUIDE.md (This file)
```

## Next Steps

1. **Testing**: Run through all test scenarios above
2. **Error Handling**: Add more comprehensive error messages
3. **Form Validation**: Add client-side validation for inputs
4. **Password Requirements**: Implement password strength requirements
5. **Email Verification**: Add email verification flow
6. **Remember Me**: Implement "remember me" functionality
7. **Additional Features**: Add property listing, booking, etc.

## Support

For issues or questions:
1. Check backend logs: `tail -f backend.log`
2. Check browser console (F12)
3. Verify MySQL connectivity
4. Check CORS configuration in SecurityConfig.java
