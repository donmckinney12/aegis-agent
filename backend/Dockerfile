# Build stage
FROM golang:alpine AS builder

WORKDIR /app

# Install git and other build dependencies
RUN apk add --no-cache git tzdata

# Copy go mod files
COPY go.mod go.sum ./
RUN go mod download

# Copy source code
COPY . .

# Build the application
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o /app/server ./cmd/server

# Final stage
FROM alpine:latest

WORKDIR /app

# Add required runtime dependencies (ca-certificates for external API calls, tzdata for timezones)
RUN apk --no-cache add ca-certificates tzdata

# Copy the binary from the builder stage
COPY --from=builder /app/server .

# Expose the API port
EXPOSE 8080

# Environment variables
ENV PORT=8080
ENV GIN_MODE=release

# Run the binary
CMD ["/app/server"]
