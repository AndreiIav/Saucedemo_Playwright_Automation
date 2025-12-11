FROM node:25-slim

RUN apt-get update && apt-get install -y 

# Set working directory
WORKDIR /app 

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci 

# Install Chromium browser
RUN npx playwright install chromium --with-deps 

# Copy the rest of the application
COPY . .

# Run tests
CMD ["npx", "playwright", "test"]