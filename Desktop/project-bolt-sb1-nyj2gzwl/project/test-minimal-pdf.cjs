const fetch = require('node-fetch');

async function testMinimalPDF() {
    try {
        console.log('Testing minimal PDF generation...');

        const minimalHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Test PDF</title>
        </head>
        <body>
          <h1>Hello World</h1>
          <p>This is a test PDF.</p>
        </body>
      </html>
    `;

        console.log('HTML length:', minimalHTML.length);

        const response = await fetch('http://localhost:4000/api/pdf', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                html: minimalHTML,
                config: {
                    format: 'A4',
                    dpi: 72,
                    margin: { top: '0.5in', right: '0.5in', bottom: '0.5in', left: '0.5in' }
                }
            })
        });

        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);

        if (response.ok) {
            const buffer = await response.buffer();
            console.log('PDF generated successfully! Size:', buffer.length, 'bytes');

            // Check if it's actually a PDF by looking at the first few bytes
            const pdfHeader = buffer.toString('ascii', 0, 4);
            console.log('PDF header:', pdfHeader);

            if (pdfHeader === '%PDF') {
                console.log('✅ Valid PDF header detected');
            } else {
                console.log('❌ Invalid PDF header:', pdfHeader);
                // Show the first 100 characters to see what we got
                console.log('First 100 chars:', buffer.toString('ascii', 0, 100));
            }

            // Save the PDF to a file to test if it's valid
            const fs = require('fs');
            fs.writeFileSync('test-minimal-resume.pdf', buffer);
            console.log('PDF saved as test-minimal-resume.pdf');
        } else {
            const errorText = await response.text();
            console.error('Server error:', errorText);
        }
    } catch (error) {
        console.error('Test failed:', error.message);
    }
}

testMinimalPDF(); 