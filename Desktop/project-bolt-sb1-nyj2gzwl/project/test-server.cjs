const fetch = require('node-fetch');

async function testServer() {
    try {
        console.log('Testing server with very simple HTML...');

        const simpleHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Test</title>
        </head>
        <body>
          <h1>Hello World</h1>
          <p>This is a test.</p>
        </body>
      </html>
    `;

        const response = await fetch('http://localhost:4000/api/pdf', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                html: simpleHTML,
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
            console.log('First 50 bytes:', buffer.toString('ascii', 0, 50));

            const fs = require('fs');
            fs.writeFileSync('test-server.pdf', buffer);
            console.log('PDF saved as test-server.pdf');
        } else {
            const errorText = await response.text();
            console.error('Server error:', errorText);
        }
    } catch (error) {
        console.error('Test failed:', error.message);
    }
}

testServer(); 