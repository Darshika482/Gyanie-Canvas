import React from 'react';
import EditableText from '../Editor/EditableText';
import EditableList from '../Editor/EditableList';
import SectionRenderer from '../Editor/SectionRenderer';
import { Resume } from '../../types';
import { useResumeStore } from '../../store/resumeStore';
import { sampleResumeData } from '../../data/defaultContent';

interface SingleColumnTemplateProps {
  resume: Resume;
}

const SingleColumnTemplate: React.FC<SingleColumnTemplateProps> = ({ resume }) => {
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

  return (
    <div
      className="bg-white shadow-lg rounded-lg overflow-hidden max-w-4xl mx-auto"
      style={{
        fontFamily: resume.content.design.fontFamily,
        fontSize: resume.content.design.fontSize === 'small' ? '14px' :
          resume.content.design.fontSize === 'large' ? '18px' : '16px'
      }}
    >
      <div className="p-8">
        {/* Header */}
        <div
          className="text-center mb-8 pb-6 border-b-2"
          style={{ borderColor: resume.content.design.primaryColor || '#2c3e50' }}
        >
          <EditableText
            value={resume.content.personalInfo.fullName || data.personalInfo.fullName}
            onChange={(value) => updatePersonalInfo('fullName', value)}
            className="text-3xl font-bold text-gray-900 mb-2"
            placeholder="Your Full Name"
            tag="h1"
          />
          <EditableText
            value={resume.content.personalInfo.summary || "Professional Title"}
            onChange={(value) => updatePersonalInfo('summary', value)}
            className="text-lg text-gray-600 mb-4"
            placeholder="Professional title"
            tag="p"
          />

          {/* Contact Info */}
          <div className="flex justify-center items-center space-x-6 text-sm text-gray-600">
            <EditableText
              value={resume.content.personalInfo.phone || data.personalInfo.phone}
              onChange={(value) => updatePersonalInfo('phone', value)}
              className="text-gray-600"
              placeholder="Phone"
            />
            <span>•</span>
            <EditableText
              value={resume.content.personalInfo.email || data.personalInfo.email}
              onChange={(value) => updatePersonalInfo('email', value)}
              className="text-gray-600"
              placeholder="Email"
            />
            <span>•</span>
            <EditableText
              value={resume.content.personalInfo.location || data.personalInfo.location}
              onChange={(value) => updatePersonalInfo('location', value)}
              className="text-gray-600"
              placeholder="Location"
            />
          </div>
        </div>

        {/* Dynamic Sections */}
        {resume.content.sections
          .filter(section => section.visible)
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
    </div>
  );
};

export default SingleColumnTemplate;