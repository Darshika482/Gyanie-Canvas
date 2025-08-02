const express = require('express');
const bodyParser = require('body-parser');
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;

// Add CORS headers
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

app.use(bodyParser.json({ limit: '10mb' }));

// Test endpoint
app.get('/test', (req, res) => {
    res.json({ message: 'Fast Puppeteer PDF server is running!' });
});

// PDF generation endpoint
app.post('/api/pdf', async (req, res) => {
    console.log('📥 Received PDF generation request');
    console.log('📊 Request headers:', req.headers);
    console.log('📄 Request body length:', req.body ? Object.keys(req.body).length : 'No body');

    const { html, config = {} } = req.body;

    if (!html) {
        console.error('❌ No HTML content provided');
        return res.status(400).json({ error: 'HTML content is required.' });
    }

    console.log('📄 HTML content length:', html.length);
    console.log('⚙️ Config:', config);

    let browser;
    try {
        console.log('🚀 Starting fast PDF generation with Puppeteer...');
        const startTime = Date.now();

        browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
        });

        const page = await browser.newPage();

        // Set viewport for high quality
        await page.setViewport({
            width: 794,
            height: 1123,
            deviceScaleFactor: 2
        });

        console.log('📄 Loading HTML content...');

        // Optimize HTML for ATS compatibility
        const optimizedHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
          <style>
            /* ATS Compatibility Enhancements */
            * {
              -webkit-print-color-adjust: exact !important;
              color-adjust: exact !important;
              -webkit-user-select: text !important;
              user-select: text !important;
            }
            
            /* Preserve original design */
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              line-height: 1.4;
            }
            
            /* Ensure proper list formatting */
            li {
              list-style-type: disc !important;
              list-style-position: outside !important;
            }
            
            /* Fix any text wrapping issues */
            p, div, span {
              word-wrap: break-word !important;
              overflow-wrap: break-word !important;
            }
            
            /* Print optimizations */
            @media print {
              body {
                margin: 0 !important;
                padding: 0 !important;
              }
              
              * {
                -webkit-print-color-adjust: exact !important;
                color-adjust: exact !important;
              }
            }
          </style>
        </head>
        <body>
          ${html}
        </body>
      </html>
    `;

        await page.setContent(optimizedHTML, {
            waitUntil: ['networkidle0', 'domcontentloaded']
        });

        // Wait for fonts and content
        await page.evaluate(() => document.fonts.ready);
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Ensure all text is visible and properly rendered
        await page.evaluate(() => {
            // Force all text elements to be visible
            const textElements = document.querySelectorAll('p, div, span, h1, h2, h3, h4, h5, h6, li, td, th, strong, b, em, i');
            textElements.forEach(el => {
                el.style.color = '#000';
                el.style.visibility = 'visible';
                el.style.display = el.tagName === 'LI' ? 'list-item' : 'block';
            });

            // Ensure list items have proper bullets
            const listItems = document.querySelectorAll('li');
            listItems.forEach(li => {
                li.style.listStyleType = 'disc';
                li.style.listStylePosition = 'outside';
                li.style.marginLeft = '20px';
            });

            // Log text content for debugging
            const bodyText = document.body.textContent || document.body.innerText || '';
            console.log('Total text content length:', bodyText.length);
            console.log('First 500 characters:', bodyText.substring(0, 500));
        });

        console.log('📄 Generating PDF...');

        const pdfBuffer = await page.pdf({
            format: 'A4',
            margin: { top: '0.5in', right: '0.5in', bottom: '0.5in', left: '0.5in' },
            printBackground: true,
            preferCSSPageSize: true,
            displayHeaderFooter: false,
            scale: 1.0,
            omitBackground: false
        });

        const generationTime = Date.now() - startTime;
        console.log(`✅ PDF generated successfully in ${generationTime}ms!`);
        console.log(`📄 File size: ${pdfBuffer.length} bytes`);

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename=resume.pdf',
            'Content-Length': pdfBuffer.length,
            'Cache-Control': 'no-cache'
        });

        res.send(pdfBuffer);

    } catch (err) {
        console.error('❌ PDF generation error:', err);
        console.error('❌ Error stack:', err.stack);
        console.error('❌ Error name:', err.name);
        console.error('❌ Error message:', err.message);
        res.status(500).json({
            error: err.message,
            stack: err.stack,
            name: err.name
        });
    } finally {
        if (browser) {
            try {
                await browser.close();
                console.log('🔒 Browser closed successfully');
            } catch (closeError) {
                console.error('❌ Error closing browser:', closeError);
            }
        }
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Fast Puppeteer PDF server running at http://localhost:${PORT}`);
    console.log(`🧪 Test endpoint: http://localhost:${PORT}/test`);
}); 