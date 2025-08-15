#!/bin/bash

# HighLaunchPad Repository Sync Script
# This script helps sync documentation from private dev repo to public repo

set -e

PUBLIC_REPO_PATH="/home/mike/HighLaunchPad"
DEV_REPO_PATH="/home/mike/HighLaunchPad-dev"

echo "🔄 HighLaunchPad Repository Sync"
echo "================================="

# Check if we're in the dev repo
if [ ! -f "$DEV_REPO_PATH/scripts/sync-public.sh" ]; then
    echo "❌ Error: Run this script from the development repository"
    exit 1
fi

# Check if public repo exists
if [ ! -d "$PUBLIC_REPO_PATH" ]; then
    echo "❌ Error: Public repository not found at $PUBLIC_REPO_PATH"
    exit 1
fi

echo "📋 Syncing documentation files..."

# Copy README from dev to public (if it exists)
if [ -f "$DEV_REPO_PATH/README.md" ]; then
    cp "$DEV_REPO_PATH/README.md" "$PUBLIC_REPO_PATH/README.md"
    echo "✅ README.md synced"
fi

# Copy any documentation files
if [ -d "$DEV_REPO_PATH/docs" ]; then
    cp -r "$DEV_REPO_PATH/docs"/* "$PUBLIC_REPO_PATH/docs/" 2>/dev/null || echo "📝 No docs to sync"
fi

# Navigate to public repo and commit changes
cd "$PUBLIC_REPO_PATH"

# Check if there are changes
if git diff --quiet && git diff --cached --quiet; then
    echo "✅ No changes to sync"
else
    echo "📝 Committing changes to public repository..."
    git add .
    git commit -m "Update documentation from development

$(date '+%Y-%m-%d %H:%M:%S') - Synced from private development repository"
    
    echo "🚀 Pushing to GitHub..."
    git push origin main
    
    echo "✅ Public repository updated successfully!"
fi

echo ""
echo "🎯 Next steps:"
echo "   • Public repo: https://github.com/mikeoller82/HighLaunchPad"
echo "   • Continue development in: $DEV_REPO_PATH"
echo "   • Run this script again to sync future documentation updates"