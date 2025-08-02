import React from 'react';
import EditableText from '../Editor/EditableText';
import EditableList from '../Editor/EditableList';
import { Resume } from '../../types';
import { useResumeStore } from '../../store/resumeStore';
import { sampleResumeData } from '../../data/defaultContent';

interface IvyLeagueTemplateProps {
  resume: Resume;
}

const IvyLeagueTemplate: React.FC<IvyLeagueTemplateProps> = ({ resume }) => {
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

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden max-w-4xl mx-auto">
      <div className="p-12">
        {/* Header */}
        <div className="text-center mb-8 border-b-2 border-gray-800 pb-6">
          <EditableText
            value={resume.content.personalInfo.fullName || data.personalInfo.fullName}
            onChange={(value) => updatePersonalInfo('fullName', value)}
            className="text-3xl font-bold text-gray-900 mb-2 tracking-wide"
            placeholder="Your Full Name"
            tag="h1"
          />
          <div className="flex justify-center items-center space-x-4 text-sm text-gray-600">
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

        {/* Professional Summary */}
        <section className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-3 uppercase tracking-wide border-b border-gray-300 pb-1">
            Professional Summary
          </h2>
          <EditableText
            value={resume.content.personalInfo.summary || "Experienced professional with expertise in..."}
            onChange={(value) => updatePersonalInfo('summary', value)}
            className="text-gray-700 leading-relaxed"
            placeholder="Professional summary"
            multiline
            tag="p"
          />
        </section>

        {/* Experience */}
        <section className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4 uppercase tracking-wide border-b border-gray-300 pb-1">
            Professional Experience
          </h2>
          <div className="space-y-6">
            {data.experience.map((job, index) => (
              <div key={index}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <EditableText
                      value={job.position}
                      onChange={(value) => { }}
                      className="text-lg font-semibold text-gray-900"
                      placeholder="Job Title"
                      tag="h3"
                    />
                    <EditableText
                      value={job.company}
                      onChange={(value) => { }}
                      className="text-gray-700 font-medium italic"
                      placeholder="Company Name"
                      tag="p"
                    />
                  </div>
                  <div className="text-right text-sm text-gray-600">
                    <p className="font-medium">
                      <EditableText
                        value={job.startDate}
                        onChange={(value) => { }}
                        className="inline"
                        placeholder="Start"
                      />
                      {' - '}
                      <EditableText
                        value={job.current ? 'Present' : job.endDate}
                        onChange={(value) => { }}
                        className="inline"
                        placeholder="End"
                      />
                    </p>
                    <EditableText
                      value={job.location}
                      onChange={(value) => { }}
                      className="mt-1"
                      placeholder="Location"
                      tag="p"
                    />
                  </div>
                </div>
                <EditableList
                  items={job.description}
                  onChange={(items) => { }}
                  placeholder="Add achievement or responsibility"
                  className="text-sm text-gray-700 ml-6"
                />
              </div>
            ))}
          </div>
        </section>

        {/* Education */}
        <section className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4 uppercase tracking-wide border-b border-gray-300 pb-1">
            Education
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <EditableText
                  value="Bachelor of Science in Computer Science"
                  onChange={(value) => { }}
                  className="text-lg font-semibold text-gray-900"
                  placeholder="Degree"
                  tag="h3"
                />
                <EditableText
                  value="University of Technology"
                  onChange={(value) => { }}
                  className="text-gray-700 font-medium italic"
                  placeholder="Institution"
                  tag="p"
                />
              </div>
              <div className="text-right text-sm text-gray-600">
                <EditableText
                  value="2013 - 2017"
                  onChange={(value) => { }}
                  className="font-medium"
                  placeholder="Years"
                  tag="p"
                />
                <EditableText
                  value="GPA: 3.8/4.0"
                  onChange={(value) => { }}
                  className="mt-1"
                  placeholder="GPA (optional)"
                  tag="p"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Skills */}
        <section className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4 uppercase tracking-wide border-b border-gray-300 pb-1">
            Core Competencies
          </h2>
          <div className="grid grid-cols-2 gap-6">
            {data.skills.map((skillGroup, index) => (
              <div key={index}>
                <EditableText
                  value={skillGroup.category}
                  onChange={(value) => { }}
                  className="font-semibold text-gray-900 mb-2"
                  placeholder="Skill Category"
                  tag="h3"
                />
                <div className="text-sm text-gray-700">
                  {skillGroup.skills.join(' • ')}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default IvyLeagueTemplate;