// Find exact location of unclosed string
const fs = require('fs');

try {
    const content = fs.readFileSync('./frontend/ide.html', 'utf8');
    const lines = content.split('\n');
    
    let inString = false;
    let stringChar = '';
    let line378 = lines[377]; // Line 378 (0-indexed)
    
    console.log('Line 378:', line378);
    console.log('Length:', line378.length);
    
    // Check character by character
    for (let i = 0; i < line378.length; i++) {
        const char = line378[i];
        const prev = i > 0 ? line378[i-1] : '';
        
        console.log(`Pos ${i}: "${char}" (${char.charCodeAt(0)})`);
        
        if ((char === "'" || char === '"') && prev !== '\\') {
            if (!inString) {
                inString = true;
                stringChar = char;
                console.log(`String starts at position ${i} with ${char}`);
            } else if (char === stringChar) {
                inString = false;
                stringChar = '';
                console.log(`String ends at position ${i} with ${char}`);
            }
        }
    }
    
    if (inString) {
        console.log('ERROR: Line 378 has unclosed string!');
    } else {
        console.log('Line 378 appears to be OK');
    }
    
} catch (error) {
    console.error('Error:', error.message);
}