import React from 'react';
import EditableText from '../Editor/EditableText';
import EditableList from '../Editor/EditableList';
import SectionRenderer from '../Editor/SectionRenderer';
import { Resume } from '../../types';
import { useResumeStore } from '../../store/resumeStore';
import { sampleResumeData } from '../../data/defaultContent';

interface ModernTemplateProps {
  resume: Resume;
}

const ModernTemplate: React.FC<ModernTemplateProps> = ({ resume }) => {
  const { updateResume } = useResumeStore();
  const data = sampleResumeData;

  const updatePersonalInfo = (field: string, value: string) => {
    updateResume(resume.id, {
      content: {
        ...resume.content,
        personalInfo: {
          ...resume.content.personalInfo,
          [field]: value,
        },
      },
    });
  };

  const updateSection = (sectionId: string, updates: any) => {
    updateResume(resume.id, {
      content: {
        ...resume.content,
        sections: resume.content.sections.map(section =>
          section.id === sectionId
            ? { ...section, ...updates }
            : section
        ),
      },
    });
  };

  // TEMP DEBUG: Log the actual color values used in the header
  console.log('ModernTemplate header colors:', resume.content.design.primaryColor, resume.content.design.secondaryColor);

  return (
    <div
      className="bg-white shadow-lg rounded-lg overflow-hidden max-w-4xl mx-auto"
      key={`${resume.id}-${resume.content.design.primaryColor}-${resume.content.design.secondaryColor}`}
      style={{
        fontFamily: resume.content.design.fontFamily,
        fontSize: resume.content.design.fontSize === 'small' ? '14px' :
          resume.content.design.fontSize === 'large' ? '18px' : '16px'
      }}
    >
      {/* Header with gradient */}
      <div
        className="text-white p-8"
        style={{
          background: `linear-gradient(to right, ${resume.content.design.primaryColor}, ${resume.content.design.secondaryColor})`
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <EditableText
              value={resume.content.personalInfo.fullName || data.personalInfo.fullName}
              onChange={(value) => updatePersonalInfo('fullName', value)}
              className="text-4xl font-bold mb-2 text-white"
              placeholder="Your Name"
              tag="h1"
            />
            <EditableText
              value={resume.content.personalInfo.summary || "The role you are applying for?"}
              onChange={(value) => updatePersonalInfo('summary', value)}
              className="text-xl"
              style={{ color: resume.content.design.secondaryColor }}
              placeholder="Professional title"
              tag="p"
            />
          </div>
          <div
            className="w-32 h-32 bg-white bg-opacity-20 rounded-full flex items-center justify-center"
            style={{ backgroundColor: resume.content.design.secondaryColor + '20' }}
          >
            <div
              className="w-28 h-28 rounded-full"
              style={{ backgroundColor: resume.content.design.secondaryColor }}
            ></div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="flex items-center space-x-6 mt-6 text-sm">
          <div className="flex items-center space-x-2">
            <span>📞</span>
            <EditableText
              value={resume.content.personalInfo.phone || data.personalInfo.phone}
              onChange={(value) => updatePersonalInfo('phone', value)}
              className="text-white"
              placeholder="Phone"
            />
          </div>
          <div className="flex items-center space-x-2">
            <span>✉️</span>
            <EditableText
              value={resume.content.personalInfo.email || data.personalInfo.email}
              onChange={(value) => updatePersonalInfo('email', value)}
              className="text-white"
              placeholder="Email"
            />
          </div>
          <div className="flex items-center space-x-2">
            <span>🔗</span>
            <EditableText
              value={resume.content.personalInfo.website || data.personalInfo.website}
              onChange={(value) => updatePersonalInfo('website', value)}
              className="text-white"
              placeholder="Website"
            />
          </div>
          <div className="flex items-center space-x-2">
            <span>📍</span>
            <EditableText
              value={resume.content.personalInfo.location || data.personalInfo.location}
              onChange={(value) => updatePersonalInfo('location', value)}
              className="text-white"
              placeholder="Location"
            />
          </div>
        </div>
      </div>

      <div className="p-8">
        <div className="grid grid-cols-3 gap-8">
          {/* Left Column - Dynamic Sections */}
          <div className="col-span-2 space-y-8">
            {resume.content.sections
              .filter(section => section.visible && section.type !== 'skills')
              .sort((a, b) => a.order - b.order)
              .map((section) => (
                <SectionRenderer
                  key={section.id}
                  section={section}
                  onUpdate={updateSection}
                  design={resume.content.design}
                />
              ))}
          </div>

          {/* Right Column - Skills */}
          <div className="space-y-8">
            {resume.content.sections
              .filter(section => section.visible && section.type === 'skills')
              .map((section) => (
                <SectionRenderer
                  key={section.id}
                  section={section}
                  onUpdate={updateSection}
                  design={resume.content.design}
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernTemplate;