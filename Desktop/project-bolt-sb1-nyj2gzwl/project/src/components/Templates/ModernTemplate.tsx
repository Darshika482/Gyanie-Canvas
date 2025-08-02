import React from 'react';
import EditableText from '../Editor/EditableText';
import EditableList from '../Editor/EditableList';
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

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden max-w-4xl mx-auto">
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8">
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
              className="text-blue-100 text-xl"
              placeholder="Professional title"
              tag="p"
            />
          </div>
          <div className="w-32 h-32 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <div className="w-28 h-28 bg-gray-300 rounded-full"></div>
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
          {/* Left Column - Experience */}
          <div className="col-span-2 space-y-8">
            {/* Experience */}
            <section>
              <h2 className="text-2xl font-bold text-blue-600 mb-4 flex items-center">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white text-sm">💼</span>
                </div>
                EXPERIENCE
              </h2>
              <div className="space-y-6">
                {data.experience.map((job, index) => (
                  <div key={index} className="border-l-4 border-blue-200 pl-6">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <EditableText
                          value={job.position}
                          onChange={(value) => {}}
                          className="text-xl font-semibold text-gray-900"
                          placeholder="Position"
                          tag="h3"
                        />
                        <EditableText
                          value={job.company}
                          onChange={(value) => {}}
                          className="text-blue-600 font-medium"
                          placeholder="Company"
                          tag="p"
                        />
                      </div>
                      <div className="text-right text-sm">
                        <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                          <EditableText
                            value={job.startDate}
                            onChange={(value) => {}}
                            className="inline"
                            placeholder="Start"
                          />
                          {' - '}
                          <EditableText
                            value={job.current ? 'Present' : job.endDate}
                            onChange={(value) => {}}
                            className="inline"
                            placeholder="End"
                          />
                        </div>
                        <EditableText
                          value={job.location}
                          onChange={(value) => {}}
                          className="mt-1 text-gray-600"
                          placeholder="Location"
                          tag="p"
                        />
                      </div>
                    </div>
                    <EditableList
                      items={job.description}
                      onChange={(items) => {}}
                      placeholder="Add achievement"
                      className="text-sm text-gray-700"
                    />
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Skills */}
            <section>
              <h2 className="text-xl font-bold text-purple-600 mb-4 flex items-center">
                <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center mr-2">
                  <span className="text-white text-xs">⚡</span>
                </div>
                SKILLS
              </h2>
              <div className="space-y-4">
                {data.skills.map((skillGroup, index) => (
                  <div key={index}>
                    <EditableText
                      value={skillGroup.category}
                      onChange={(value) => {}}
                      className="font-semibold text-purple-600 mb-2"
                      placeholder="Category"
                      tag="h3"
                    />
                    <div className="flex flex-wrap gap-2">
                      {skillGroup.skills.map((skill, i) => (
                        <span key={i} className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">
                          <EditableText
                            value={skill}
                            onChange={(value) => {}}
                            className="text-purple-800"
                            placeholder="Skill"
                          />
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Education */}
            <section>
              <h2 className="text-xl font-bold text-green-600 mb-4 flex items-center">
                <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center mr-2">
                  <span className="text-white text-xs">🎓</span>
                </div>
                EDUCATION
              </h2>
              <div className="bg-green-50 p-4 rounded-lg">
                <EditableText
                  value="Bachelor of Science"
                  onChange={(value) => {}}
                  className="font-semibold text-gray-900"
                  placeholder="Degree"
                  tag="h3"
                />
                <EditableText
                  value="Computer Science"
                  onChange={(value) => {}}
                  className="text-green-600 font-medium"
                  placeholder="Field"
                  tag="p"
                />
                <EditableText
                  value="University of Technology"
                  onChange={(value) => {}}
                  className="text-gray-700"
                  placeholder="Institution"
                  tag="p"
                />
                <EditableText
                  value="2013 - 2017"
                  onChange={(value) => {}}
                  className="text-sm text-gray-600"
                  placeholder="Years"
                  tag="p"
                />
              </div>
            </section>

            {/* Languages */}
            <section>
              <h2 className="text-xl font-bold text-orange-600 mb-4 flex items-center">
                <div className="w-6 h-6 bg-orange-600 rounded-full flex items-center justify-center mr-2">
                  <span className="text-white text-xs">🌍</span>
                </div>
                LANGUAGES
              </h2>
              <div className="space-y-3">
                {data.languages.map((lang, index) => (
                  <div key={index} className="bg-orange-50 p-3 rounded">
                    <div className="flex justify-between items-center mb-1">
                      <EditableText
                        value={lang.language}
                        onChange={(value) => {}}
                        className="font-medium text-gray-900"
                        placeholder="Language"
                      />
                      <EditableText
                        value={lang.proficiency}
                        onChange={(value) => {}}
                        className="text-sm text-orange-600"
                        placeholder="Level"
                      />
                    </div>
                    <div className="flex space-x-1">
                      {Array.from({ length: 5 }, (_, i) => (
                        <div
                          key={i}
                          className={`w-3 h-3 rounded-full ${
                            i < lang.level ? 'bg-orange-500' : 'bg-orange-200'
                          }`}
                        ></div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernTemplate;