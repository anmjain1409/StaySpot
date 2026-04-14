# 🚀 Deployment Guide: StaySpot

Your project is now configured for easy deployment! Follow these steps to get your application live.

## Option 1: Quick Cloud Deployment (Recommended)

The project is already configured with environment variables to work on platforms like **Render**, **Railway**, or **Vercel**.

### Step 1: Deploy Database
1. Go to [Render](https://render.com) or [Railway](https://railway.app).
2. Create a new **MySQL** database.
3. Copy the **Connection String** (e.g., `mysql://user:pass@host:port/db`).

### Step 2: Deploy Backend
1. Create a new **Web Service** on Render.
2. Connect your GitHub repository: `https://github.com/anmjain1409/StaySpot`.
3. Set **Root Directory** to `backend`.
4. Set **Build Command**: `./apache-maven-3.9.6/bin/mvn clean package -DskipTests`. (Or use the provided Dockerfile).
5. Set **Start Command**: `java -jar target/*.jar`.
6. Add **Environment Variables**:
   - `SPRING_DATASOURCE_URL`: Your DB connection string (with prefix `jdbc:mysql://`).
   - `SPRING_DATASOURCE_USERNAME`: Your DB username.
   - `SPRING_DATASOURCE_PASSWORD`: Your DB password.
   - `JWT_SECRET`: A long random string.

### Step 3: Deploy Frontend
1. Create a new **Static Site** on Render.
2. Set **Root Directory** to `frontend`.
3. Set **Build Command**: `npm install && npm run build`.
4. Set **Publish Directory**: `dist`.
5. Add **Environment Variables**:
   - `VITE_API_BASE_URL`: The URL of your deployed backend (e.g., `https://stayspot-backend.onrender.com/api`).

---

## Option 2: Docker Deployment (Private Server)

If you have a server with Docker installed, you can deploy the full stack with one command:

```bash
docker-compose up -d --build
```

This will start:
- **MySQL** on port `3307`
- **Backend** on port `8080`
- **Frontend** on port `5173` (via Nginx)

---

## 🛠️ Configuration Changes Made
- Updated `backend/src/main/resources/application.properties` to support environment variables.
- Updated `frontend/src/services/api.js` to support dynamic API URLs.
- Added `docker-compose.yml` and `frontend.Dockerfile`.
- Pushed all changes to your GitHub repository.
