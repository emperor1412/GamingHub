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

// Convert CSV to JS (PRESERVE EXISTING KEYS)
function convertCsvToJs() {
    try {
        console.log('🔄 Converting CSV to localization.js (preserving existing keys)...');
        
        // First, read the current localization.js to preserve existing keys
        const currentLocalizationContent = fs.readFileSync(CONFIG.localizationJsPath, 'utf8');
        const translationsMatch = currentLocalizationContent.match(/const translations = ({[\s\S]*?});/);
        
        if (!translationsMatch) {
            throw new Error('Could not find translations object in localization.js');
        }
        
        // Get current translations (to preserve existing keys)
        const currentTranslations = eval('(' + translationsMatch[1] + ')');
        
        // Read the CSV file
        const csvContent = fs.readFileSync(CONFIG.csvPath, 'utf8');
        
        // --- Robust CSV parser for multi-line quoted fields ---
        function parseCsvRows(csvContent) {
            const rows = [];
            let currentRow = '';
            let inQuotes = false;
            const lines = csvContent.split('\n');
            for (let i = 0; i < lines.length; i++) {
                let line = lines[i];
                // Count quotes in this line
                let quoteCount = (line.match(/\"/g) || []).length;
                if (!inQuotes) {
                    currentRow = line;
                } else {
                    currentRow += '\n' + line;
                }
                // Toggle inQuotes for each quote
                let quoteToggles = 0;
                for (let j = 0; j < line.length; j++) {
                    if (line[j] === '"') {
                        // If double quote inside quoted field, skip
                        if (line[j + 1] === '"') {
                            j++;
                        } else {
                            quoteToggles++;
                        }
                    }
                }
                if (quoteToggles % 2 !== 0) {
                    inQuotes = !inQuotes;
                }
                if (!inQuotes) {
                    rows.push(currentRow);
                    currentRow = '';
                }
            }
            return rows;
        }

        // Use robust parser
        const lines = parseCsvRows(csvContent).filter(line => line.trim());

        // Start with current translations (to preserve existing keys)
        const translations = {
            en: { ...currentTranslations.en },
            ja: { ...currentTranslations.ja }
        };

        // Process each line (skip header)
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i];
            // Parse CSV line properly (reuse previous logic)
            const values = [];
            let current = '';
            let inQuotes = false;
            for (let j = 0; j < line.length; j++) {
                const char = line[j];
                if (char === '"') {
                    if (inQuotes && line[j + 1] === '"') {
                        current += '"';
                        j++;
                    } else {
                        inQuotes = !inQuotes;
                    }
                } else if (char === ',' && !inQuotes) {
                    values.push(current.trim());
                    current = '';
                } else {
                    current += char;
                }
            }
            values.push(current.trim());
            if (values.length >= 3) {
                const key = values[0];
                const english = values[1];
                const japanese = values[2];
                if (key && key.trim()) {
                    const trimmedKey = key.trim();
                    if (translations.en.hasOwnProperty(trimmedKey) || translations.ja.hasOwnProperty(trimmedKey)) {
                        translations.en[trimmedKey] = english.trim();
                        translations.ja[trimmedKey] = japanese.trim();
                    }
                }
            }
        }
        
        // Generate the localization.js content with unquoted keys
        function objectToJs(obj, indent = 2) {
            const pad = ' '.repeat(indent);
            let str = '{\n';
            const keys = Object.keys(obj);
            keys.forEach((key, idx) => {
                const value = obj[key];
                // If value is an object, recurse
                if (typeof value === 'object' && value !== null) {
                    str += `${pad}${key}: ${objectToJs(value, indent + 2)}`;
                } else {
                    // Always quote the value, never the key
                    str += `${pad}${key}: ${JSON.stringify(value)}`;
                }
                if (idx < keys.length - 1) str += ',\n';
            });
            str += '\n' + ' '.repeat(indent - 2) + '}';
            return str;
        }

        const localizationContent = `// Localization utility\nconst translations = ${objectToJs(translations, 2)};\n\n// Get current language from localStorage or default to English\nconst getCurrentLanguage = () => {\n  return localStorage.getItem('language') || 'en';\n};\n\n// Set language\nconst setLanguage = (language) => {\n  localStorage.setItem('language', language);\n  window.location.reload(); // Simple reload to apply changes\n};\n\n// Get translation for a key\nconst t = (key) => {\n  const currentLang = getCurrentLanguage();\n  return translations[currentLang][key] || translations.en[key] || key;\n};\n\n// Export functions\nexport { t, getCurrentLanguage, setLanguage };\n`;
        
        // Write directly to localization.js
        fs.writeFileSync(CONFIG.localizationJsPath, localizationContent, 'utf8');
        
        console.log('✅ CSV to JS conversion completed!');
        console.log(`📁 Updated file: ${CONFIG.localizationJsPath}`);
        console.log(`📊 Total keys: ${Object.keys(translations.en).length}`);
        console.log('⚠️  Note: Existing keys in localization.js have been preserved');
        
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
  csv2js    - Convert CSV back to localization.js (PRESERVES EXISTING KEYS)
  both      - Run both conversions
  help      - Show this help message

Examples:
  node localizationConverter.js js2csv
  node localizationConverter.js csv2js
  node localizationConverter.js both

Files:
  JS:  ${CONFIG.localizationJsPath}
  CSV: ${CONFIG.csvPath}

⚠️  IMPORTANT: csv2js now preserves existing keys in localization.js
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