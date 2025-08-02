import puppeteer, { Browser, Page } from 'puppeteer-core';
import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

// Configuration interface for PDF generation
interface PDFConfig {
    format: 'A4' | 'Letter';
    margin: {
        top: string;
        right: string;
        bottom: string;
        left: string;
    };
    dpi: number;
    printBackground: boolean;
    preferCSSPageSize: boolean;
    displayHeaderFooter: boolean;
    scale: number;
}

// Default configuration
const DEFAULT_CONFIG: PDFConfig = {
    format: 'A4',
    margin: {
        top: '0.5in',
        right: '0.5in',
        bottom: '0.5in',
        left: '0.5in'
    },
    dpi: 300,
    printBackground: true,
    preferCSSPageSize: true,
    displayHeaderFooter: false,
    scale: 1.0
};

// Enhanced PDF generator using Puppeteer for ATS-compatible PDFs
export class PuppeteerPDFGenerator {
    private browser: Browser | null = null;
    private config: PDFConfig;

    constructor(config: Partial<PDFConfig> = {}) {
        this.config = { ...DEFAULT_CONFIG, ...config };
    }

    /**
 * Initialize Puppeteer browser instance
 */
    private async initializeBrowser(): Promise<Browser> {
        if (this.browser) {
            return this.browser;
        }

        // Find Chrome/Chromium executable
        const chromePath = this.findChromeExecutable();

        this.browser = await puppeteer.launch({
            executablePath: chromePath,
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
                '--no-first-run',
                '--no-zygote',
                '--disable-gpu',
                '--disable-background-timer-throttling',
                '--disable-backgrounding-occluded-windows',
                '--disable-renderer-backgrounding',
                '--disable-features=TranslateUI',
                '--disable-ipc-flooding-protection',
                '--enable-font-antialiasing',
                '--font-render-hinting=none',
                '--disable-font-subpixel-positioning',
                '--disable-lcd-text',
                '--force-color-profile=srgb'
            ]
        });

