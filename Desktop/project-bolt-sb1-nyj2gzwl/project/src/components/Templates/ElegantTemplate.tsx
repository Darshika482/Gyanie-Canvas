import React from 'react';
import EditableText from '../Editor/EditableText';
import EditableList from '../Editor/EditableList';
import { Resume } from '../../types';
import { useResumeStore } from '../../store/resumeStore';
import { sampleResumeData } from '../../data/defaultContent';

interface ElegantTemplateProps {
  resume: Resume;
}

const ElegantTemplate: React.FC<ElegantTemplateProps> = ({ resume }) => {
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
      <div className="flex">
        {/* Left Sidebar */}
        <div
          className="w-1/3 text-white p-6"
          style={{ backgroundColor: resume.content.design.primaryColor }}
        >
          {/* Profile Photo */}
          <div
            className="w-32 h-32 rounded-full mx-auto mb-6 flex items-center justify-center"
            style={{ backgroundColor: resume.content.design.secondaryColor || resume.content.design.primaryColor }}
          >
            <div
              className="w-28 h-28 rounded-full"
              style={{ backgroundColor: resume.content.design.secondaryColor || resume.content.design.primaryColor }}
            ></div>
          </div>

          {/* Contact */}
          <div className="mb-8">
            <h3
              className="text-lg font-bold mb-4 pb-2"
              style={{ borderBottom: `2px solid ${resume.content.design.secondaryColor || resume.content.design.primaryColor}` }}
            >
              CONTACT
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-2">
                <span>📞</span>
                <EditableText
                  value={resume.content.personalInfo.phone || data.personalInfo.phone}
                  onChange={(value) => updatePersonalInfo('phone', value)}
                  className=""
                  style={{ color: `${resume.content.design.secondaryColor || resume.content.design.primaryColor}80` }}
                  placeholder="Phone"
                />
              </div>
              <div className="flex items-center space-x-2">
                <span>✉️</span>
                <EditableText
                  value={resume.content.personalInfo.email || data.personalInfo.email}
                  onChange={(value) => updatePersonalInfo('email', value)}
                  className=""
                  style={{ color: `${resume.content.design.secondaryColor || resume.content.design.primaryColor}80` }}
                  placeholder="Email"
                />
              </div>
              <div className="flex items-center space-x-2">
                <span>🌐</span>
                <EditableText
                  value={resume.content.personalInfo.website || data.personalInfo.website}
                  onChange={(value) => updatePersonalInfo('website', value)}
                  className=""
                  style={{ color: `${resume.content.design.secondaryColor || resume.content.design.primaryColor}80` }}
                  placeholder="Website"
                />
              </div>
              <div className="flex items-center space-x-2">
                <span>📍</span>
                <EditableText
                  value={resume.content.personalInfo.location || data.personalInfo.location}
                  onChange={(value) => updatePersonalInfo('location', value)}
                  className=""
                  style={{ color: `${resume.content.design.secondaryColor || resume.content.design.primaryColor}80` }}
                  placeholder="Location"
                />
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="mb-8">
            <h3
              className="text-lg font-bold mb-4 pb-2"
              style={{ borderBottom: `2px solid ${resume.content.design.secondaryColor || resume.content.design.primaryColor}` }}
            >
              SKILLS
            </h3>
            <div className="space-y-4">
              {data.skills.map((skillGroup, index) => (
                <div key={index}>
                  <EditableText
                    value={skillGroup.category}
                    onChange={(value) => { }}
                    className="font-semibold text-white mb-2"
                    placeholder="Category"
                    tag="h3"
                  />
                  <div className="space-y-1">
                    {skillGroup.skills.map((skill, i) => (
                      <div key={i} className="text-sm">
                        • <EditableText
                          value={skill}
                          onChange={(value) => { }}
                          className="inline"
                          style={{ color: `${resume.content.design.secondaryColor || resume.content.design.primaryColor}80` }}
                          placeholder="Skill"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Training */}
          <div className="mb-8">
            <h3
              className="text-lg font-bold mb-4 pb-2"
              style={{ borderBottom: `2px solid ${resume.content.design.secondaryColor || resume.content.design.primaryColor}` }}
            >
              TRAINING
            </h3>
            <div className="space-y-4">
              {data.training.map((course, index) => (
                <div key={index}>
                  <EditableText
                    value={course.course}
                    onChange={(value) => { }}
                    className="font-semibold text-white text-sm"
                    placeholder="Course"
                    tag="h3"
                  />
                  <EditableText
                    value={course.provider}
                    onChange={(value) => { }}
                    className="text-xs"
                    style={{ color: `${resume.content.design.secondaryColor || resume.content.design.primaryColor}80` }}
                    placeholder="Provider"
                    tag="p"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Languages */}
          <div>
            <h3
              className="text-lg font-bold mb-4 pb-2"
              style={{ borderBottom: `2px solid ${resume.content.design.secondaryColor || resume.content.design.primaryColor}` }}
            >
              LANGUAGES
            </h3>
            <div className="space-y-3">
              {data.languages.map((lang, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-1">
                    <EditableText
                      value={lang.language}
                      onChange={(value) => { }}
                      className="font-medium text-white text-sm"
                      placeholder="Language"
                    />
                    <EditableText
                      value={lang.proficiency}
                      onChange={(value) => { }}
                      className="text-xs"
                      style={{ color: `${resume.content.design.secondaryColor || resume.content.design.primaryColor}80` }}
                      placeholder="Level"
                    />
                  </div>
                  <div className="flex space-x-1">
                    {Array.from({ length: 5 }, (_, i) => (
                      <div
                        key={i}
                        className={`w-2 h-2 rounded-full ${i < lang.level ? 'bg-white' : ''}`}
                        style={{
                          backgroundColor: i < lang.level ? 'white' : `${resume.content.design.secondaryColor || resume.content.design.primaryColor}40`
                        }}
                      ></div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Content */}
        <div className="flex-1 p-8">
          {/* Header */}
          <div className="mb-8">
            <EditableText
              value={resume.content.personalInfo.fullName || data.personalInfo.fullName}
              onChange={(value) => updatePersonalInfo('fullName', value)}
              className="text-4xl font-light text-gray-900 mb-2"
              placeholder="Your Name"
              tag="h1"
            />
            <EditableText
              value={resume.content.personalInfo.summary || "Professional Title"}
              onChange={(value) => updatePersonalInfo('summary', value)}
              className="text-xl font-light"
              style={{ color: resume.content.design.primaryColor }}
              placeholder="Professional title"
              tag="p"
            />
          </div>

          {/* Experience */}
          <section className="mb-8">
            <h2 className="text-2xl font-light text-gray-900 mb-4 border-b border-gray-200 pb-2">
              Experience
            </h2>
            <div className="space-y-6">
              {data.experience.map((job, index) => (
                <div key={index}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <EditableText
                        value={job.position}
                        onChange={(value) => { }}
                        className="text-xl font-medium text-gray-900"
                        placeholder="Position"
                        tag="h3"
                      />
                      <EditableText
                        value={job.company}
                        onChange={(value) => { }}
                        className="text-lg"
                        style={{ color: resume.content.design.primaryColor }}
                        placeholder="Company"
                        tag="p"
                      />
                    </div>
                    <div className="text-right text-sm text-gray-600">
                      <p className="bg-gray-100 px-3 py-1 rounded">
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
                    placeholder="Add responsibility"
                    className="text-sm text-gray-700"
                  />
                </div>
              ))}
            </div>
          </section>

          {/* Education */}
          <section>
            <h2 className="text-2xl font-light text-gray-900 mb-4 border-b border-gray-200 pb-2">
              Education
            </h2>
            <div>
              <EditableText
                value="Bachelor of Science in Computer Science"
                onChange={(value) => { }}
                className="text-lg font-medium text-gray-900"
                placeholder="Degree"
                tag="h3"
              />
              <EditableText
                value="University of Technology"
                onChange={(value) => { }}
                className=""
                style={{ color: resume.content.design.primaryColor }}
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
        </div>
      </div>
    </div>
  );
};

export default ElegantTemplate;