#!/usr/bin/bash

echo "Installing Bliss..."

if [ ! -f .env ]; then
    cp .env.example .env
    echo "Please edit .env file and run the script again"
    exit 1
fi

echo "Running docker-compose..."
echo "This may take a while..."

docker-compose up -d && \
    echo "Bliss is running" && \
    echo "Migrating database..." && \
    docker-compose exec renzynx yarn prisma migrate deploy && \
    echo "Seeding database..." && \
    docker-compose exec renzynx yarn prisma db seed

echo "Successfully installed Bliss"
echo "Run the following to view logs:"
echo "docker-compose logs -f --tail=50 --no-log-prefix renzynx"