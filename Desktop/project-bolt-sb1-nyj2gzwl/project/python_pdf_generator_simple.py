#!/usr/bin/env python3
"""
Python PDF Generator for ATS-Compatible Resume PDFs
Uses ReportLab for reliable PDF generation on Windows
"""

import json
import sys
import os
from pathlib import Path
from typing import Dict, Any, Optional
import argparse

try:
    from reportlab.lib.pagesizes import letter, A4
    from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
    from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
    from reportlab.lib.units import inch
    from reportlab.lib.colors import black, white, blue, gray
    from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_RIGHT
except ImportError:
    print("Installing required packages...")
    os.system("pip install reportlab")
    from reportlab.lib.pagesizes import letter, A4
    from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
    from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
    from reportlab.lib.units import inch
    from reportlab.lib.colors import black, white, blue, gray
    from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_RIGHT

class ATSCompatiblePDFGenerator:
    def __init__(self):
        self.styles = getSampleStyleSheet()
        self._setup_custom_styles()
        
    def _setup_custom_styles(self):
        """Setup custom paragraph styles for ATS compatibility"""
        # Name style
        self.name_style = ParagraphStyle(
            'NameStyle',
            parent=self.styles['Heading1'],
            fontSize=24,
            spaceAfter=6,
            alignment=TA_CENTER,
            fontName='Helvetica-Bold'
        )
        
        # Title style
        self.title_style = ParagraphStyle(
            'TitleStyle',
            parent=self.styles['Normal'],
            fontSize=14,
            spaceAfter=12,
            alignment=TA_CENTER,
            fontName='Helvetica',
            textColor=gray
        )
        
        # Section header style
        self.section_style = ParagraphStyle(
            'SectionStyle',
            parent=self.styles['Heading2'],
            fontSize=16,
            spaceAfter=6,
            spaceBefore=12,
            fontName='Helvetica-Bold',
            textColor=black
        )
        
        # Job title style
        self.job_title_style = ParagraphStyle(
            'JobTitleStyle',
            parent=self.styles['Normal'],
            fontSize=12,
            spaceAfter=3,
            fontName='Helvetica-Bold',
            textColor=black
        )
        
        # Company style
        self.company_style = ParagraphStyle(
            'CompanyStyle',
            parent=self.styles['Normal'],
            fontSize=11,
            spaceAfter=2,
            fontName='Helvetica',
            textColor=blue
        )
        
        # Date style
        self.date_style = ParagraphStyle(
            'DateStyle',
            parent=self.styles['Normal'],
            fontSize=10,
            spaceAfter=6,
            fontName='Helvetica',
            textColor=gray
        )
        
        # Contact style
        self.contact_style = ParagraphStyle(
            'ContactStyle',
            parent=self.styles['Normal'],
            fontSize=10,
            spaceAfter=2,
            alignment=TA_CENTER,
            fontName='Helvetica'
        )
        
        # Bullet style
        self.bullet_style = ParagraphStyle(
            'BulletStyle',
            parent=self.styles['Normal'],
            fontSize=10,
            spaceAfter=3,
            leftIndent=20,
            fontName='Helvetica',
            textColor=black
        )
        
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
        
    def generate_pdf(self, html_content: str, output_path: str) -> bool:
        """Generate ATS-compatible PDF from HTML content"""
        try:
            print("🔍 Parsing resume data...")
            # Parse the resume data
            resume_data = self.parse_resume_data(html_content)
            print(f"📄 Found data: {resume_data}")
            
            print("📝 Creating PDF document...")
            # Create PDF document
            doc = SimpleDocTemplate(output_path, pagesize=A4, rightMargin=0.75*inch, leftMargin=0.75*inch, topMargin=0.75*inch, bottomMargin=0.75*inch)
            
            # Build story (content)
            story = []
            
            # Header with name and title
            if resume_data['name']:
                story.append(Paragraph(resume_data['name'], self.name_style))
            if resume_data['title']:
                story.append(Paragraph(resume_data['title'], self.title_style))
                
            # Contact information
            contact_parts = []
            if resume_data['contact'].get('phone'):
                contact_parts.append(resume_data['contact']['phone'])
            if resume_data['contact'].get('email'):
                contact_parts.append(resume_data['contact']['email'])
            if resume_data['contact'].get('portfolio'):
                contact_parts.append(resume_data['contact']['portfolio'])
            if resume_data['contact'].get('location'):
                contact_parts.append(resume_data['contact']['location'])
                
            if contact_parts:
                contact_text = ' | '.join(contact_parts)
                story.append(Paragraph(contact_text, self.contact_style))
                story.append(Spacer(1, 12))
                
            # Experience section
            if resume_data['experience']:
                story.append(Paragraph('PROFESSIONAL EXPERIENCE', self.section_style))
                
                for job in resume_data['experience']:
                    if job.get('title'):
                        story.append(Paragraph(job['title'], self.job_title_style))
                    if job.get('company'):
                        story.append(Paragraph(job['company'], self.company_style))
                    if job.get('dates'):
                        story.append(Paragraph(job['dates'], self.date_style))
                        
                    # Job description bullets
                    for desc in job.get('description', []):
                        bullet_text = f"• {desc}"
                        story.append(Paragraph(bullet_text, self.bullet_style))
                        
                    story.append(Spacer(1, 6))
                    
            # Skills section
            if resume_data['skills']:
                story.append(Paragraph('SKILLS', self.section_style))
                for skill in resume_data['skills']:
                    story.append(Paragraph(f"• {skill}", self.bullet_style))
                    
            # Languages section
            if resume_data['languages']:
                story.append(Paragraph('LANGUAGES', self.section_style))
                for language in resume_data['languages']:
                    story.append(Paragraph(f"• {language}", self.bullet_style))
                    
            print("💾 Building PDF...")
            # Build PDF
            doc.build(story)
            
            print(f"✅ PDF generated successfully: {output_path}")
            print(f"📄 File size: {os.path.getsize(output_path)} bytes")
            return True
            
        except Exception as e:
            print(f"❌ Error generating PDF: {str(e)}")
            import traceback
            traceback.print_exc()
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