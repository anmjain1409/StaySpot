# StaySpot - Accommodation Rental Platform

A modern full-stack web application for renting and booking accommodations.

## 🌟 Features

### Authentication & Authorization
- User Registration with validation
- User Login with JWT token-based authentication
- Secure password encryption using BCrypt
- Token persistence in browser localStorage

### Frontend Features
- Clean and modern UI with glass-morphism design
- Responsive layout for desktop and mobile
- Real-time form validation
- Easy navigation between pages
- Protected user dashboard

### Backend Features
- RESTful API architecture
- Spring Boot 3.3.0 framework
- MySQL database integration
- JWT token generation and validation
- CORS support for frontend integration
- Comprehensive error handling

## 📋 Tech Stack

### Frontend
- **React 18** - UI Framework
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **CSS3** - Styling with glass-morphism effects
- **JavaScript ES6+** - Modern JavaScript

### Backend
- **Spring Boot 3.3.0** - Web framework
- **Spring Data JPA** - ORM framework
- **Spring Security** - Authentication
- **MySQL 8.0** - Relational database
- **JWT (JJWT)** - Token-based authentication
- **Lombok** - Boilerplate reduction
- **Maven** - Build automation

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ with npm
- Java 17+
- Maven 3.6+
- MySQL 8.0+

### Setup Instructions

1. **Clone the repository**
```bash
git clone https://github.com/anmjain1409/StaySpot.git
cd StaySpot
```

2. **Database Setup**
```bash
mysql -u root -p < backend/MYSQL_SETUP.sql
```

3. **Configure Backend**
Edit `backend/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/stayspot_db
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD
```

4. **Run Backend**
```bash
cd backend
.\maven_fix\apache-maven-3.9.6\bin\mvn.cmd spring-boot:run
```
Backend runs on `http://localhost:8080`

5. **Run Frontend (new terminal)**
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on `http://localhost:5173`

### Quick Start with Script (Windows)
```bash
# Run both backend and frontend
run.bat both

# Or run separately
run.bat backend
run.bat frontend
```

## 📁 Project Structure

```
StaySpot/
├── backend/                          # Spring Boot Backend
│   ├── src/main/java/com/stayspot/
│   │   ├── controller/               # REST Controllers
│   │   │   ├── AuthController.java
│   │   │   └── HealthController.java
│   │   ├── service/                  # Business Logic
│   │   │   └── UserService.java
│   │   ├── repository/               # Data Access
│   │   │   └── UserRepository.java
│   │   ├── model/                    # JPA Entities
│   │   │   └── User.java
│   │   ├── dto/                      # Data Transfer Objects
│   │   │   ├── RegisterRequest.java
│   │   │   ├── LoginRequest.java
│   │   │   └── AuthResponse.java
│   │   ├── security/                 # Security Configuration
│   │   │   ├── JwtUtil.java
│   │   │   └── PasswordEncoderConfig.java
│   │   └── StaySpotApplication.java
│   ├── src/main/resources/
│   │   └── application.properties
│   ├── pom.xml                       # Maven Configuration
│   ├── MYSQL_SETUP.sql               # Database Script
│   └── README.md
│
├── frontend/                         # React Frontend
│   ├── src/
│   │   ├── pages/                    # Page Components
│   │   │   ├── Landing.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── LandlordForm.jsx
│   │   │   ├── LandlordApproval.jsx
│   │   │   └── LandlordStatus.jsx
│   │   ├── services/                 # API Services
│   │   │   └── api.js
│   │   ├── App.jsx                   # Main App Component
│   │   ├── main.jsx                  # Entry Point
│   │   └── index.css                 # Global Styles
│   ├── public/                       # Static Assets
│   ├── package.json
│   ├── vite.config.js
│   └── README.md
│
├── SETUP_GUIDE.md                    # Detailed Setup Guide
├── run.bat                           # Quick Start Script
└── README.md                         # This File
```

## 🔌 API Endpoints

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

Request:
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123",
  "fullName": "John Doe"
}

Response (201 Created):
{
  "message": "Registration successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "username": "john_doe",
  "email": "john@example.com",
  "fullName": "John Doe",
  "success": true
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

Request:
{
  "username": "john_doe",
  "password": "password123"
}

Response (200 OK):
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "username": "john_doe",
  "email": "john@example.com",
  "fullName": "John Doe",
  "success": true
}
```

### Health Check
```http
GET /api/health

Response (200 OK):
"Backend is running!"
```

## 🔐 Security Features

- **Password Encryption**: BCrypt algorithm with strong hashing
- **JWT Tokens**: Secure token-based authentication
- **CORS Configuration**: Restricted to trusted origins
- **Input Validation**: Server-side validation of all inputs
- **Secure Storage**: JWT tokens stored in browser localStorage
- **Database Security**: Prepared statements prevent SQL injection

## 📊 Database Schema

### Users Table
```sql
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

## 🧪 Testing

### Backend Testing with cURL

```bash
# Register User
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "fullName": "Test User"
  }'

# Login User
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "password123"
  }'

# Health Check
curl http://localhost:8080/api/health
```

### Frontend Testing
1. Open `http://localhost:5173`
2. Click "Register" and create an account
3. Login with your credentials
4. Verify JWT token in browser localStorage (F12 → Application)
5. Access dashboard after successful login

## 🐛 Troubleshooting

### Common Issues

**MySQL Connection Failed**
- Ensure MySQL is running: `mysql -u root -p`
- Check database name: `stayspot_db`
- Verify credentials in `application.properties`

**Port 8080 Already in Use**
- Change port in `application.properties`: `server.port=8081`
- Or kill process: `netstat -ano | findstr :8080`

**Dependencies Not Found**
- Run: `mvn clean install`
- Check internet connection
- Verify Maven installation

**Frontend Not Loading**
- Clear browser cache and reload
- Check if port 5173 is available
- Verify Node.js installation: `node -v`

## 📈 Future Features

- Landlord verification and approval system
- Property listing and booking management
- Payment integration (Stripe/Razorpay)
- Review and rating system
- Advanced search and filtering
- Message/Chat between users
- Email notifications
- Mobile app (React Native)
- Analytics dashboard

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

**Anmol Jain**
- GitHub: [@anmjain1409](https://github.com/anmjain1409)
- Email: anmol@stayspot.com

## 🙏 Acknowledgments

- Spring Boot documentation and community
- React documentation
- All contributors and testers

## 📧 Contact & Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Email: support@stayspot.com
- Visit: https://stayspot.com

---

**Made with ❤️ by Anmol Jain**

Last Updated: December 2025
