# StaySpot - Full Stack Setup Guide

## Project Overview

StaySpot is an accommodation rental platform with a modern React frontend and Spring Boot backend.

### Tech Stack

**Frontend:**
- React 18
- Vite
- React Router
- JavaScript ES6+

**Backend:**
- Spring Boot 3.3.0
- Spring Data JPA
- Spring Security
- MySQL 8.0
- JWT Authentication

## Prerequisites

### System Requirements
- Node.js 16+ and npm
- Java 17+
- Maven 3.6+
- MySQL 8.0+
- Git

### Installation

#### 1. Install Node.js
Download from https://nodejs.org/ (LTS version recommended)

#### 2. Install Java 17
Download from https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html

#### 3. Install Maven
Download from https://maven.apache.org/download.cgi

#### 4. Install MySQL
Download from https://dev.mysql.com/downloads/mysql/

## Project Setup

### Backend Setup

#### 1. Navigate to Backend Directory
```bash
cd backend
```

#### 2. Database Setup

**Option A: Using MySQL Command Line**
```bash
mysql -u root -p < MYSQL_SETUP.sql
```
(Enter password when prompted)

**Option B: Using MySQL Workbench or GUI**
- Open MySQL Workbench
- Create new database named `stayspot_db`
- Run the SQL commands in `MYSQL_SETUP.sql`

#### 3. Update Database Configuration
Edit `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/stayspot_db
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD  # Change if you set MySQL password
```

#### 4. Build the Project
```bash
mvn clean install
```

#### 5. Run the Backend
```bash

```

The backend will start on `http://localhost:8080`

### Frontend Setup

#### 1. Navigate to Frontend Directory
```bash
cd frontend
```

#### 2. Install Dependencies
```bash
npm install
```

#### 3. Run Development Server
```bash
npm run dev
```

The frontend will start on `http://localhost:5173`

## Project Structure

```
StaySpot/
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/stayspot/
│   │   │   │   ├── controller/       # REST API endpoints
│   │   │   │   ├── service/          # Business logic
│   │   │   │   ├── repository/       # Database access
│   │   │   │   ├── model/            # JPA entities
│   │   │   │   ├── dto/              # Data transfer objects
│   │   │   │   ├── security/         # Security & JWT
│   │   │   │   └── StaySpotApplication.java
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/
│   ├── pom.xml
│   ├── README.md
│   ├── MYSQL_SETUP.sql
│   └── .gitignore
│
└── frontend/
    ├── src/
    │   ├── pages/
    │   │   ├── Landing.jsx
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── LandlordForm.jsx
    │   │   ├── LandlordApproval.jsx
    │   │   └── LandlordStatus.jsx
    │   ├── services/
    │   │   └── api.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── public/
    ├── package.json
    ├── vite.config.js
    └── README.md
```

## API Endpoints

### Authentication

**Register User**
```
POST /api/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123",
  "fullName": "John Doe"
}
```

**Response:**
```json
{
  "message": "Registration successful",
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "username": "john_doe",
  "email": "john@example.com",
  "fullName": "John Doe",
  "success": true
}
```

**Login User**
```
POST /api/auth/login
Content-Type: application/json

{
  "username": "john_doe",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "username": "john_doe",
  "email": "john@example.com",
  "fullName": "John Doe",
  "success": true
}
```

**Health Check**
```
GET /api/health

Response: "Backend is running!"
```

## Frontend Routes

- `/` - Landing Page
- `/register` - Registration Page
- `/login` - Login Page
- `/dashboard` - User Dashboard

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## Features Implemented

### Backend
✅ User Registration with validation
✅ User Login with password verification
✅ JWT Token Generation and Validation
✅ Password Encryption (BCrypt)
✅ RESTful API Design
✅ CORS Configuration
✅ MySQL Database Integration
✅ Health Check Endpoint

### Frontend
✅ Authentication Pages (Login/Register)
✅ Protected Routes with Navigation
✅ JWT Token Storage in localStorage
✅ API Integration
✅ Responsive UI with CSS
✅ Form Validation
✅ Landing Page
✅ User Dashboard

## Testing

### Backend Testing with cURL

**Register:**
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "fullName": "Test User"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "password123"
  }'
```

**Health Check:**
```bash
curl http://localhost:8080/api/health
```

### Frontend Testing
1. Open `http://localhost:5173` in browser
2. Click on "Register" to create new account
3. Fill in the registration form
4. Login with your credentials
5. Check browser localStorage for JWT token

## Common Issues & Solutions

### MySQL Connection Error
```
Error: Access denied for user 'root'@'localhost'
```
**Solution:** Update database password in `application.properties`

### Port Already in Use
```
Port 8080 already in use
```
**Solution:** Change port in `application.properties`:
```properties
server.port=8081
```

### CORS Error
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solution:** Backend already has CORS enabled. Check frontend URL in `@CrossOrigin`

### Maven Build Fails
```
mvn clean install
```
**Solution:** Ensure Java 17 is installed: `java -version`

## Running Both Services Simultaneously

### Using Two Terminal Windows

**Terminal 1 - Backend:**
```bash
cd backend
mvn spring-boot:run
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

## Production Build

### Backend
```bash
cd backend
mvn clean package
java -jar target/stayspot-1.0.0.jar
```

### Frontend
```bash
cd frontend
npm run build
```

The built files will be in `frontend/dist/`

## Additional Resources

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [React Documentation](https://react.dev)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [JWT Introduction](https://jwt.io/introduction)

## License

This project is open source and available under the MIT License.

## Support

For issues and questions:
1. Check existing GitHub issues
2. Create a new issue with detailed description
3. Include error messages and screenshots

---

**Happy coding! 🚀**
