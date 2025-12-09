# README.md

# StaySpot Backend

A Spring Boot REST API for the StaySpot accommodation rental platform.

## Prerequisites

- Java 17 or higher
- Maven 3.6 or higher
- MySQL 8.0 or higher
- Git

## Database Setup

### Create the Database

```sql
CREATE DATABASE stayspot_db;
USE stayspot_db;
```

### Or run the setup script

```bash
mysql -u root < MYSQL_SETUP.sql
```

## Configuration

Update the database credentials in `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/stayspot_db
spring.datasource.username=root
spring.datasource.password=your_password
```

## Building the Project

```bash
mvn clean install
```

## Running the Application

### Using Maven
```bash
mvn spring-boot:run
```

### Using Java
```bash
java -jar target/stayspot-1.0.0.jar
```

The application will start on `http://localhost:8080`

## API Endpoints

### Authentication

- **POST** `/api/auth/register` - Register a new user
- **POST** `/api/auth/login` - Login user

### Health Check

- **GET** `/api/health` - Check if the backend is running

## Request/Response Examples

### Register
```
POST /api/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123",
  "fullName": "John Doe"
}

Response:
{
  "message": "Registration successful",
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "username": "john_doe",
  "email": "john@example.com",
  "fullName": "John Doe",
  "success": true
}
```

### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "username": "john_doe",
  "password": "password123"
}

Response:
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "username": "john_doe",
  "email": "john@example.com",
  "fullName": "John Doe",
  "success": true
}
```

## Project Structure

```
backend/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/
│   │   │       └── stayspot/
│   │   │           ├── controller/          # REST Controllers
│   │   │           ├── service/             # Business Logic
│   │   │           ├── repository/          # Data Access Layer
│   │   │           ├── model/               # JPA Entities
│   │   │           ├── dto/                 # Data Transfer Objects
│   │   │           ├── security/            # Security & JWT Utils
│   │   │           └── StaySpotApplication.java
│   │   └── resources/
│   │       └── application.properties       # Configuration
│   └── test/                                # Test files
└── pom.xml                                  # Maven Configuration
```

## Technologies Used

- **Spring Boot 3.3.0** - Web Framework
- **Spring Data JPA** - ORM
- **MySQL 8.0** - Database
- **Spring Security** - Authentication & Authorization
- **JWT (JJWT)** - Token-based Authentication
- **Lombok** - Boilerplate Reduction
- **Maven** - Build Tool

## Features

- User Registration
- User Login with JWT Token
- Token Validation
- Password Encryption (BCrypt)
- CORS Configuration
- RESTful API Design
- Database Persistence

## Security

- Passwords are encrypted using BCrypt
- JWT tokens are used for stateless authentication
- CORS is configured to allow requests from the frontend

## License

This project is licensed under the MIT License.