        return this.browser;
    }

    /**
     * Find Chrome/Chromium executable path
     */
    private findChromeExecutable(): string {
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

        for (const path of possiblePaths) {
            if (fs.existsSync(path)) {
                return path;
            }
        }

        throw new Error('Chrome/Chromium executable not found. Please install Chrome or Chromium.');
    }

    /**
     * Generate PDF from HTML content with ATS compatibility
     */
    public async generateResumePDF(
        htmlContent: string,
        outputPath: string,
        options: Partial<PDFConfig> = {}
    ): Promise<void> {
        const browser = await this.initializeBrowser();
        const page = await browser.newPage();

        try {
            // Set viewport to match PDF dimensions
            const pdfDimensions = this.getPDFDimensions();
            await page.setViewport({
                width: pdfDimensions.width,
                height: pdfDimensions.height,
                deviceScaleFactor: this.config.dpi / 96 // Convert DPI to device scale factor
            });

            // Inject ATS-compatible styles
            const atsStyles = this.generateATSStyles();
            await page.evaluateOnNewDocument(() => {
                const style = document.createElement('style');
                style.textContent = `
          /* ATS Compatibility Styles */
          * {
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          /* Ensure text is selectable */
          * {
            -webkit-user-select: text !important;
            -moz-user-select: text !important;
            -ms-user-select: text !important;
            user-select: text !important;
          }
          
          /* Preserve semantic structure */
          h1, h2, h3, h4, h5, h6 {
            font-weight: bold !important;
            page-break-after: avoid !important;
          }
          
          /* Ensure proper text flow */
          p, li, div {
            page-break-inside: avoid !important;
          }
          
          /* Remove problematic elements for ATS */
          .decorative, [class*="decorative"] {
            display: none !important;
          }
          
          /* Ensure proper contrast */
          * {
            color: #000000 !important;
            background: transparent !important;
          }
          
          /* Print-specific styles */
          @media print {
            body {
              font-family: Arial, Helvetica, sans-serif !important;
              line-height: 1.4 !important;
              color: #000000 !important;
              background: #ffffff !important;
            }
            
            /* Ensure proper page breaks */
            .page-break {
              page-break-before: always !important;
            }
            
            /* Avoid breaking within sections */
            section {
              page-break-inside: avoid !important;
            }
            
            /* Ensure all text is visible */
            * {
              color: #000000 !important;
            }
          }
        `;
                document.head.appendChild(style);
            });

            // Set the HTML content
            await page.setContent(htmlContent, {
                waitUntil: ['networkidle0', 'domcontentloaded']
            });

            // Wait for fonts to load
            await page.evaluate(() => {
                return document.fonts.ready;
            });

            // Wait for any dynamic content
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Optimize for ATS compatibility
            await this.optimizeForATS(page);

            // Generate PDF with high-quality settings
            const pdfBuffer = await page.pdf({
                format: this.config.format,
                margin: this.config.margin,
                printBackground: this.config.printBackground,
                preferCSSPageSize: this.config.preferCSSPageSize,
                displayHeaderFooter: this.config.displayHeaderFooter,
                scale: this.config.scale,
                // Ensure text is selectable
                omitBackground: false
            });

            // Save PDF to file
            fs.writeFileSync(outputPath, pdfBuffer);

            console.log(`✅ PDF generated successfully: ${outputPath}`);
            console.log(`📊 PDF size: ${(pdfBuffer.length / 1024).toFixed(2)} KB`);

        } catch (error) {
            console.error('❌ Error generating PDF:', error);
            throw error;
        } finally {
            await page.close();
        }
    }

    /**
     * Generate PDF from URL
     */
    public async generateResumePDFFromURL(
        url: string,
        outputPath: string,
        options: Partial<PDFConfig> = {}
    ): Promise<void> {
        const browser = await this.initializeBrowser();
        const page = await browser.newPage();

        try {
            // Set viewport
            const pdfDimensions = this.getPDFDimensions();
            await page.setViewport({
                width: pdfDimensions.width,
                height: pdfDimensions.height,
                deviceScaleFactor: this.config.dpi / 96
            });

            // Navigate to URL
            await page.goto(url, {
                waitUntil: ['networkidle0', 'domcontentloaded']
            });

            // Wait for fonts and dynamic content
            await page.evaluate(() => document.fonts.ready);
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Optimize for ATS
            await this.optimizeForATS(page);

            // Generate PDF
            const pdfBuffer = await page.pdf({
                format: this.config.format,
                margin: this.config.margin,
                printBackground: this.config.printBackground,
                preferCSSPageSize: this.config.preferCSSPageSize,
                displayHeaderFooter: this.config.displayHeaderFooter,
                scale: this.config.scale,
                omitBackground: false
            });

            fs.writeFileSync(outputPath, pdfBuffer);
            console.log(`✅ PDF generated from URL: ${outputPath}`);

        } catch (error) {
            console.error('❌ Error generating PDF from URL:', error);
            throw error;
        } finally {
            await page.close();
        }
    }

    /**
 * Optimize page for ATS compatibility
 */
    private async optimizeForATS(page: Page): Promise<void> {
        await page.evaluate(() => {
            // Remove decorative elements
            const decorativeElements = document.querySelectorAll('.decorative, [class*="decorative"], [class*="ornament"]');
            decorativeElements.forEach(el => el.remove());

            // Ensure all text is properly structured
            const textElements = document.querySelectorAll('p, span, div, h1, h2, h3, h4, h5, h6, li');
            textElements.forEach(el => {
                if (el.textContent && el.textContent.trim()) {
                    (el as HTMLElement).style.color = '#000000';
                    (el as HTMLElement).style.backgroundColor = 'transparent';
                    (el as HTMLElement).style.fontFamily = 'Arial, Helvetica, sans-serif';
                }
            });

            // Add proper heading hierarchy
            const sections = document.querySelectorAll('section, .section');
            sections.forEach(section => {
                if (!section.querySelector('h1, h2, h3, h4')) {
                    const firstTextElement = section.querySelector('p, div, span');
                    if (firstTextElement?.textContent?.trim()) {
                        const heading = document.createElement('h3');
                        heading.textContent = firstTextElement.textContent.trim().split(' ').slice(0, 3).join(' ');
                        heading.className = 'section-title';
                        section.insertBefore(heading, section.firstChild);
                    }
                }
            });

            // Ensure list items have proper bullets
            const listItems = document.querySelectorAll('li');
            listItems.forEach(li => {
                if (!li.textContent?.startsWith('•')) {
                    li.textContent = `• ${li.textContent}`;
                }
            });
        });
    }

    /**
     * Get PDF dimensions based on format
     */
    private getPDFDimensions(): { width: number; height: number } {
        if (this.config.format === 'A4') {
            return { width: 794, height: 1123 }; // A4 in pixels at 96 DPI
        } else {
            return { width: 816, height: 1056 }; // Letter in pixels at 96 DPI
        }
    }

    /**
     * Generate ATS-compatible styles
     */
    private generateATSStyles(): string {
        return `
      /* ATS Compatibility Styles */
      * {
        -webkit-print-color-adjust: exact !important;
        color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      
      /* Ensure text is selectable */
      * {
        -webkit-user-select: text !important;
        -moz-user-select: text !important;
        -ms-user-select: text !important;
        user-select: text !important;
      }
      
      /* Preserve semantic structure */
      h1, h2, h3, h4, h5, h6 {
        font-weight: bold !important;
        page-break-after: avoid !important;
      }
      
      /* Ensure proper text flow */
      p, li, div {
        page-break-inside: avoid !important;
      }
      
      /* Remove problematic elements for ATS */
      .decorative, [class*="decorative"] {
        display: none !important;
      }
      
      /* Ensure proper contrast */
      * {
        color: #000000 !important;
        background: transparent !important;
      }
      
      /* Print-specific styles */
      @media print {
        body {
          font-family: Arial, Helvetica, sans-serif !important;
          line-height: 1.4 !important;
          color: #000000 !important;
          background: #ffffff !important;
        }
        
        /* Ensure proper page breaks */
        .page-break {
          page-break-before: always !important;
        }
        
        /* Avoid breaking within sections */
        section {
          page-break-inside: avoid !important;
        }
        
        /* Ensure all text is visible */
        * {
          color: #000000 !important;
        }
      }
    `;
    }

    /**
     * Close browser instance
     */
    public async close(): Promise<void> {
        if (this.browser) {
            await this.browser.close();
            this.browser = null;
        }
    }
}

