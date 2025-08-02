#!/usr/bin/env python3
"""
Python PDF Generator for ATS-Compatible Resume PDFs
Uses WeasyPrint for HTML-to-PDF conversion with ATS optimization
"""

import json
import sys
import os
from pathlib import Path
from typing import Dict, Any, Optional
import argparse

try:
    from weasyprint import HTML, CSS
    from weasyprint.text.fonts import FontConfiguration
except ImportError:
    print("Installing required packages...")
    os.system("pip install weasyprint")
    from weasyprint import HTML, CSS
    from weasyprint.text.fonts import FontConfiguration

class ATSCompatiblePDFGenerator:
    def __init__(self):
        self.font_config = FontConfiguration()
        
    def parse_resume_data(self, html_content: str) -> Dict[str, Any]:
        """Parse HTML content and extract structured resume data"""
        try:
            from bs4 import BeautifulSoup
        except ImportError:
            os.system("pip install beautifulsoup4")
            from bs4 import BeautifulSoup
            
        soup = BeautifulSoup(html_content, 'html.parser')
        
        # Extract structured data
        resume_data = {
            'name': '',
            'title': '',
            'contact': {},
            'skills': [],
            'experience': [],
            'education': [],
            'languages': []
        }
        
        # Extract name (usually the largest heading)
        name_elem = soup.find('h1') or soup.find('h2') or soup.find('h3')
        if name_elem:
            resume_data['name'] = name_elem.get_text(strip=True)
            
        # Extract title/position
        title_elem = soup.find('p') or soup.find('span')
        if title_elem:
            resume_data['title'] = title_elem.get_text(strip=True)
            
        # Extract contact information
        contact_section = soup.find(string=lambda text: 'CONTACT' in text.upper() if text else False)
        if contact_section:
            contact_parent = contact_section.parent
            if contact_parent:
                contact_elements = contact_parent.find_next_siblings()
                for elem in contact_elements:
                    text = elem.get_text(strip=True)
                    if text and len(text) > 3:
                        if '@' in text:
                            resume_data['contact']['email'] = text
                        elif any(char.isdigit() for char in text):
                            resume_data['contact']['phone'] = text
                        elif 'linkedin' in text.lower() or 'behance' in text.lower():
                            resume_data['contact']['portfolio'] = text
                        else:
                            resume_data['contact']['location'] = text
                            
        # Extract skills
        skills_section = soup.find(string=lambda text: 'SKILLS' in text.upper() if text else False)
        if skills_section:
            skills_parent = skills_section.parent
            if skills_parent:
                skill_elements = skills_parent.find_next_siblings()
                for elem in skill_elements:
                    text = elem.get_text(strip=True)
                    if text and len(text) > 2:
                        resume_data['skills'].append(text)
                        
        # Extract experience
        experience_section = soup.find(string=lambda text: 'EXPERIENCE' in text.upper() if text else False)
        if experience_section:
            experience_parent = experience_section.parent
            if experience_parent:
                # Look for job entries
                job_elements = experience_parent.find_all(['div', 'section'], class_=lambda x: x and any(word in x.lower() for word in ['job', 'experience', 'work']))
                for job_elem in job_elements:
                    job_data = {
                        'title': '',
                        'company': '',
                        'dates': '',
                        'location': '',
                        'description': []
                    }
                    
                    # Extract job title
                    title_elem = job_elem.find(['h3', 'h4', 'strong'])
                    if title_elem:
                        job_data['title'] = title_elem.get_text(strip=True)
                        
                    # Extract company name (usually in blue or different color)
                    company_elem = job_elem.find(class_=lambda x: x and any(word in x.lower() for word in ['blue', 'company', 'text-blue']))
                    if company_elem:
                        job_data['company'] = company_elem.get_text(strip=True)
                        
                    # Extract dates
                    date_elem = job_elem.find(string=lambda text: text and any(word in text.lower() for word in ['202', '201', 'present', 'current']))
                    if date_elem:
                        job_data['dates'] = date_elem.strip()
                        
                    # Extract description bullets
                    bullets = job_elem.find_all('li')
                    for bullet in bullets:
                        text = bullet.get_text(strip=True)
                        if text and len(text) > 10:
                            job_data['description'].append(text)
                            
                    if job_data['title'] or job_data['company']:
                        resume_data['experience'].append(job_data)
                        
        return resume_data
        
    def generate_ats_compatible_html(self, resume_data: Dict[str, Any]) -> str:
        """Generate ATS-compatible HTML with proper semantic structure"""
        
        html_template = f"""
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>{resume_data['name']} - Resume</title>
            <style>
                /* ATS-Compatible Styles */
                body {{
                    font-family: Arial, Helvetica, sans-serif;
                    font-size: 12pt;
                    line-height: 1.4;
                    color: #000000;
                    background-color: #ffffff;
                    margin: 0;
                    padding: 20px;
                }}
                
                .header {{
                    text-align: center;
                    margin-bottom: 20px;
                }}
                
                .name {{
                    font-size: 24pt;
                    font-weight: bold;
                    margin-bottom: 5px;
                }}
                
                .title {{
                    font-size: 14pt;
                    color: #333333;
                    margin-bottom: 15px;
                }}
                
                .contact-info {{
                    text-align: center;
                    margin-bottom: 20px;
                    font-size: 11pt;
                }}
                
                .section {{
                    margin-bottom: 15px;
                }}
                
                .section-title {{
                    font-size: 16pt;
                    font-weight: bold;
                    text-transform: uppercase;
                    border-bottom: 2px solid #000000;
                    margin-bottom: 10px;
                    padding-bottom: 3px;
                }}
                
                .job {{
                    margin-bottom: 12px;
                }}
                
                .job-title {{
                    font-size: 13pt;
                    font-weight: bold;
                }}
                
                .job-company {{
                    font-size: 12pt;
                    color: #333333;
                }}
                
                .job-dates {{
                    font-size: 11pt;
                    color: #666666;
                    font-style: italic;
                }}
                
                .job-description {{
                    margin-top: 5px;
                    margin-left: 15px;
                }}
                
                .job-description li {{
                    margin-bottom: 3px;
                }}
                
                .skills-list {{
                    margin-left: 15px;
                }}
                
                .skills-list li {{
                    margin-bottom: 3px;
                }}
                
                /* Print styles for better PDF output */
                @media print {{
                    body {{
                        margin: 0.5in;
                    }}
                    
                    .page-break {{
                        page-break-before: always;
                    }}
                }}
            </style>
        </head>
        <body>
            <div class="header">
                <h1 class="name">{resume_data['name']}</h1>
                <p class="title">{resume_data['title']}</p>
            </div>
            
            <div class="contact-info">
                {self._format_contact_info(resume_data['contact'])}
            </div>
            
            {self._format_experience_section(resume_data['experience'])}
            
            {self._format_skills_section(resume_data['skills'])}
            
            {self._format_languages_section(resume_data['languages'])}
        </body>
        </html>
        """
        
        return html_template
        
    def _format_contact_info(self, contact: Dict[str, str]) -> str:
        """Format contact information"""
        contact_parts = []
        if contact.get('phone'):
            contact_parts.append(contact['phone'])
        if contact.get('email'):
            contact_parts.append(contact['email'])
        if contact.get('portfolio'):
            contact_parts.append(contact['portfolio'])
        if contact.get('location'):
            contact_parts.append(contact['location'])
            
        return ' | '.join(contact_parts)
        
    def _format_experience_section(self, experience: list) -> str:
        """Format experience section"""
        if not experience:
            return ""
            
        html = '<div class="section"><h2 class="section-title">Professional Experience</h2>'
        
        for job in experience:
            html += '<div class="job">'
            html += f'<div class="job-title">{job.get("title", "")}</div>'
            html += f'<div class="job-company">{job.get("company", "")}</div>'
            html += f'<div class="job-dates">{job.get("dates", "")}</div>'
            
            if job.get('description'):
                html += '<ul class="job-description">'
                for desc in job['description']:
                    html += f'<li>{desc}</li>'
                html += '</ul>'
                
            html += '</div>'
            
        html += '</div>'
        return html
        
    def _format_skills_section(self, skills: list) -> str:
        """Format skills section"""
        if not skills:
            return ""
            
        html = '<div class="section"><h2 class="section-title">Skills</h2>'
        html += '<ul class="skills-list">'
        for skill in skills:
            html += f'<li>{skill}</li>'
        html += '</ul></div>'
        return html
        
    def _format_languages_section(self, languages: list) -> str:
        """Format languages section"""
        if not languages:
            return ""
            
        html = '<div class="section"><h2 class="section-title">Languages</h2>'
        html += '<ul class="skills-list">'
        for language in languages:
            html += f'<li>{language}</li>'
        html += '</ul></div>'
        return html
        
    def generate_pdf(self, html_content: str, output_path: str) -> bool:
        """Generate ATS-compatible PDF from HTML content"""
        try:
            # Parse the resume data
            resume_data = self.parse_resume_data(html_content)
            
            # Generate ATS-compatible HTML
            ats_html = self.generate_ats_compatible_html(resume_data)
            
            # Create PDF using WeasyPrint
            html_doc = HTML(string=ats_html)
            css = CSS(string='', font_config=self.font_config)
            
            # Generate PDF
            html_doc.write_pdf(output_path, stylesheets=[css], font_config=self.font_config)
            
            print(f"✅ PDF generated successfully: {output_path}")
            print(f"📄 File size: {os.path.getsize(output_path)} bytes")
            return True
            
        except Exception as e:
            print(f"❌ Error generating PDF: {str(e)}")
            return False

