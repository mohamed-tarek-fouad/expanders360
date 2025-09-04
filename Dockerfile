# Use a specific Node.js version and ensure the correct npm version
FROM node:22.14-alpine AS builder

# Update npm to the required version
RUN npm install -g npm@11.3.0 

# Set our node environment
ENV NODE_ENV=build

# Create and set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json first to leverage Docker cache
COPY --chown=node:node package*.json ./

# Install dependencies
RUN npm ci

# Copy source code and build the project
COPY --chown=node:node . .
RUN npm run build

# Production stage
FROM node:22.14-alpine

# Update npm to the required version
RUN npm install -g npm@11.3.0 

# Set our node environment
ENV NODE_ENV=production

# Create and set working directory
WORKDIR /usr/src/app

# Copy only necessary production artifacts
COPY --from=builder /usr/src/app/package*.json /usr/src/app/
COPY --from=builder /usr/src/app/dist/ /usr/src/app/dist/

# Install only production dependencies
RUN npm ci --omit=dev && npm cache clean --force


ARG PORT=3000
ENV PORT=$PORT
EXPOSE $PORT

# Start the application
CMD ["node", "dist/main"]