FROM node:lts-alpine

# Set environment variable
ENV NODE_ENV=production

# Create and set working directory
WORKDIR /frontend-service

# Copy package files and install dependencies
COPY frontend/package.json frontend/package-lock.json* frontend/npm-shrinkwrap.json* ./
RUN npm install --production --silent

# Copy the rest of the application code
COPY frontend/ ./

# Build the React application
RUN npm run build

# Serve the built application
RUN npm install -g serve

# Expose the port the app runs on
EXPOSE 5000

# Run the built application
CMD ["serve", "-s", "build", "-l", "5000"]
