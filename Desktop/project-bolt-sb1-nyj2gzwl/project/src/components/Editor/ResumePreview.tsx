import React from 'react';
import { Resume } from '../../types';

// Import all template components
import DoubleColumnTemplate from '../Templates/DoubleColumnTemplate';
import EnhancedResumeTemplate from '../Templates/EnhancedResumeTemplate';
import IvyLeagueTemplate from '../Templates/IvyLeagueTemplate';
import ElegantTemplate from '../Templates/ElegantTemplate';
import ModernTemplate from '../Templates/ModernTemplate';
import CreativeTemplate from '../Templates/CreativeTemplate';
import TimelineTemplate from '../Templates/TimelineTemplate';
import SingleColumnTemplate from '../Templates/SingleColumnTemplate';
import MultiColumnTemplate from '../Templates/MultiColumnTemplate';

interface ResumePreviewProps {
  resume: Resume;
  onBlockSelect?: (type: string, id: string, index?: number, event?: React.MouseEvent) => void;
  selectedBlock?: {
    type: string;
    id: string;
    index?: number;
  } | null;
}

const ResumePreview: React.FC<ResumePreviewProps> = ({ resume, onBlockSelect, selectedBlock }) => {
  // Get the template ID from resume design settings
  const templateId = resume.content.design.templateId || resume.templateId;



  // Render the appropriate template based on templateId
  const renderTemplate = () => {
    const templateProps = {
      resume,
      onBlockSelect,
      selectedBlock
    };

    switch (templateId) {
      case 'enhanced':
        return <EnhancedResumeTemplate {...templateProps} />;
      case 'single-column':
        return <SingleColumnTemplate {...templateProps} />;
      case 'multi-column':
        return <MultiColumnTemplate {...templateProps} />;
      case 'double-column':
        return <DoubleColumnTemplate {...templateProps} />;
      case 'ivy-league':
        return <IvyLeagueTemplate {...templateProps} />;
      case 'elegant':
        return <ElegantTemplate {...templateProps} />;
      case 'modern':
        return <ModernTemplate {...templateProps} />;
      case 'creative':
        return <CreativeTemplate {...templateProps} />;
      case 'timeline':
        return <TimelineTemplate {...templateProps} />;
      default:
        // Default to the enhanced template for better UX
        return <EnhancedResumeTemplate {...templateProps} />;
    }
  };

  return (
    <div
      id="resume-preview"
      className="resume-preview"
      key={`${resume.id}-${resume.content.design.primaryColor}-${resume.content.design.secondaryColor}-${resume.content.design.templateId}`}
    >
      {renderTemplate()}
    </div>
  );
};

export default ResumePreview;