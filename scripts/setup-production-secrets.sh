#!/bin/bash

# Production Secrets Setup Script for HighLaunchPad
# This script creates all necessary secrets in Google Cloud Secret Manager

set -e

PROJECT_ID="firebase-veilnet"
echo "🚀 Setting up production secrets for project: $PROJECT_ID"

# Check if gcloud is installed and authenticated
if ! command -v gcloud &> /dev/null; then
    echo "❌ gcloud CLI is not installed. Please install it first."
    exit 1
fi

# Set the project
gcloud config set project $PROJECT_ID

echo "📋 Creating secrets in Google Cloud Secret Manager..."

# Stripe Configuration
echo "💳 Setting up Stripe secrets..."
echo -n "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" | gcloud secrets create STRIPE_SECRET_KEY --data-file=- --replication-policy="automatic" || echo "⚠️ STRIPE_SECRET_KEY already exists"

echo -n "whsec_9nHJ55PYVTiQDvBjXANKTmxnKMv04uvv" | gcloud secrets create STRIPE_WEBHOOK_SECRET --data-file=- --replication-policy="automatic" || echo "⚠️ STRIPE_WEBHOOK_SECRET already exists"

# Firebase Admin Configuration
echo "🔥 Setting up Firebase Admin secrets..."
echo -n "firebase-veilnet" | gcloud secrets create FIREBASE_ADMIN_PROJECT_ID --data-file=- --replication-policy="automatic" || echo "⚠️ FIREBASE_ADMIN_PROJECT_ID already exists"

echo -n "firebase-adminsdk-fbsvc@firebase-veilnet.iam.gserviceaccount.com" | gcloud secrets create FIREBASE_ADMIN_CLIENT_EMAIL --data-file=- --replication-policy="automatic" || echo "⚠️ FIREBASE_ADMIN_CLIENT_EMAIL already exists"

# Note: You'll need to replace this with your actual private key
echo "⚠️ IMPORTANT: You need to manually create FIREBASE_ADMIN_PRIVATE_KEY secret with your service account private key"
echo "Run: gcloud secrets create FIREBASE_ADMIN_PRIVATE_KEY --data-file=path/to/your/private-key.txt --replication-policy=\"automatic\""

# API Keys
echo "🔑 Setting up API keys..."
echo -n "AIzaSyAcuxvNtamr5HOG7Q-hzdK9NRZqyENOqFg" | gcloud secrets create GEMINI_API_KEY --data-file=- --replication-policy="automatic" || echo "⚠️ GEMINI_API_KEY already exists"

# Social OAuth Secrets
echo "📱 Setting up social OAuth secrets..."
echo -n "44d5617052d9799205044842b47b2442" | gcloud secrets create FACEBOOK_CLIENT_SECRET --data-file=- --replication-policy="automatic" || echo "⚠️ FACEBOOK_CLIENT_SECRET already exists"

echo -n "WPL_AP1.7NfxiKacx63ZHkcq" | gcloud secrets create LINKEDIN_CLIENT_SECRET --data-file=- --replication-policy="automatic" || echo "⚠️ LINKEDIN_CLIENT_SECRET already exists"

echo -n "XYfYtpJ9U32aroQEasbWqOwe" | gcloud secrets create TWITTER_CLIENT_SECRET --data-file=- --replication-policy="automatic" || echo "⚠️ TWITTER_CLIENT_SECRET already exists"

echo "🔐 Setting up IAM permissions for Cloud Build..."

# Grant Cloud Build access to secrets
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:$(gcloud projects describe $PROJECT_ID --format='value(projectNumber)')@cloudbuild.gserviceaccount.com" \
    --role="roles/secretmanager.secretAccessor"

echo "✅ All secrets have been created and permissions set!"
echo ""
echo "📝 Next steps:"
echo "1. Manually create the FIREBASE_ADMIN_PRIVATE_KEY secret with your service account private key"
echo "2. Update your cloudbuild.yaml file with the correct configuration"
echo "3. Deploy using: gcloud builds submit --config cloudbuild.yaml"
echo ""
echo "🧪 Test your configuration after deployment:"
echo "curl https://highlaunchpad.com/api/stripe/test"