// CLI interface for the PDF generator
export class ResumePDFCLI {
    private generator: PuppeteerPDFGenerator;

    constructor() {
        this.generator = new PuppeteerPDFGenerator();
    }

    /**
     * Generate PDF from HTML file
     */
    public async generateFromFile(
        inputPath: string,
        outputPath: string,
        options: Partial<PDFConfig> = {}
    ): Promise<void> {
        const htmlContent = fs.readFileSync(inputPath, 'utf-8');
        await this.generator.generateResumePDF(htmlContent, outputPath, options);
    }

    /**
     * Generate PDF from URL
     */
    public async generateFromURL(
        url: string,
        outputPath: string,
        options: Partial<PDFConfig> = {}
    ): Promise<void> {
        await this.generator.generateResumePDFFromURL(url, outputPath, options);
    }

    /**
     * Close the generator
     */
    public async close(): Promise<void> {
        await this.generator.close();
    }
}

// Export convenience functions
export const generateResumePDF = async (
    htmlContent: string,
    outputPath: string,
    config: Partial<PDFConfig> = {}
): Promise<void> => {
    const generator = new PuppeteerPDFGenerator(config);
    try {
        await generator.generateResumePDF(htmlContent, outputPath);
    } finally {
        await generator.close();
    }
};

export const generateResumePDFFromURL = async (
    url: string,
    outputPath: string,
    config: Partial<PDFConfig> = {}
): Promise<void> => {
    const generator = new PuppeteerPDFGenerator(config);
    try {
        await generator.generateResumePDFFromURL(url, outputPath);
    } finally {
        await generator.close();
    }
}; 