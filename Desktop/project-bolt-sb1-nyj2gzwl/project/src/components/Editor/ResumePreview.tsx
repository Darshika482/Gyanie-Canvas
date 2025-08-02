import React from 'react';
import { Resume } from '../../types';

// Import all template components
import DoubleColumnTemplate from '../Templates/DoubleColumnTemplate';
import IvyLeagueTemplate from '../Templates/IvyLeagueTemplate';
import ElegantTemplate from '../Templates/ElegantTemplate';
import ModernTemplate from '../Templates/ModernTemplate';
import CreativeTemplate from '../Templates/CreativeTemplate';
import TimelineTemplate from '../Templates/TimelineTemplate';
import SingleColumnTemplate from '../Templates/SingleColumnTemplate';
import MultiColumnTemplate from '../Templates/MultiColumnTemplate';

interface ResumePreviewProps {
  resume: Resume;
}

const ResumePreview: React.FC<ResumePreviewProps> = ({ resume }) => {
  // Get the template ID from resume design settings
  const templateId = resume.content.design.templateId || resume.templateId;

  // Render the appropriate template based on templateId
  const renderTemplate = () => {
    switch (templateId) {
      case 'single-column':
        return <SingleColumnTemplate resume={resume} />;
      case 'multi-column':
        return <MultiColumnTemplate resume={resume} />;
      case 'double-column':
        return <DoubleColumnTemplate resume={resume} />;
      case 'ivy-league':
        return <IvyLeagueTemplate resume={resume} />;
      case 'elegant':
        return <ElegantTemplate resume={resume} />;
      case 'modern':
        return <ModernTemplate resume={resume} />;
      case 'creative':
        return <CreativeTemplate resume={resume} />;
      case 'timeline':
        return <TimelineTemplate resume={resume} />;
      default:
        // Default to the original template for backward compatibility
        return <DoubleColumnTemplate resume={resume} />;
    }
  };

  return (
    <div id="resume-preview" className="resume-preview">
      {renderTemplate()}
    </div>
  );
};

export default ResumePreview;