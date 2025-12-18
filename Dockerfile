FROM node:24-slim

# Set working directory
WORKDIR /app 

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci 

# Install Chromium browser
RUN npx playwright install chromium --with-deps 

# Copy code
COPY . .

# Run tests
CMD ["npx", "playwright", "test"]