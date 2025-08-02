const fetch = require('node-fetch');

async function testSimplePDF() {
    try {
        console.log('Testing simple PDF generation...');

        const simpleHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #333; }
            .contact { margin-bottom: 20px; }
            .section { margin-bottom: 15px; }
            .job { margin-bottom: 10px; }
          </style>
        </head>
        <body>
          <h1>John Doe</h1>
          <div class="contact">
            <p>Email: john@example.com</p>
            <p>Phone: (555) 123-4567</p>
            <p>Location: New York, NY</p>
          </div>
          
          <div class="section">
            <h2>Experience</h2>
            <div class="job">
              <h3>Software Engineer</h3>
              <p>Company: Tech Corp</p>
              <p>Duration: 2020 - Present</p>
              <ul>
                <li>Developed web applications</li>
                <li>Collaborated with team members</li>
              </ul>
            </div>
          </div>
          
          <div class="section">
            <h2>Skills</h2>
            <p>JavaScript, React, Node.js, Python</p>
          </div>
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
                    dpi: 300,
                    margin: { top: '0.5in', right: '0.5in', bottom: '0.5in', left: '0.5in' }
                }
            })
        });

        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);

        if (response.ok) {
            const buffer = await response.buffer();
            console.log('PDF generated successfully! Size:', buffer.length, 'bytes');

            // Save the PDF to a file to test if it's valid
            const fs = require('fs');
            fs.writeFileSync('test-simple-resume.pdf', buffer);
            console.log('PDF saved as test-simple-resume.pdf');
        } else {
            const errorText = await response.text();
            console.error('Server error:', errorText);
        }
    } catch (error) {
        console.error('Test failed:', error.message);
    }
}

testSimplePDF(); 