const fs = require('fs');
const path = require('path');

// Configuration - chỉ làm việc với 2 file chính
const CONFIG = {
    localizationJsPath: path.join(__dirname, 'src', 'utils', 'localization.js'),
    csvPath: path.join(__dirname, 'src', 'components', 'Localization', 'GameHub_Localization.csv')
};

// Convert JS to CSV
function convertJsToCsv() {
    try {
        console.log('🔄 Converting localization.js to CSV...');
        
        // Read the localization file
        const localizationContent = fs.readFileSync(CONFIG.localizationJsPath, 'utf8');
        
        // Extract the translations object using regex
        const translationsMatch = localizationContent.match(/const translations = ({[\s\S]*?});/);
        
        if (!translationsMatch) {
            throw new Error('Could not find translations object in localization.js');
        }
        
        // Evaluate the translations object (safe since it's our own file)
        const translations = eval('(' + translationsMatch[1] + ')');
        
        // Convert to CSV format
        const csvRows = [];
        
        // Add header
        csvRows.push(['KEY', 'ENGLISH', 'JAPAN']);
        
        // Add all keys
        const allKeys = Object.keys(translations.en);
        
        allKeys.forEach(key => {
            const english = translations.en[key] || '';
            const japanese = translations.ja[key] || '';
            
            // Escape quotes and handle newlines
            const escapeCsv = (text) => {
                if (text.includes('"') || text.includes('\n') || text.includes(',')) {
                    return '"' + text.replace(/"/g, '""') + '"';
                }
                return text;
            };
            
            csvRows.push([
                escapeCsv(key),
                escapeCsv(english),
                escapeCsv(japanese)
            ]);
        });
        
        // Write CSV file
        const csvContent = csvRows.map(row => row.join(',')).join('\n');
        fs.writeFileSync(CONFIG.csvPath, csvContent, 'utf8');
        
        console.log('✅ JS to CSV conversion completed!');
        console.log(`📁 CSV file: ${CONFIG.csvPath}`);
        console.log(`📊 Total keys: ${allKeys.length}`);
        
        return true;
    } catch (error) {
        console.error('❌ Error converting JS to CSV:', error.message);
        return false;
    }
}

// Convert CSV to JS
function convertCsvToJs() {
    try {
        console.log('🔄 Converting CSV to localization.js...');
        
        // Read the CSV file
        const csvContent = fs.readFileSync(CONFIG.csvPath, 'utf8');
        
        // Parse CSV (simple parsing, assumes no commas in content)
        const lines = csvContent.split('\n').filter(line => line.trim());
        
        // Initialize translations object
        const translations = {
            en: {},
            ja: {}
        };
        
        // Process each line (skip header)
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i];
            const values = line.split(',');
            
            if (values.length >= 3) {
                const key = values[0].replace(/"/g, ''); // Remove quotes
                const english = values[1].replace(/"/g, '').replace(/""/g, '"'); // Handle escaped quotes
                const japanese = values[2].replace(/"/g, '').replace(/""/g, '"'); // Handle escaped quotes
                
                if (key && key.trim()) {
                    translations.en[key.trim()] = english.trim();
                    translations.ja[key.trim()] = japanese.trim();
                }
            }
        }
        
        // Generate the localization.js content
        const localizationContent = `// Localization utility
const translations = ${JSON.stringify(translations, null, 2)};

// Get current language from localStorage or default to English
const getCurrentLanguage = () => {
  return localStorage.getItem('language') || 'en';
};

// Set language
const setLanguage = (language) => {
  localStorage.setItem('language', language);
  window.location.reload(); // Simple reload to apply changes
};

// Get translation for a key
const t = (key) => {
  const currentLang = getCurrentLanguage();
  return translations[currentLang][key] || translations.en[key] || key;
};

// Export functions
export { t, getCurrentLanguage, setLanguage };
`;
        
        // Write directly to localization.js
        fs.writeFileSync(CONFIG.localizationJsPath, localizationContent, 'utf8');
        
        console.log('✅ CSV to JS conversion completed!');
        console.log(`📁 Updated file: ${CONFIG.localizationJsPath}`);
        console.log(`📊 Total keys: ${Object.keys(translations.en).length}`);
        
        return true;
    } catch (error) {
        console.error('❌ Error converting CSV to JS:', error.message);
        return false;
    }
}

// Show usage
function showUsage() {
    console.log(`
🌐 Localization Converter Tool
===============================

Usage:
  node localizationConverter.js [command]

Commands:
  js2csv    - Convert localization.js to CSV (for Google Docs)
  csv2js    - Convert CSV back to localization.js
  both      - Run both conversions
  help      - Show this help message

Examples:
  node localizationConverter.js js2csv
  node localizationConverter.js csv2js
  node localizationConverter.js both

Files:
  JS:  ${CONFIG.localizationJsPath}
  CSV: ${CONFIG.csvPath}
`);
}

// Main function
function main() {
    const command = process.argv[2] || 'help';
    
    switch (command) {
        case 'js2csv':
            convertJsToCsv();
            break;
        case 'csv2js':
            convertCsvToJs();
            break;
        case 'both':
            console.log('🔄 Running both conversions...\n');
            convertJsToCsv();
            console.log('\n');
            convertCsvToJs();
            break;
        case 'help':
        default:
            showUsage();
            break;
    }
}

// Run if called directly
if (require.main === module) {
    main();
}

module.exports = { convertJsToCsv, convertCsvToJs }; 