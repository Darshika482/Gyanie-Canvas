const express = require('express');
const bodyParser = require('body-parser');
const { spawn } = require('child_process');
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
    res.json({ message: 'Python PDF server is running!' });
});

// PDF generation endpoint
app.post('/api/pdf', async (req, res) => {
    const { html, config = {} } = req.body;

    if (!html) {
        return res.status(400).json({ error: 'HTML content is required.' });
    }

    try {
        console.log('🚀 Starting Python PDF generation...');

        // Create temporary HTML file
        const tempHtmlPath = path.join(__dirname, 'temp_resume.html');
        fs.writeFileSync(tempHtmlPath, html);

        // Generate unique output filename
        const timestamp = Date.now();
        const outputFilename = `python_resume_${timestamp}.pdf`;
        const outputPath = path.join(__dirname, outputFilename);

        console.log('📄 Calling Python script...');

        // Call Python script
        const pythonProcess = spawn('python', [
            'fast_pdf_generator.py',
            '--html', tempHtmlPath,
            '--output', outputPath
        ]);

        let stdout = '';
        let stderr = '';

        pythonProcess.stdout.on('data', (data) => {
            stdout += data.toString();
            console.log('Python output:', data.toString());
        });

        pythonProcess.stderr.on('data', (data) => {
            stderr += data.toString();
            console.error('Python error:', data.toString());
        });

        // Wait for Python process to complete
        await new Promise((resolve, reject) => {
            pythonProcess.on('close', (code) => {
                if (code === 0) {
                    resolve();
                } else {
                    reject(new Error(`Python process exited with code ${code}`));
                }
            });
        });

        // Check if PDF was generated
        if (!fs.existsSync(outputPath)) {
            throw new Error('PDF file was not generated');
        }

        // Read the generated PDF
        const pdfBuffer = fs.readFileSync(outputPath);

        console.log(`✅ Python PDF generated successfully! Size: ${pdfBuffer.length} bytes`);

        // Clean up temporary files
        try {
            fs.unlinkSync(tempHtmlPath);
            fs.unlinkSync(outputPath);
        } catch (cleanupError) {
            console.warn('Warning: Could not clean up temporary files:', cleanupError.message);
        }

        // Send PDF response
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename=resume.pdf',
            'Content-Length': pdfBuffer.length,
            'Cache-Control': 'no-cache'
        });

        res.send(pdfBuffer);

    } catch (err) {
        console.error('❌ Python PDF generation error:', err);
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Python PDF server running at http://localhost:${PORT}`);
    console.log(`🧪 Test endpoint: http://localhost:${PORT}/test`);
}); 