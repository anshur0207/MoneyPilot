#!/bin/bash

echo "🚀 MoneyPilot - Quick Setup"
echo "=================================="
echo ""

# Check Node.js version
echo "✓ Checking Node.js version..."
node_version=$(node -v)
echo "  Node.js: $node_version"
echo ""

# Check npm version
echo "✓ Checking npm version..."
npm_version=$(npm -v)
echo "  npm: $npm_version"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install
echo "✓ Dependencies installed"
echo ""

# Setup environment files
echo "⚙️  Setting up environment files..."

if [ ! -f "backend/.env" ]; then
  echo "  Creating backend/.env..."
  cp backend/.env.example backend/.env
  echo "  ⚠️  Please update backend/.env with your MongoDB URI and JWT_SECRET"
fi

if [ ! -f "frontend/.env.local" ]; then
  echo "  Creating frontend/.env.local..."
  cp frontend/.env.example frontend/.env.local
  echo "  ⚠️  Please update frontend/.env.local with your API URL"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "📝 Next steps:"
echo "   1. Update environment variables in:"
echo "      - backend/.env"
echo "      - frontend/.env.local"
echo ""
echo "   2. Start development servers:"
echo "      npm run dev"
echo ""
echo "   3. Open browser:"
echo "      http://localhost:3000"
echo ""
echo "🎉 Happy coding!"
