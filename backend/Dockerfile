FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Create uploads and temp directories
RUN mkdir -p uploads temp

# Expose port
EXPOSE 8080

# Start the application
CMD ["npm", "start"]
