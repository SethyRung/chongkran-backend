# ---------- Builder ----------
FROM node:22-alpine AS builder

WORKDIR /app

# Enable corepack for pnpm support
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy lockfile and manifest
COPY package.json pnpm-lock.yaml ./

# Install all dependencies
RUN pnpm install --frozen-lockfile

# Copy the source code
COPY . .

# Build the project
RUN pnpm build


# ---------- Runtime ----------
FROM node:22-alpine AS runtime

WORKDIR /app

# Enable corepack for pnpm support
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy lockfile and manifest
COPY package.json pnpm-lock.yaml ./

# Install only production dependencies
RUN pnpm install --prod --frozen-lockfile

# Copy built files from builder
COPY --from=builder /app/dist ./dist

# Copy environment variables
COPY .env .

EXPOSE 8080

CMD ["node", "dist/src/main"]
