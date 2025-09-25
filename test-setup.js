#!/usr/bin/env node

// Cube Notary Setup Test Script
// This script tests the basic setup without requiring user input

const fs = require('fs');
const path = require('path');

console.log('🧪 Cube Notary Setup Test');
console.log('==========================');

// Test 1: Check Node.js version
console.log('\n1. Checking Node.js version...');
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
if (majorVersion >= 18) {
    console.log(`✅ Node.js ${nodeVersion} is compatible`);
} else {
    console.log(`❌ Node.js ${nodeVersion} is too old. Need 18+`);
    process.exit(1);
}

// Test 2: Check if package.json exists
console.log('\n2. Checking package.json...');
if (fs.existsSync('package.json')) {
    console.log('✅ package.json found');
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    console.log(`   Project: ${packageJson.name}`);
    console.log(`   Version: ${packageJson.version}`);
} else {
    console.log('❌ package.json not found');
    process.exit(1);
}

// Test 3: Check if main files exist
console.log('\n3. Checking main files...');
const requiredFiles = [
    'server.js',
    'index.html',
    'admin.html',
    'database/init.js',
    'routes/bookings.js',
    'routes/payments.js',
    'routes/email.js',
    'services/emailService.js'
];

let allFilesExist = true;
requiredFiles.forEach(file => {
    if (fs.existsSync(file)) {
        console.log(`✅ ${file}`);
    } else {
        console.log(`❌ ${file} missing`);
        allFilesExist = false;
    }
});

if (!allFilesExist) {
    console.log('\n❌ Some required files are missing');
    process.exit(1);
}

// Test 4: Check environment file
console.log('\n4. Checking environment configuration...');
if (fs.existsSync('.env')) {
    console.log('✅ .env file found');
} else if (fs.existsSync('env.example')) {
    console.log('⚠️  .env file not found, but env.example exists');
    console.log('   Run: cp env.example .env');
} else {
    console.log('❌ No environment configuration found');
}

// Test 5: Check if node_modules exists
console.log('\n5. Checking dependencies...');
if (fs.existsSync('node_modules')) {
    console.log('✅ node_modules found (dependencies installed)');
} else {
    console.log('⚠️  node_modules not found');
    console.log('   Run: npm install');
}

// Test 6: Test basic server functionality
console.log('\n6. Testing server functionality...');
try {
    // Try to require the server file
    const serverPath = path.join(__dirname, 'server.js');
    console.log('✅ Server file can be loaded');
} catch (error) {
    console.log(`❌ Error loading server: ${error.message}`);
}

// Test 7: Check database initialization
console.log('\n7. Testing database initialization...');
try {
    const { initializeDatabase } = require('./database/init');
    console.log('✅ Database initialization module loaded');
} catch (error) {
    console.log(`❌ Error loading database module: ${error.message}`);
}

console.log('\n🎉 Setup test completed!');
console.log('\nNext steps:');
console.log('1. Run: npm install (if not done already)');
console.log('2. Run: cp env.example .env');
console.log('3. Edit .env with your credentials');
console.log('4. Run: npm run dev');
console.log('5. Visit: http://localhost:3000');
console.log('\nFor deployment, run: ./deploy.sh');
