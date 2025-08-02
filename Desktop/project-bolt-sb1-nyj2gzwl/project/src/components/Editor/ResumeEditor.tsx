import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../Layout/Sidebar';
import ResumePreview from './ResumePreview';
import TemplatePanel from './TemplatePanel';
import DesignPanel from './DesignPanel';
import { useResumeStore } from '../../store/resumeStore';
import { downloadResume } from '../../utils/pdfExport';

const ResumeEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { loadResume, currentResume, saveCurrentResume } = useResumeStore();
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    if (id) {
      const resume = loadResume(id);
      if (!resume) {
        navigate('/');
      }
    }
  }, [id, loadResume, navigate]);

  useEffect(() => {
    // Auto-save every 3 seconds
    const interval = setInterval(() => {
      saveCurrentResume();
    }, 3000);

    return () => clearInterval(interval);
  }, [saveCurrentResume]);

  if (!currentResume) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading resume...</p>
        </div>
      </div>
    );
  }

  const handleSectionChange = (section: string) => {
    setActiveSection(activeSection === section ? '' : section);
  };

  const handleDownload = async () => {
    if (currentResume) {
      try {
        console.log('🔍 Looking for resume element...');
        // Get the resume element from the DOM
        const resumeElement = document.querySelector('.resume-preview') as HTMLElement;
        console.log('📄 Resume element found:', !!resumeElement);
        console.log('📄 Resume element:', resumeElement);

        if (resumeElement) {
          console.log('📄 Resume element HTML length:', resumeElement.outerHTML.length);
          console.log('📄 Resume element classes:', resumeElement.className);
          console.log('Using server-side PDF generation for better text export...');
          await downloadResume(resumeElement, `${currentResume.title}.pdf`);
        } else {
          console.error('❌ Resume element not found');
          console.log('🔍 Available elements with "resume" in class:', document.querySelectorAll('[class*="resume"]'));
          alert('Error: Resume element not found. Please try again.');
        }
      } catch (error) {
        console.error('❌ Error downloading resume:', error);
        alert('Error downloading resume. Please try again.');
      }
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
        improveScore={9}
        onDownload={handleDownload}
      />

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Center Panel - Resume Preview */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            <ResumePreview resume={currentResume} />
          </div>
        </div>

        {/* Right Panel - Properties */}
        {activeSection === 'templates' && (
          <div className="w-80">
            <TemplatePanel
              currentTemplateId={currentResume.templateId}
              onClose={() => setActiveSection('')}
            />
          </div>
        )}

        {activeSection === 'design-font' && (
          <div className="w-80">
            <DesignPanel resume={currentResume} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeEditor;