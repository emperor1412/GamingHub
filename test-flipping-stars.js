const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting FlippingStars Test...\n');

// Check if we're in the right directory
if (!fs.existsSync('src/FlippingStars.js')) {
  console.error('❌ Error: FlippingStars.js not found. Please run this script from the project root directory.');
  process.exit(1);
}

// Backup original index.js
const originalIndexPath = 'src/index.js';
const testIndexPath = 'src/index-test.js';
const backupIndexPath = 'src/index.js.backup';

if (fs.existsSync(originalIndexPath)) {
  fs.copyFileSync(originalIndexPath, backupIndexPath);
  console.log('📁 Backed up original index.js');
}

// Copy test index to main index
fs.copyFileSync(testIndexPath, originalIndexPath);
console.log('📝 Switched to test index.js');

// Start the development server
console.log('🌐 Starting development server...\n');

const child = spawn('npm', ['start'], {
  stdio: 'inherit',
  shell: true
});

// Handle cleanup on exit
process.on('SIGINT', () => {
  console.log('\n🛑 Stopping test server...');
  
  // Restore original index.js
  if (fs.existsSync(backupIndexPath)) {
    fs.copyFileSync(backupIndexPath, originalIndexPath);
    fs.unlinkSync(backupIndexPath);
    console.log('📁 Restored original index.js');
  }
  
  child.kill('SIGINT');
  process.exit(0);
});

child.on('close', (code) => {
  console.log(`\n🏁 Test server exited with code ${code}`);
  
  // Restore original index.js
  if (fs.existsSync(backupIndexPath)) {
    fs.copyFileSync(backupIndexPath, originalIndexPath);
    fs.unlinkSync(backupIndexPath);
    console.log('📁 Restored original index.js');
  }
});

child.on('error', (err) => {
  console.error('❌ Error starting test server:', err);
  
  // Restore original index.js
  if (fs.existsSync(backupIndexPath)) {
    fs.copyFileSync(backupIndexPath, originalIndexPath);
    fs.unlinkSync(backupIndexPath);
    console.log('📁 Restored original index.js');
  }
});
