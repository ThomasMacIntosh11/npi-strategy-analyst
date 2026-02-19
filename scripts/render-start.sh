#!/bin/bash

set -e

echo "🔧 Generating Prisma client..."
npx prisma generate

echo "📂 Creating database directory..."
mkdir -p ./prisma

echo "🗄️  Setting up database..."
npx prisma db push --accept-data-loss --skip-generate

echo "🚀 Starting application..."
npm start
