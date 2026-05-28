# Stage 1: Build stage
FROM node:18-alpine AS build

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy project files and build
COPY . .
RUN npm run build

# Stage 2: Production stage
FROM nginx:stable-alpine

# Copy built files from build stage to nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx config if needed (optional, default is fine for simple SPA)
# EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
