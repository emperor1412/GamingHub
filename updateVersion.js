const fs = require('fs');

function isDateFormat(version) {
    return version.includes('-') && version.includes(':');
}

function incrementVersion(version) {
    // Remove 'alpha.' prefix if it exists to process the version numbers
    const versionWithoutPrefix = version.replace('alpha.', '');
    const parts = versionWithoutPrefix.split('.');
    let [major, minor, patch] = parts.map(Number);
    
    patch++;
    if (patch > 100) {
        patch = 0;
        minor++;
        if (minor > 100) {
            minor = 0;
            major++;
            if (major > 100) {
                major = 100;
                minor = 100;
                patch = 100;
            }
        }
    }
    
    // Add 'alpha.' prefix to the version string
    return `alpha.${major}.${minor}.${patch}`;
}

// Read current version
let currentVersion = '0.0.1';
try {
    currentVersion = fs.readFileSync('./public/version.txt', 'utf8').trim();
    
    // If current version is in date format, start from 0.0.1
    if (isDateFormat(currentVersion)) {
        currentVersion = '0.0.0';
    }
} catch (error) {
    // If file doesn't exist or other error, start from 0.0.0
    currentVersion = '0.0.0';
}

// Increment version
const newVersion = incrementVersion(currentVersion);

// Write new version
fs.writeFileSync('./public/version.txt', newVersion);
console.log('Version updated from', currentVersion, 'to:', newVersion);