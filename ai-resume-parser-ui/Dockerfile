# Stage 1: Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Create env file at build time with default value
RUN echo "VITE_API_URL=http://localhost:3000" > .env

# Build the application
RUN npm run build

# Stage 2: Production stage
FROM node:20-alpine

WORKDIR /app

# Install serve
RUN npm install -g serve

# Copy built files
COPY --from=builder /app/dist ./dist

# Create entrypoint script
COPY <<EOF /entrypoint.sh
#!/bin/sh
echo "window.VITE_API_URL=\"\${VITE_API_URL}\";" > ./dist/env-config.js
exec serve -s dist -l 5173
EOF

RUN chmod +x /entrypoint.sh

EXPOSE 5173

ENTRYPOINT ["/entrypoint.sh"]
