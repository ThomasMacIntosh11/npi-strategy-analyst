#!/bin/bash

echo "🚀 NPI Strategy Analyst - Setup Script"
echo "========================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "   Download from: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js $(node --version) detected"
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from .env.example..."
    cp .env.example .env
    echo "✅ .env file created"
    echo ""
    echo "⚠️  IMPORTANT: Edit the .env file and add your OpenAI API key!"
    echo "   Open .env and set: OPENAI_API_KEY=sk-your-actual-key-here"
    echo ""
    read -p "Press Enter after you've updated the .env file..."
else
    echo "✅ .env file already exists"
fi

echo ""
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo ""
echo "🗄️  Setting up database..."
npx prisma generate
npx prisma db push

if [ $? -ne 0 ]; then
    echo "❌ Failed to set up database"
    exit 1
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "📋 Next steps:"
echo "   1. Start the development server:"
echo "      npm run dev"
echo ""
echo "   2. Open your browser to:"
echo "      http://localhost:3000"
echo ""
echo "   3. Login with access code:"
echo "      NPI2030Vision"
echo ""
echo "   4. Go to Knowledge page and click 'Ingest Knowledge'"
echo "      to process the sample documents"
echo ""
echo "🎉 Ready to strategize!"
