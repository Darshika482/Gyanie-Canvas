const express = require('express');
const bodyParser = require('body-parser');
const puppeteer = require('puppeteer');
const fs = require('fs');
const os = require('os');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4000;

// Add CORS headers
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

app.use(bodyParser.json({ limit: '10mb' }));

// Helper: Find Chrome/Chromium executable
function findChromeExecutable() {
    const platform = process.platform;
    const possiblePaths = [];
    if (platform === 'win32') {
        possiblePaths.push(
            'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
            'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
            process.env.LOCALAPPDATA + '\\Google\\Chrome\\Application\\chrome.exe'
        );
    } else if (platform === 'darwin') {
        possiblePaths.push(
            '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
            '/Applications/Chromium.app/Contents/MacOS/Chromium'
        );
    } else {
        possiblePaths.push(
            '/usr/bin/google-chrome',
            '/usr/bin/google-chrome-stable',
            '/usr/bin/chromium-browser',
            '/usr/bin/chromium'
        );
    }
    for (const p of possiblePaths) {
        if (fs.existsSync(p)) return p;
    }
    throw new Error('Chrome/Chromium executable not found.');
}

// POST /api/pdf
app.post('/api/pdf', async (req, res) => {
    console.log('📥 Received PDF generation request');
    console.log('📄 Request body keys:', Object.keys(req.body));
    console.log('📄 HTML length:', req.body.html ? req.body.html.length : 'No HTML');
    console.log('📄 URL:', req.body.url || 'No URL');
    console.log('📄 Config:', req.body.config || 'No config');

    const { html, url, config = {} } = req.body;
    if (!html && !url) {
        console.error('❌ No HTML or URL provided');
        return res.status(400).json({ error: 'Provide either html or url.' });
    }

    let browser;
    try {
        console.log('🚀 Launching Puppeteer browser...');

        // Check if Chrome is available
        try {
            const chromePath = findChromeExecutable();
            console.log('✅ Chrome found at:', chromePath);
        } catch (chromeError) {
            console.error('❌ Chrome not found:', chromeError.message);
            console.log('🔍 Trying to launch with default settings...');
        }

        browser = await puppeteer.launch({
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu',
                '--no-first-run',
                '--no-zygote',
                '--disable-web-security',
                '--disable-features=VizDisplayCompositor',
                '--disable-extensions',
                '--disable-plugins',
                '--disable-background-timer-throttling',
                '--disable-backgrounding-occluded-windows',
                '--disable-renderer-backgrounding'
            ],
            timeout: 30000
        });
        console.log('✅ Browser launched successfully');

        // Test if browser is working
        const testPage = await browser.newPage();
        await testPage.setContent('<html><body><h1>Test</h1></body></html>');
        const testPdf = await testPage.pdf({ format: 'A4' });
        await testPage.close();
        console.log('✅ Browser test successful, test PDF size:', testPdf.length);

        const page = await browser.newPage();
        console.log('✅ New page created');

        // Set viewport for high DPI
        const dpi = config.dpi || 300;
        const format = config.format || 'A4';
        const margin = config.margin || { top: '0.5in', right: '0.5in', bottom: '0.5in', left: '0.5in' };
        await page.setViewport({
            width: format === 'A4' ? 794 : 816,
            height: format === 'A4' ? 1123 : 1056,
            deviceScaleFactor: dpi / 96
        });
        console.log('✅ Viewport set');

        // Load content
        if (html) {
            console.log('📄 Setting HTML content...');
            await page.setContent(html, { waitUntil: 'domcontentloaded' });
        } else {
            console.log('🌐 Navigating to URL...');
            await page.goto(url, { waitUntil: 'domcontentloaded' });
        }
        console.log('✅ Content loaded');

        // Simple wait for content to be ready
        await new Promise(resolve => setTimeout(resolve, 500));
        console.log('✅ Content ready');

        // Generate PDF
        console.log('📄 Generating PDF...');
        console.log('📄 HTML content length:', html.length);
        console.log('📄 HTML preview:', html.substring(0, 200) + '...');

        const pdfBuffer = await page.pdf({
            format,
            margin,
            printBackground: true,
            preferCSSPageSize: true,
            displayHeaderFooter: false,
            scale: 1.0,
            omitBackground: false,
            timeout: 30000 // 30 second timeout
        });
        console.log('✅ PDF generated successfully, size:', pdfBuffer.length, 'bytes');

        // Verify it's actually a PDF
        if (pdfBuffer.length === 0) {
            throw new Error('Generated PDF is empty');
        }

        // Check if it's a valid PDF by looking at the header
        const pdfHeader = pdfBuffer.toString('ascii', 0, 10);
        console.log('📄 Generated content header:', pdfHeader);
        console.log('📄 Generated content length:', pdfBuffer.length);

        if (!pdfHeader.startsWith('%PDF')) {
            console.error('❌ Invalid PDF header:', pdfHeader);
            console.error('❌ First 100 characters:', pdfBuffer.toString('ascii', 0, 100));
            throw new Error('Generated content is not a valid PDF');
        }

        console.log('✅ Valid PDF generated with header:', pdfHeader);

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename=resume.pdf',
            'Content-Length': pdfBuffer.length
        });
        res.send(pdfBuffer);
    } catch (err) {
        console.error('PDF generation error:', err);
        console.error('Error stack:', err.stack);

        // Only send error response if we haven't sent anything yet
        if (!res.headersSent) {
            res.status(500).json({ error: err.message });
        }
    } finally {
        if (browser) {
            try {
                await browser.close();
            } catch (closeError) {
                console.error('Error closing browser:', closeError);
            }
        }
    }
});

app.listen(PORT, () => {
    console.log(`PDF server running at http://localhost:${PORT}`);
}); 