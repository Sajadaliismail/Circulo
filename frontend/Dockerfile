# Use the official Node.js image
FROM node:lts-alpine

# Set environment variable
ENV NODE_ENV=production

# Create and set working directory
WORKDIR /frontend-service

# Copy package files and install dependencies
COPY frontend/package.json frontend/package-lock.json* ./
RUN npm install --production --silent

# Copy only the production build and necessary files
COPY frontend/build ./build

# Expose the port the app runs on
EXPOSE 5000

# Run the built application
CMD ["npx", "serve", "-s", "build", "-l", "5000"]
