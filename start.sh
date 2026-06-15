#!/bin/bash

# Color codes for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Drive Clone - Quick Start${NC}\n"

# Check for Docker
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed. Please install Docker first.${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Docker found${NC}"

# Check for Docker Compose
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ Docker Compose is not installed.${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Docker Compose found${NC}\n"

# Create .env files if they don't exist
echo -e "${BLUE}📝 Setting up environment files...${NC}"

if [ ! -f backend/.env ]; then
    cp backend/.env.example backend/.env
    echo -e "${GREEN}✓ Created backend/.env${NC}"
fi

if [ ! -f frontend/.env ]; then
    cp frontend/.env.example frontend/.env
    echo -e "${GREEN}✓ Created frontend/.env${NC}"
fi

echo -e "\n${BLUE}🐳 Starting services with Docker Compose...${NC}\n"

# Start services
docker-compose up -d

echo -e "\n${GREEN}✓ Services started!${NC}\n"

# Wait for services to be ready
echo -e "${BLUE}⏳ Waiting for services to be ready...${NC}"
sleep 10

# Check if services are running
if docker-compose ps | grep -q "Up"; then
    echo -e "${GREEN}✓ Services are running!${NC}\n"
    echo -e "${BLUE}📌 Application URLs:${NC}"
    echo -e "   Frontend:  ${GREEN}http://localhost:5173${NC}"
    echo -e "   Backend:   ${GREEN}http://localhost:3000${NC}"
    echo -e "   LocalStack: ${GREEN}http://localhost:4566${NC}\n"
    echo -e "${BLUE}📝 Useful commands:${NC}"
    echo -e "   View logs:  ${GREEN}docker-compose logs -f${NC}"
    echo -e "   Stop:       ${GREEN}docker-compose down${NC}"
    echo -e "   Restart:    ${GREEN}docker-compose restart${NC}\n"
else
    echo -e "${RED}❌ Failed to start services. Check logs with: docker-compose logs${NC}"
    exit 1
fi
