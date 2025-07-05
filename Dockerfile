# Use Node.js 18 LTS
FROM node:18-alpine

# Install FFmpeg (required for fluent-ffmpeg)
RUN apk add --no-cache ffmpeg

# Set working directory
WORKDIR /app

# Copy backend package files
COPY backend/package*.json ./
RUN npm ci --only=production

# Copy backend source code
COPY backend/ ./

# Create uploads directory
RUN mkdir -p uploads

# Expose port
EXPOSE 5000

# Start the application
CMD ["npm", "start"]
