const fs = require('fs');

// Read the test HTML file
const htmlContent = fs.readFileSync('test-resume.html', 'utf8');

// Create the request body
const requestBody = {
    html: htmlContent,
    config: {
        format: 'A4',
        dpi: 300
    }
};

// Make the request to the server
async function testPDFGeneration() {
    try {
        console.log('Testing PDF generation...');

        const response = await fetch('http://localhost:4000/api/pdf', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Server error:', errorText);
            return;
        }

        const pdfBuffer = await response.arrayBuffer();
        fs.writeFileSync('test-output.pdf', Buffer.from(pdfBuffer));

        console.log(`PDF generated successfully! Size: ${pdfBuffer.byteLength} bytes`);
        console.log('Saved as test-output.pdf');
    } catch (error) {
        console.error('Test failed:', error.message);
    }
}

testPDFGeneration(); 