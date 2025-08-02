import React from 'react';
import EditableText from '../Editor/EditableText';
import EditableList from '../Editor/EditableList';
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

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden max-w-4xl mx-auto">
      <div className="p-8">
        {/* Header */}
        <div className="text-center mb-8 pb-6 border-b-2 border-gray-200">
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

        {/* Professional Summary */}
        <section className="mb-8">
          <EditableText
            value="PROFESSIONAL SUMMARY"
            onChange={(value) => { }}
            className="text-lg font-bold text-gray-900 mb-2 uppercase tracking-wide"
            placeholder="Section Title"
            tag="h2"
          />
          <EditableText
            value="Brief overview of professional background and key strengths"
            onChange={(value) => { }}
            className="text-sm text-gray-500 mb-3"
            placeholder="Section description"
            tag="p"
          />
          <EditableText
            value="Experienced professional with expertise in creating user-centered digital experiences and driving business growth through innovative solutions."
            onChange={(value) => updatePersonalInfo('summary', value)}
            className="text-gray-700 leading-relaxed"
            placeholder="Professional summary"
            multiline
            tag="p"
          />
        </section>

        {/* Experience */}
        <section className="mb-8">
          <EditableText
            value="PROFESSIONAL EXPERIENCE"
            onChange={(value) => { }}
            className="text-lg font-bold text-gray-900 mb-2 uppercase tracking-wide"
            placeholder="Section Title"
            tag="h2"
          />
          <EditableText
            value="Career progression and key achievements"
            onChange={(value) => { }}
            className="text-sm text-gray-500 mb-4"
            placeholder="Section description"
            tag="p"
          />

          <div className="space-y-6">
            {data.experience.map((job, index) => (
              <div key={index} className="border-l-4 border-blue-500 pl-4">
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
                      className="text-blue-600 font-medium"
                      placeholder="Company Name"
                      tag="p"
                    />
                  </div>
                  <div className="text-right text-sm text-gray-600">
                    <p>
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
                  className="text-sm text-gray-700"
                />
              </div>
            ))}
          </div>
        </section>

        {/* Education */}
        <section className="mb-8">
          <EditableText
            value="EDUCATION"
            onChange={(value) => { }}
            className="text-lg font-bold text-gray-900 mb-2 uppercase tracking-wide"
            placeholder="Section Title"
            tag="h2"
          />
          <EditableText
            value="Academic background and qualifications"
            onChange={(value) => { }}
            className="text-sm text-gray-500 mb-4"
            placeholder="Section description"
            tag="p"
          />

          <div className="border-l-4 border-green-500 pl-4">
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
              className="text-green-600 font-medium"
              placeholder="Institution"
              tag="p"
            />
            <EditableText
              value="2013 - 2017"
              onChange={(value) => { }}
              className="text-sm text-gray-600"
              placeholder="Years"
              tag="p"
            />
          </div>
        </section>

        {/* Skills */}
        <section>
          <EditableText
            value="CORE COMPETENCIES"
            onChange={(value) => { }}
            className="text-lg font-bold text-gray-900 mb-2 uppercase tracking-wide"
            placeholder="Section Title"
            tag="h2"
          />
          <EditableText
            value="Technical and professional skills"
            onChange={(value) => { }}
            className="text-sm text-gray-500 mb-4"
            placeholder="Section description"
            tag="p"
          />

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

export default SingleColumnTemplate;