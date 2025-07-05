#!/bin/bash

# Production Deployment Script for AI Marketing Creator
# Run this script from your frontend directory

set -e  # Exit on any error

echo "🚀 Starting production deployment process..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from your frontend directory."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Node.js version 18 or higher is required. Current version: $(node --version)"
    exit 1
fi

print_status "Node.js version: $(node --version) ✓"

# Check if backend is running
print_status "Checking backend connection..."
if curl -f http://localhost:5000/api/health > /dev/null 2>&1; then
    print_success "Backend is running ✓"
else
    print_warning "Backend is not responding. Make sure it's running on port 5000"
fi

# Install dependencies if node_modules doesn't exist or package.json is newer
if [ ! -d "node_modules" ] || [ "package.json" -nt "node_modules" ]; then
    print_status "Installing dependencies..."
    npm ci --only=production
    print_success "Dependencies installed ✓"
else
    print_status "Dependencies are up to date ✓"
fi

# Run pre-deployment checks
print_status "Running pre-deployment checks..."

# Check for common issues
print_status "Checking for missing imports..."
if grep -r "import.*from.*\.\/" src/ | grep -v "\.jsx\|\.js\|\.ts\|\.tsx" > /dev/null; then
    print_warning "Found imports without file extensions. This might cause issues."
fi

# Lint check (if ESLint is configured)
if [ -f ".eslintrc.js" ] || [ -f ".eslintrc.json" ] || [ -f "eslint.config.js" ]; then
    print_status "Running ESLint checks..."
    if npm run lint > /dev/null 2>&1; then
        print_success "ESLint checks passed ✓"
    else
        print_warning "ESLint issues found. Run 'npm run lint:fix' to fix automatically."
    fi
fi

# Clean previous build
print_status "Cleaning previous build..."
rm -rf dist/
print_success "Build directory cleaned ✓"

# Build for production
print_status "Building for production..."
export NODE_ENV=production

if npm run build; then
    print_success "Build completed successfully ✓"
else
    print_error "Build failed!"
    exit 1
fi

# Check build size
if [ -d "dist" ]; then
    BUILD_SIZE=$(du -sh dist/ | cut -f1)
    print_status "Build size: $BUILD_SIZE"
    
    # Check if build is too large (warning if > 10MB)
    BUILD_SIZE_MB=$(du -sm dist/ | cut -f1)
    if [ "$BUILD_SIZE_MB" -gt 10 ]; then
        print_warning "Build size is quite large ($BUILD_SIZE).
