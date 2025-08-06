import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../Layout/Sidebar';
import ResumePreview from './ResumePreview';
import TemplatePanel from './TemplatePanel';
import DesignPanel from './DesignPanel';
import SectionManager from './SectionManager';
import AddSectionModal from '../Modals/AddSectionModal';

import { useResumeStore } from '../../store/resumeStore';
import { downloadResume } from '../../utils/pdfExport';
import { ResumeSection } from '../../types';

const ResumeEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { loadResume, currentResume, saveCurrentResume, updateResume, setCurrentResume } = useResumeStore();
  const [activeSection, setActiveSection] = useState('');
  const [showAddSectionModal, setShowAddSectionModal] = useState(false);
  const [selectedBlock, setSelectedBlock] = useState<{
    type: string;
    id: string;
    index?: number;
  } | null>(null);
  const [toolbarPosition, setToolbarPosition] = useState<{ x: number; y: number } | null>(null);
  const [showSectionManager, setShowSectionManager] = useState(false);

  useEffect(() => {
    if (id) {
      const resume = loadResume(id);
      if (!resume) {
        navigate('/');
      } else {
        console.log('ResumeEditor - Loaded resume:', resume);
        console.log('ResumeEditor - Resume design:', resume.content.design);
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
    if (section === 'add-section') {
      setShowAddSectionModal(true);
    } else {
      setActiveSection(activeSection === section ? '' : section);
    }
  };

  const handleAddSection = (newSection: ResumeSection) => {
    if (!currentResume) return;

    const updatedResume = {
      ...currentResume,
      content: {
        ...currentResume.content,
        sections: [...currentResume.content.sections, newSection],
      },
    };

    // Update the resume in the store
    updateResume(currentResume.id, updatedResume);
    setCurrentResume(updatedResume);
  };

  const handleBlockSelect = (type: string, id: string, index?: number, event?: React.MouseEvent) => {
    console.log('Block selected:', { type, id, index });
    setSelectedBlock({ type, id, index });

    if (event) {
      const rect = event.currentTarget.getBoundingClientRect();
      setToolbarPosition({
        x: rect.left + rect.width / 2,
        y: rect.top
      });
    }
  };

  const handleBlockDeselect = () => {
    setSelectedBlock(null);
    setToolbarPosition(null);
  };

  const handleTextFormat = () => {
    console.log('Text format clicked for:', selectedBlock);
    // Implement text formatting logic
  };

  const handleDateEdit = () => {
    console.log('Date edit clicked for:', selectedBlock);
    // Implement date editing logic
  };

  const handleDelete = () => {
    if (!selectedBlock || !currentResume) return;

    console.log('Delete clicked for:', selectedBlock);
    // Implement delete logic based on block type
    handleBlockDeselect();
  };

  const handleSettings = () => {
    console.log('Settings clicked for:', selectedBlock);
    // Implement settings logic
  };

  const handleReorderSections = (sections: ResumeSection[]) => {
    if (!currentResume) return;

    const updatedResume = {
      ...currentResume,
      content: {
        ...currentResume.content,
        sections,
      },
    };

    updateResume(currentResume.id, updatedResume);
    setCurrentResume(updatedResume);
  };

  const handleToggleSection = (sectionId: string, visible: boolean) => {
    if (!currentResume) return;

    const updatedSections = currentResume.content.sections.map(section =>
      section.id === sectionId ? { ...section, visible } : section
    );

    const updatedResume = {
      ...currentResume,
      content: {
        ...currentResume.content,
        sections: updatedSections,
      },
    };

    updateResume(currentResume.id, updatedResume);
    setCurrentResume(updatedResume);
  };

  const handleDeleteSection = (sectionId: string) => {
    if (!currentResume) return;

    const updatedSections = currentResume.content.sections.filter(
      section => section.id !== sectionId
    );

    const updatedResume = {
      ...currentResume,
      content: {
        ...currentResume.content,
        sections: updatedSections,
      },
    };

    updateResume(currentResume.id, updatedResume);
    setCurrentResume(updatedResume);
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
        <div className="flex-1 p-6 overflow-y-auto relative" onClick={handleBlockDeselect}>
          <div className="max-w-4xl mx-auto">
            <ResumePreview
              resume={currentResume}
              onBlockSelect={handleBlockSelect}
              selectedBlock={selectedBlock}
            />
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

        {activeSection === 'sections' && (
          <div className="w-80">
            <SectionManager
              sections={currentResume.content.sections}
              onAddSection={handleAddSection}
              onReorderSections={handleReorderSections}
              onToggleSection={handleToggleSection}
              onDeleteSection={handleDeleteSection}
            />
          </div>
        )}
      </div>

      {/* Add Section Modal */}
      <AddSectionModal
        isOpen={showAddSectionModal}
        onClose={() => setShowAddSectionModal(false)}
        resume={currentResume}
        onAddSection={handleAddSection}
      />
    </div>
  );
};

export default ResumeEditor;