def main():
    parser = argparse.ArgumentParser(description='Generate ATS-compatible PDF from HTML resume')
    parser.add_argument('--html', type=str, help='HTML content or file path')
    parser.add_argument('--output', type=str, default='resume.pdf', help='Output PDF file path')
    parser.add_argument('--server', action='store_true', help='Run as HTTP server')
    parser.add_argument('--port', type=int, default=5000, help='Server port')
    
    args = parser.parse_args()
    
    generator = ATSCompatiblePDFGenerator()
    
    if args.server:
        # Run as HTTP server
        try:
            from flask import Flask, request, jsonify
        except ImportError:
            os.system("pip install flask")
            from flask import Flask, request, jsonify
            
        app = Flask(__name__)
        
        @app.route('/generate-pdf', methods=['POST'])
        def generate_pdf_endpoint():
            try:
                data = request.get_json()
                html_content = data.get('html', '')
                filename = data.get('filename', 'resume.pdf')
                
                if not html_content:
                    return jsonify({'error': 'HTML content is required'}), 400
                    
                output_path = f"generated_{filename}"
                success = generator.generate_pdf(html_content, output_path)
                
                if success:
                    return jsonify({
                        'success': True,
                        'message': 'PDF generated successfully',
                        'filename': output_path
                    })
                else:
                    return jsonify({'error': 'Failed to generate PDF'}), 500
                    
            except Exception as e:
                return jsonify({'error': str(e)}), 500
                
        print(f"🚀 Starting PDF server on port {args.port}")
        app.run(host='0.0.0.0', port=args.port)
        
    else:
        # Generate PDF from command line
        if not args.html:
            print("❌ HTML content or file path is required")
            sys.exit(1)
            
        # Check if it's a file path
        if os.path.exists(args.html):
            with open(args.html, 'r', encoding='utf-8') as f:
                html_content = f.read()
        else:
            html_content = args.html
            
        success = generator.generate_pdf(html_content, args.output)
        sys.exit(0 if success else 1)

if __name__ == "__main__":
    main() 