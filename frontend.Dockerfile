# Build stage
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
# Default nginx port
EXPOSE 80
# Copy custom nginx config if needed (we'll use default which works for SPA)
CMD ["nginx", "-g", "daemon off;"]
