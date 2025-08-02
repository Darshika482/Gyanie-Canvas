const express = require('express');
const bodyParser = require('body-parser');
const puppeteer = require('puppeteer');

const app = express();
const PORT = 4001;

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
    res.json({ message: 'PDF server is running!' });
});

// PDF generation endpoint
app.post('/api/pdf', async (req, res) => {
    const { html, config = {} } = req.body;

    if (!html) {
        return res.status(400).json({ error: 'HTML content is required.' });
    }

    let browser;
    try {
        console.log('🚀 Starting PDF generation with Puppeteer...');

        browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const page = await browser.newPage();

        // Set viewport
        const dpi = config.dpi || 300;
        await page.setViewport({
            width: 794,
            height: 1123,
            deviceScaleFactor: dpi / 96
        });

        console.log('📄 Loading HTML content...');
        await page.setContent(html, { waitUntil: ['networkidle0', 'domcontentloaded', 'load'] });

        // Wait for fonts and content
        await page.evaluate(() => document.fonts.ready);
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Ensure all fonts are loaded
        await page.evaluate(() => {
            return new Promise((resolve) => {
                if (document.fonts.ready) {
                    resolve();
                } else {
                    document.fonts.ready.then(resolve);
                }
            });
        });

        // Wait for any external CSS to load
        await new Promise(resolve => setTimeout(resolve, 1000));

        console.log('🎨 Ensuring print color adjustments...');
        await page.addStyleTag({
            content: `
        /* Only enable print color adjustments - don't override original styles */
        * { 
          -webkit-print-color-adjust: exact !important; 
          color-adjust: exact !important; 
        }
      `
        });

        console.log('📄 Generating PDF...');
        const pdfBuffer = await page.pdf({
            format: config.format || 'A4',
            margin: config.margin || { top: '0.5in', right: '0.5in', bottom: '0.5in', left: '0.5in' },
            printBackground: true,
            preferCSSPageSize: true
        });

        console.log(`✅ PDF generated successfully! Size: ${pdfBuffer.length} bytes`);

        // Set proper headers for PDF download
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename=resume.pdf',
            'Content-Length': pdfBuffer.length,
            'Cache-Control': 'no-cache'
        });

        // Send the PDF buffer
        res.send(Buffer.from(pdfBuffer));

    } catch (err) {
        console.error('❌ PDF generation error:', err);
        res.status(500).json({ error: err.message });
    } finally {
        if (browser) await browser.close();
    }
});

app.listen(PORT, () => {
    console.log(`🚀 PDF server running at http://localhost:${PORT}`);
    console.log(`🧪 Test endpoint: http://localhost:${PORT}/test`);
}); 