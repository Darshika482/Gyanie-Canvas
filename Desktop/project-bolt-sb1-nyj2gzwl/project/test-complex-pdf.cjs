const fetch = require('node-fetch');

async function testComplexPDF() {
    try {
        console.log('Testing complex PDF generation...');

        // Simulate a more complex resume HTML similar to what the app generates
        const complexHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
          <style>
            * { -webkit-print-color-adjust: exact !important; color-adjust: exact !important; }
            * { visibility: visible !important; }
            li { list-style-type: disc !important; list-style-position: outside !important; }
            p, div, span { word-wrap: break-word !important; overflow-wrap: break-word !important; }
          </style>
        </head>
        <body>
          <div id="resume-preview" class="resume-preview">
            <div class="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8">
              <div class="flex items-center space-x-6">
                <div class="w-24 h-24 bg-gray-300 rounded-full"></div>
                <div>
                  <h1 class="text-4xl font-bold text-black">darshika</h1>
                  <p class="text-lg text-black">Experienced ui ux with 1+ years in Media</p>
                </div>
              </div>
              
              <div class="mt-6 space-y-2">
                <div class="flex items-center space-x-2">
                  <span class="text-red-500">📞</span>
                  <span class="text-black">+1-124-161-8172</span>
                </div>
                <div class="flex items-center space-x-2">
                  <span class="text-white">✉️</span>
                  <span class="text-black">anitacooks@gmail.com</span>
                </div>
                <div class="flex items-center space-x-2">
                  <span class="text-white">🔗</span>
                  <span class="text-black">behance.com/_NAME_</span>
                </div>
                <div class="flex items-center space-x-2">
                  <span class="text-red-500">📍</span>
                  <span class="text-black">New York, NYC</span>
                </div>
              </div>
            </div>
            
            <div class="bg-white p-8">
              <div class="flex items-center space-x-2 mb-4">
                <div class="w-4 h-4 bg-blue-500 rounded-full"></div>
                <h2 class="text-xl font-bold text-black">EXPERIENCE</h2>
              </div>
              
              <div class="border-l-4 border-blue-200 pl-4 space-y-4">
                <div>
                  <h3 class="font-bold text-black">UI/UX Designer</h3>
                  <p class="text-black">Gutmann</p>
                  <div class="flex justify-between items-center">
                    <span class="text-black">2017 - Present</span>
                    <span class="text-black">New York, NYC</span>
                  </div>
                  <ul class="mt-2 space-y-1">
                    <li class="text-black">Created and maintained UI standards for 20+ websites</li>
                    <li class="text-black">Worked cross-functionally with developers</li>
                    <li class="text-black">Re-designed the website and decreased bounce rate by 40%</li>
                  </ul>
                </div>
                
                <div>
                  <h3 class="font-bold text-black">Junior UX Designer</h3>
                  <p class="text-black">Padberg</p>
                  <div class="flex justify-between items-center">
                    <span class="text-black">2007 - 2009</span>
                    <span class="text-black">New York, NYC</span>
                  </div>
                  <ul class="mt-2 space-y-1">
                    <li class="text-black">Achieved 85%+ student completion rate</li>
                    <li class="text-black">Established a team of 3 covering every key role</li>
                    <li class="text-black">Reached 400% in user retention</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

        console.log('HTML length:', complexHTML.length);

        const response = await fetch('http://localhost:4000/api/pdf', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                html: complexHTML,
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

            // Check if it's actually a PDF by looking at the first few bytes
            const pdfHeader = buffer.toString('ascii', 0, 4);
            console.log('PDF header:', pdfHeader);

            if (pdfHeader === '%PDF') {
                console.log('✅ Valid PDF header detected');
            } else {
                console.log('❌ Invalid PDF header:', pdfHeader);
            }

            // Save the PDF to a file to test if it's valid
            const fs = require('fs');
            fs.writeFileSync('test-complex-resume.pdf', buffer);
            console.log('PDF saved as test-complex-resume.pdf');
        } else {
            const errorText = await response.text();
            console.error('Server error:', errorText);
        }
    } catch (error) {
        console.error('Test failed:', error.message);
    }
}

testComplexPDF(); 