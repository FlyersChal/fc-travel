#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

if [ ! -f .env.production ]; then
  echo "Error: .env.production not found. Copy .env.production.example and fill in values."
  exit 1
fi

docker compose build
docker compose up -d

echo "Deployment complete. Services:"
docker compose ps
