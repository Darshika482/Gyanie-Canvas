const fs = require('fs');

// Read the test HTML file
const htmlContent = fs.readFileSync('test-text-visibility.html', 'utf8');

// Create the request body
const requestBody = {
    html: htmlContent,
    config: {
        format: 'A4',
        dpi: 300
    }
};

// Make the request to the server
async function testTextVisibility() {
    try {
        console.log('Testing text visibility in PDF...');

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
        fs.writeFileSync('text-visibility-test.pdf', Buffer.from(pdfBuffer));

        console.log(`PDF generated successfully! Size: ${pdfBuffer.byteLength} bytes`);
        console.log('Saved as text-visibility-test.pdf');
        console.log('Check the PDF to verify all text is visible and readable.');
    } catch (error) {
        console.error('Test failed:', error.message);
    }
}

testTextVisibility(); 