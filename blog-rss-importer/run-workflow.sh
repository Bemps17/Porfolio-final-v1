#!/bin/bash

# Blog RSS Importer - Complete Workflow Script
# Usage: ./run-workflow.sh [command]

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Functions
print_header() {
    echo -e "${BLUE}=====================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}=====================================${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️ $1${NC}"
}

check_dependencies() {
    print_header "Checking Dependencies"
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed"
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed"
        exit 1
    fi
    
    if [ ! -d "node_modules" ]; then
        print_warning "Dependencies not installed, running npm install..."
        npm install
    fi
    
    print_success "Dependencies OK"
}

check_env() {
    if [ ! -f ".env" ]; then
        print_warning ".env file not found, copying from example..."
        cp .env.example .env
        print_warning "Please edit .env file with your configuration"
    fi
}

import_rss() {
    print_header "Importing RSS Data"
    npm start
    print_success "RSS import completed"
}

sync_to_blog() {
    print_header "Syncing to Blog"
    node integration/blogSync.js sync
    print_success "Blog sync completed"
}

run_complete_workflow() {
    print_header "Running Complete Workflow"
    
    check_dependencies
    check_env
    
    print_header "Step 1: RSS Import"
    node index.js
    
    print_header "Step 2: Blog Synchronization"
    node integration/blogSync.js sync
    
    print_header "Step 3: Status Check"
    node integration/workflow.js status
    
    print_success "Complete workflow finished!"
}

run_scheduled() {
    print_header "Starting Scheduled Workflow"
    node integration/workflow.js schedule
}

run_quick_sync() {
    print_header "Quick Sync (Existing Data)"
    node integration/blogSync.js sync
    print_success "Quick sync completed"
}

run_status() {
    print_header "Workflow Status"
    node integration/workflow.js status
}

run_test() {
    print_header "Testing RSS Feeds"
    npm run test
}

run_dev() {
    print_header "Development Mode"
    npm run dev
}

show_help() {
    echo "Blog RSS Importer - Workflow Script"
    echo ""
    echo "Usage: $0 [command]"
    echo ""
    echo "Commands:"
    echo "  complete    Run complete workflow (import + sync)"
    echo "  import      Import RSS data only"
    echo "  sync        Sync to blog only"
    echo "  quick       Quick sync using existing data"
    echo "  schedule    Start scheduled workflow (every 6 hours)"
    echo "  status      Show workflow status"
    echo "  test        Test RSS feeds"
    echo "  dev         Development mode with auto-reload"
    echo "  help        Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 complete     # Run full workflow"
    echo "  $0 quick        # Quick sync only"
    echo "  $0 schedule     # Start automation"
    echo ""
}

# Main script logic
command=${1:-help}

case $command in
    "complete")
        run_complete_workflow
        ;;
    "import")
        check_dependencies
        check_env
        import_rss
        ;;
    "sync")
        sync_to_blog
        ;;
    "quick")
        run_quick_sync
        ;;
    "schedule")
        check_dependencies
        check_env
        run_scheduled
        ;;
    "status")
        run_status
        ;;
    "test")
        check_dependencies
        run_test
        ;;
    "dev")
        check_dependencies
        run_dev
        ;;
    "help"|"-h"|"--help")
        show_help
        ;;
    *)
        print_error "Unknown command: $command"
        echo ""
        show_help
        exit 1
        ;;
esac
