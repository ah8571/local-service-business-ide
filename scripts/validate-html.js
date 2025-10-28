// Simple HTML/JS validator
const fs = require('fs');

try {
    const content = fs.readFileSync('./frontend/ide.html', 'utf8');
    
    // Check for common syntax issues
    console.log('Checking HTML file...');
    
    // Check for unclosed strings
    const lines = content.split('\n');
    let inSingleQuote = false;
    let inDoubleQuote = false;
    let inTemplateString = false;
    let errors = [];
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        let j = 0;
        
        while (j < line.length) {
            const char = line[j];
            const prev = j > 0 ? line[j-1] : '';
            
            if (char === "'" && prev !== '\\' && !inDoubleQuote && !inTemplateString) {
                inSingleQuote = !inSingleQuote;
            } else if (char === '"' && prev !== '\\' && !inSingleQuote && !inTemplateString) {
                inDoubleQuote = !inDoubleQuote;
            } else if (char === '`' && prev !== '\\' && !inSingleQuote && !inDoubleQuote) {
                inTemplateString = !inTemplateString;
            }
            
            j++;
        }
        
        // Check if we're still in a string at end of line
        if (inSingleQuote || inDoubleQuote || inTemplateString) {
            if (i < lines.length - 1) { // Not the last line
                errors.push(`Line ${i + 1}: Unclosed string detected`);
            }
        }
    }
    
    if (errors.length > 0) {
        console.log('Syntax errors found:');
        errors.forEach(error => console.log(error));
    } else {
        console.log('No obvious syntax errors found in HTML file.');
    }
    
    // Check file size
    console.log(`File size: ${content.length} characters, ${lines.length} lines`);
    
} catch (error) {
    console.error('Error reading file:', error.message);
}