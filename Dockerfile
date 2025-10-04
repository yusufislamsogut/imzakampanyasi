# Multi-stage build for SvelteKit with Node.js adapter
FROM node:22-alpine AS builder

# Set working directory
WORKDIR /app

# Build arguments for environment variables
ARG BASE_URL=http://localhost:2357
ARG DIRECTUS_TOKEN=0R4bhkloS7M8mr7mwMq8L-hmnJPzoVVa

# Set environment variables for build
ENV BASE_URL=$BASE_URL
ENV DIRECTUS_TOKEN=$DIRECTUS_TOKEN

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production=false

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:22-alpine AS production

# Set working directory
WORKDIR /app

# Copy built application from builder stage
COPY --from=builder /app/build ./build
COPY --from=builder /app/package*.json ./

# Install only production dependencies
RUN npm ci --only=production && npm cache clean --force

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S sveltekit -u 1001

# Change ownership of the app directory
RUN chown -R sveltekit:nodejs /app
USER sveltekit

# Expose port
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=production
ENV BASE_URL=http://localhost:2357
ENV DIRECTUS_TOKEN=0R4bhkloS7M8mr7mwMq8L-hmnJPzoVVa
ENV ORIGIN=http://localhost:3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

# Start the application
CMD ["node", "build"]
