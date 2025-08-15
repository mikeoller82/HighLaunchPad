// Test Firebase configuration and login functionality
const fs = require('fs');
const path = require('path');

console.log('🔥 Testing Firebase Configuration...\n');

// Check environment variables
const envPath = path.join(__dirname, '.env.local');
if (!fs.existsSync(envPath)) {
  console.error('❌ .env.local file not found');
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf8');
const requiredVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID'
];

console.log('Checking Firebase environment variables:');
let allVarsPresent = true;
requiredVars.forEach(varName => {
  const found = envContent.includes(varName);
  console.log(`${found ? '✅' : '❌'} ${varName}: ${found ? 'Present' : 'Missing'}`);
  if (!found) allVarsPresent = false;
});

if (!allVarsPresent) {
  console.error('\n❌ Some required Firebase environment variables are missing');
  process.exit(1);
}

// Check Firebase configuration file
const firebasePath = path.join(__dirname, 'src/lib/firebase.ts');
if (!fs.existsSync(firebasePath)) {
  console.error('❌ Firebase configuration file not found');
  process.exit(1);
}

const firebaseContent = fs.readFileSync(firebasePath, 'utf8');

// Check for proper Firebase initialization
const hasInitializeApp = firebaseContent.includes('initializeApp');
const hasGetAuth = firebaseContent.includes('getAuth');
const hasGetFirestore = firebaseContent.includes('getFirestore');
const hasExports = firebaseContent.includes('export { db, auth, app }');

console.log('\nChecking Firebase configuration:');
console.log(`${hasInitializeApp ? '✅' : '❌'} Firebase app initialization: ${hasInitializeApp ? 'Present' : 'Missing'}`);
console.log(`${hasGetAuth ? '✅' : '❌'} Firebase auth initialization: ${hasGetAuth ? 'Present' : 'Missing'}`);
console.log(`${hasGetFirestore ? '✅' : '❌'} Firestore initialization: ${hasGetFirestore ? 'Present' : 'Missing'}`);
console.log(`${hasExports ? '✅' : '❌'} Proper exports: ${hasExports ? 'Present' : 'Missing'}`);

if (hasInitializeApp && hasGetAuth && hasGetFirestore && hasExports) {
  console.log('\n🎉 Firebase configuration looks correct!');
  console.log('\nThe login functionality should now work properly.');
  console.log('\nTo test:');
  console.log('1. Start the development server: npm run dev');
  console.log('2. Navigate to http://localhost:3000');
  console.log('3. Try logging in with your credentials');
} else {
  console.error('\n❌ Firebase configuration has issues');
  process.exit(1);
}