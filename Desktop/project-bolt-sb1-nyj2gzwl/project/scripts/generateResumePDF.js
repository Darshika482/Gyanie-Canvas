#!/usr/bin/env node

import { PuppeteerPDFGenerator } from '../src/utils/puppeteerPdfGenerator.js';
import * as fs from 'fs';
import * as path from 'path';

// CLI argument parsing
const args = process.argv.slice(2);
const usage = `
Usage: node generateResumePDF.js [options]

Options:
  --input <file>     Input HTML file path
  --url <url>        Input URL
  --output <file>    Output PDF file path (default: resume.pdf)
  --format <format>  PDF format: A4 or Letter (default: A4)
  --dpi <dpi>        DPI for high-quality output (default: 300)
  --margin <margin>  Margin in inches (default: 0.5)
  --help            Show this help message

Examples:
  node generateResumePDF.js --input resume.html --output resume.pdf
  node generateResumePDF.js --url http://localhost:3000/resume --output resume.pdf
  node generateResumePDF.js --input resume.html --format Letter --dpi 600
`;

// Parse command line arguments
function parseArgs() {
    const options = {
        input: null,
        url: null,
        output: 'resume.pdf',
        format: 'A4',
        dpi: 300,
        margin: 0.5
    };

    for (let i = 0; i < args.length; i++) {
        const arg = args[i];

        switch (arg) {
            case '--help':
                console.log(usage);
                process.exit(0);
                break;
            case '--input':
                options.input = args[++i];
                break;
            case '--url':
                options.url = args[++i];
                break;
            case '--output':
                options.output = args[++i];
                break;
            case '--format':
                options.format = args[++i];
                break;
            case '--dpi':
                options.dpi = parseInt(args[++i]);
                break;
            case '--margin':
                options.margin = parseFloat(args[++i]);
                break;
            default:
                console.error(`Unknown option: ${arg}`);
                console.log(usage);
                process.exit(1);
        }
    }

    if (!options.input && !options.url) {
        console.error('Error: Either --input or --url must be specified');
        console.log(usage);
        process.exit(1);
    }

    return options;
}

// Main function
async function main() {
    try {
        const options = parseArgs();

        console.log('🚀 Starting PDF generation...');
        console.log(`📋 Options:`, options);

        const generator = new PuppeteerPDFGenerator({
            format: options.format,
            dpi: options.dpi,
            margin: {
                top: `${options.margin}in`,
                right: `${options.margin}in`,
                bottom: `${options.margin}in`,
                left: `${options.margin}in`
            }
        });

        const startTime = Date.now();

        if (options.input) {
            // Generate from HTML file
            console.log(`📄 Reading HTML file: ${options.input}`);
            const htmlContent = fs.readFileSync(options.input, 'utf-8');

            console.log(`🔄 Generating PDF from HTML file...`);
            await generator.generateResumePDF(htmlContent, options.output);
        } else if (options.url) {
            // Generate from URL
            console.log(`🌐 Generating PDF from URL: ${options.url}`);
            await generator.generateResumePDFFromURL(options.url, options.output);
        }

        const endTime = Date.now();
        const duration = (endTime - startTime) / 1000;

        console.log(`✅ PDF generation completed in ${duration.toFixed(2)} seconds`);
        console.log(`📁 Output file: ${path.resolve(options.output)}`);

        // Check file size
        const stats = fs.statSync(options.output);
        const fileSizeInKB = stats.size / 1024;
        console.log(`📊 File size: ${fileSizeInKB.toFixed(2)} KB`);

        await generator.close();

    } catch (error) {
        console.error('❌ Error generating PDF:', error.message);
        process.exit(1);
    }
}

// Run the script
main(); 