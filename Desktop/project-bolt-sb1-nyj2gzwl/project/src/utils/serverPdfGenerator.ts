interface PDFConfig {
    format?: 'A4' | 'Letter';
    dpi?: number;
    margin?: {
        top?: string;
        right?: string;
        bottom?: string;
        left?: string;
    };
}

interface PDFResponse {
    success: boolean;
    error?: string;
    pdfBuffer?: ArrayBuffer;
}

export class ServerPDFGenerator {
    private serverUrl: string;

    constructor(serverUrl: string = 'http://localhost:4000') {
        this.serverUrl = serverUrl;
        console.log('🔧 ServerPDFGenerator initialized with URL:', this.serverUrl);
    }

    /**
 * Generate PDF from HTML content using server-side Puppeteer
 */
    async generatePDFFromHTML(html: string, config: PDFConfig = {}): Promise<Blob> {
        try {
            console.log('🌐 Calling server at:', `${this.serverUrl}/api/pdf`);
            console.log('📊 Config:', config);
            console.log('📄 HTML length:', html.length);
            console.log('📄 HTML preview:', html.substring(0, 200) + '...');

            const requestBody = JSON.stringify({
                html,
                config
            });
            console.log('📦 Request body size:', requestBody.length, 'bytes');

            // Check if request body is too large
            if (requestBody.length > 5000000) { // 5MB limit
                console.warn('⚠️ Request body is very large:', requestBody.length, 'bytes');
            }

            const response = await fetch(`${this.serverUrl}/api/pdf`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: requestBody
            });

            console.log('📡 Server response status:', response.status);
            console.log('📡 Server response ok:', response.ok);
            console.log('📡 Server response headers:', Object.fromEntries(response.headers.entries()));

            if (!response.ok) {
                let errorData;
                try {
                    errorData = await response.json();
                } catch (e) {
                    const errorText = await response.text();
                    console.error('❌ Server error (text):', errorText);
                    throw new Error(`PDF generation failed: ${response.status} ${response.statusText}`);
                }
                console.error('❌ Server error (JSON):', errorData);
                throw new Error(errorData.error || 'PDF generation failed');
            }

            const pdfBlob = await response.blob();
            console.log('📄 PDF blob size:', pdfBlob.size, 'bytes');
            console.log('📄 PDF blob type:', pdfBlob.type);

            // Verify it's actually a PDF
            if (pdfBlob.type !== 'application/pdf') {
                console.error('❌ Blob is not a PDF! Type:', pdfBlob.type);
                // Try to get the response as text to see what we got
                const responseText = await response.text();
                console.error('❌ Response text (first 500 chars):', responseText.substring(0, 500));
                throw new Error('Server did not return a valid PDF');
            }

            return pdfBlob;
        } catch (error) {
            console.error('❌ Server PDF generation error:', error);
            throw error;
        }
    }

    /**
     * Generate PDF from URL using server-side Puppeteer
     */
    async generatePDFFromURL(url: string, config: PDFConfig = {}): Promise<Blob> {
        try {
            const response = await fetch(`${this.serverUrl}/api/pdf`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    url,
                    config
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'PDF generation failed');
            }

            const pdfBlob = await response.blob();
            return pdfBlob;
        } catch (error) {
            console.error('Server PDF generation error:', error);
            throw error;
        }
    }

    /**
 * Download PDF from HTML content
 */
    async downloadPDFFromHTML(html: string, filename: string = 'resume.pdf', config: PDFConfig = {}): Promise<void> {
        try {
            console.log('📥 Starting download process...');
            console.log('📄 Filename:', filename);

            const pdfBlob = await this.generatePDFFromHTML(html, config);
            console.log('📄 Generated PDF blob, size:', pdfBlob.size, 'bytes');

            this.downloadBlob(pdfBlob, filename);
            console.log('✅ PDF download completed!');
        } catch (error) {
            console.error('❌ Download error:', error);
            throw error;
        }
    }

    /**
     * Download PDF from URL
     */
    async downloadPDFFromURL(url: string, filename: string = 'resume.pdf', config: PDFConfig = {}): Promise<void> {
        try {
            const pdfBlob = await this.generatePDFFromURL(url, config);
            this.downloadBlob(pdfBlob, filename);
        } catch (error) {
            console.error('Download error:', error);
            throw error;
        }
    }

    /**
     * Helper method to download blob as file
     */
    private downloadBlob(blob: Blob, filename: string): void {
        try {
            console.log('💾 Creating download link...');
            console.log('📄 Blob type:', blob.type);
            console.log('📄 Blob size:', blob.size, 'bytes');

            // Verify blob is valid
            if (blob.size === 0) {
                throw new Error('Generated PDF blob is empty');
            }

            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            link.style.display = 'none';

            // Add event listeners to handle download
            link.addEventListener('click', () => {
                console.log('📥 Download link clicked');
            });

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Clean up URL after a delay to ensure download starts
            setTimeout(() => {
                URL.revokeObjectURL(url);
                console.log('✅ Download link created successfully');
            }, 1000);
        } catch (error) {
            console.error('❌ Download error:', error);
            throw error;
        }
    }
}

// Export convenience functions
export const generateServerPDF = async (html: string, config: PDFConfig = {}): Promise<Blob> => {
    const generator = new ServerPDFGenerator();
    return generator.generatePDFFromHTML(html, config);
};

export const downloadServerPDF = async (html: string, filename: string = 'resume.pdf', config: PDFConfig = {}): Promise<void> => {
    const generator = new ServerPDFGenerator();
    return generator.downloadPDFFromHTML(html, filename, config);
}; 