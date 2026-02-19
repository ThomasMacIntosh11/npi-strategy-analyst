#!/bin/bash

echo "🗄️  Setting up database..."
npx prisma db push --accept-data-loss

echo "🚀 Starting application..."
npm start
