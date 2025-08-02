import { ServerPDFGenerator } from './serverPdfGenerator';

/**
 * Generate PDF using server-side Puppeteer for maximum ATS compatibility and visual fidelity
 */
export const generateServerSidePDF = async (resumeElement: HTMLElement, filename: string = 'resume.pdf') => {
  try {
    console.log('🚀 Starting server-side PDF generation with Puppeteer...');
    console.log('📄 Resume element found:', !!resumeElement);
    console.log('📄 Resume element HTML length:', resumeElement.outerHTML.length);

    const serverGenerator = new ServerPDFGenerator();

    // Create a clean copy of the resume element without modifying the original
    const resumeClone = resumeElement.cloneNode(true) as HTMLElement;

    // Get all computed styles from the original element and its children
    const originalStyles = getComputedStylesFromElement(resumeElement);

    console.log('🧹 Cleaning HTML for PDF...');
    console.log('📄 Original HTML length:', resumeClone.outerHTML.length);
    console.log('📄 Original HTML preview:', resumeClone.outerHTML.substring(0, 500) + '...');

    // Clean the HTML to remove unwanted borders
    const cleanedHTML = cleanHTMLForPDF(resumeClone.outerHTML);
    console.log('📄 Cleaned HTML length:', cleanedHTML.length);

    console.log('🎨 Preserving original design with minimal PDF optimizations...');

    // Minimal styles that preserve the original design
    const pdfStyles = `
      /* Preserve original colors and design */
      * {
        -webkit-print-color-adjust: exact !important;
        color-adjust: exact !important;
      }
      
      /* Ensure text is visible for PDF */
      * {
        color: inherit !important;
        visibility: visible !important;
      }
      
      /* Fix list items to use proper bullets */
      li {
        list-style-type: disc !important;
        list-style-position: outside !important;
      }
      
      /* Ensure text doesn't get cut off */
      p, div, span {
        word-wrap: break-word !important;
        overflow-wrap: break-word !important;
      }
      
      /* Include original computed styles */
      ${originalStyles}
    `;

    // Add print styles for better PDF rendering - Ensure text visibility
    const enhancedHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
          <style>
            /* Only minimal fixes - preserve original design */
            * {
              -webkit-print-color-adjust: exact !important;
              color-adjust: exact !important;
            }
            
            /* Fix list items to use proper bullets */
            li {
              list-style-type: disc !important;
              list-style-position: outside !important;
            }
            
            /* Ensure text doesn't get cut off */
            p, div, span {
              word-wrap: break-word !important;
              overflow-wrap: break-word !important;
            }
            
            /* Include computed styles from the actual resume */
            ${pdfStyles}
          </style>
        </head>
        <body>
          ${cleanedHTML}
        </body>
      </html>
    `;

    console.log('⚙️ Using high-quality settings (300 DPI, A4 format)...');
    // Use high-quality settings to ensure all content is captured
    const config = {
      format: 'A4' as const,
      dpi: 300,
      margin: { top: '0.5in', right: '0.5in', bottom: '0.5in', left: '0.5in' }
    };

    console.log('📤 Sending to server for Puppeteer processing...');
    await serverGenerator.downloadPDFFromHTML(enhancedHTML, filename, config);
    console.log('✅ Server-side PDF generation completed successfully!');
  } catch (error) {
    console.error('❌ Server-side PDF generation failed:', error);
    throw error;
  }
};

/**
 * Get computed styles from an element and its children
 */
const getComputedStylesFromElement = (element: HTMLElement): string => {
  try {
    const styles: string[] = [];

    // Get computed styles for the main element
    const computedStyle = window.getComputedStyle(element);
    const elementStyles = Array.from(computedStyle).map(property => {
      const value = computedStyle.getPropertyValue(property);
      return `${property}: ${value};`;
    }).join(' ');

    if (elementStyles) {
      styles.push(`.resume-preview { ${elementStyles} }`);
    }

    // Get styles for child elements
    const allElements = element.querySelectorAll('*');
    allElements.forEach((el, index) => {
      const elComputedStyle = window.getComputedStyle(el);
      const elStyles = Array.from(elComputedStyle).map(property => {
        const value = elComputedStyle.getPropertyValue(property);
        return `${property}: ${value};`;
      }).join(' ');

      if (elStyles) {
        styles.push(`.resume-preview *:nth-child(${index + 1}) { ${elStyles} }`);
      }
    });

    return styles.join('\n');
  } catch (error) {
    console.warn('⚠️ Error getting computed styles:', error);
    return '';
  }
};

/**
 * Get computed styles from an element and its children (legacy function)
 */
const getComputedStyles = async (element: HTMLElement): Promise<string> => {
  try {
    // Simplified approach - just ensure text visibility
    return `
      * {
        color: #000 !important;
        visibility: visible !important;
      }
      
      li {
        list-style-type: disc !important;
        list-style-position: outside !important;
        margin-left: 20px !important;
      }
      
      p, div, span, h1, h2, h3, h4, h5, h6 {
        word-wrap: break-word !important;
        overflow-wrap: break-word !important;
      }
    `;
  } catch (error) {
    console.warn('⚠️ Error getting computed styles:', error);
    return '';
  }
};

/**
 * Clean HTML content to remove unwanted borders and styling
 * Server-side safe version that doesn't rely on DOM
 */
const cleanHTMLForPDF = (html: string): string => {
  // Simple string-based cleaning for server-side compatibility
  let cleanedHTML = html;

  // Remove unwanted style attributes that might hide text
  cleanedHTML = cleanedHTML.replace(/style="[^"]*color:\s*transparent[^"]*"/gi, '');
  cleanedHTML = cleanedHTML.replace(/style="[^"]*visibility:\s*hidden[^"]*"/gi, '');
  cleanedHTML = cleanedHTML.replace(/style="[^"]*display:\s*none[^"]*"/gi, '');

  // Only ensure visibility, don't change colors
  cleanedHTML = cleanedHTML.replace(/style="([^"]*)"/gi, (match, styles) => {
    if (!styles.includes('visibility:')) {
      return `style="${styles}; visibility: visible;"`;
    }
    return match;
  });

  return cleanedHTML;
};

// Export the main function for use in components
export const downloadResume = async (resumeElement: HTMLElement, filename: string = 'resume.pdf') => {
  return generateServerSidePDF(resumeElement, filename);
};