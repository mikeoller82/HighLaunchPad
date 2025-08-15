#!/usr/bin/env tsx

/**
 * Test script for social media connections
 * Run with: npx tsx scripts/test-social-connections.ts
 */

import { getAdminApp } from '../src/lib/firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';

async function testSocialConnections() {
    console.log('🧪 Testing Social Media Connections...\n');
    
    try {
        const adminApp = getAdminApp();
        const db = getFirestore(adminApp);
        
        // Test 1: Check OAuth endpoints are accessible
        console.log('1️⃣ Testing OAuth endpoints...');
        const platforms = ['facebook', 'linkedin', 'twitter', 'instagram'];
        
        for (const platform of platforms) {
            try {
                const response = await fetch(`http://localhost:3000/api/oauth/${platform}/connect`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token: 'test-token' })
                });
                
                if (response.status === 401) {
                    console.log(`   ✅ ${platform} endpoint accessible (expected auth error)`);
                } else {
                    console.log(`   ⚠️  ${platform} endpoint returned status: ${response.status}`);
                }
            } catch (error) {
                console.log(`   ❌ ${platform} endpoint error: ${error}`);
            }
        }
        
        // Test 2: Check conversation sync endpoints
        console.log('\n2️⃣ Testing conversation sync endpoints...');
        
        for (const platform of platforms) {
            try {
                const response = await fetch(`http://localhost:3000/api/social/${platform}/conversations/sync`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ profileId: 'test-profile', userId: 'test-user' })
                });
                
                if (response.status === 404) {
                    console.log(`   ✅ ${platform} sync endpoint accessible (expected profile not found)`);
                } else {
                    console.log(`   ⚠️  ${platform} sync endpoint returned status: ${response.status}`);
                }
            } catch (error) {
                console.log(`   ❌ ${platform} sync endpoint error: ${error}`);
            }
        }
        
        // Test 3: Check environment variables
        console.log('\n3️⃣ Checking environment variables...');
        const requiredEnvVars = [
            'FACEBOOK_CLIENT_ID',
            'FACEBOOK_CLIENT_SECRET',
            'LINKEDIN_CLIENT_ID', 
            'LINKEDIN_CLIENT_SECRET',
            'TWITTER_CLIENT_ID',
            'TWITTER_CLIENT_SECRET',
            'INSTAGRAM_CLIENT_ID',
            'INSTAGRAM_CLIENT_SECRET',
            'NEXT_PUBLIC_BASE_URL'
        ];
        
        for (const envVar of requiredEnvVars) {
            if (process.env[envVar]) {
                console.log(`   ✅ ${envVar} is set`);
            } else {
                console.log(`   ❌ ${envVar} is missing`);
            }
        }
        
        console.log('\n✨ Social connections test completed!');
        
    } catch (error) {
        console.error('❌ Test failed:', error);
        process.exit(1);
    }
}

// Run the test
testSocialConnections().catch(console.error);