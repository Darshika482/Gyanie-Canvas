const puppeteer = require('puppeteer');

async function testPuppeteer() {
  let browser;
  try {
    console.log('Testing Puppeteer installation...');

    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu'
      ]
    });

    console.log('✅ Browser launched successfully');

    const page = await browser.newPage();
    console.log('✅ New page created');

    await page.setContent('<html><body><h1>Test PDF</h1><p>This is a test.</p></body></html>');
    console.log('✅ Content set');

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true
    });

    console.log('✅ PDF generated successfully!');
    console.log('PDF size:', pdfBuffer.length, 'bytes');
    console.log('PDF header:', pdfBuffer.toString('ascii', 0, 10));

    // Save the PDF to verify it's valid
    const fs = require('fs');
    fs.writeFileSync('test-puppeteer-simple.pdf', pdfBuffer);
    console.log('✅ PDF saved as test-puppeteer-simple.pdf');

  } catch (error) {
    console.error('❌ Puppeteer test failed:', error.message);
    console.error('Stack trace:', error.stack);
  } finally {
    if (browser) await browser.close();
  }
}

testPuppeteer(); 