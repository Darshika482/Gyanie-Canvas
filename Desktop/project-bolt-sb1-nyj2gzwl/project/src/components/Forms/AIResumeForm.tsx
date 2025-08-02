import React, { useState } from 'react';
import { Sparkles, ChevronDown, Loader } from 'lucide-react';
import { AIResumeData } from '../../types';
import { useResumeStore } from '../../store/resumeStore';
import { useNavigate } from 'react-router-dom';

interface AIResumeFormProps {
  onClose: () => void;
}

const AIResumeForm: React.FC<AIResumeFormProps> = ({ onClose }) => {
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState<AIResumeData>({
    fullName: '',
    jobTitle: '',
    yearsExperience: 1,
    skills: [],
    location: '',
    industry: '',
  });
  const [customSkill, setCustomSkill] = useState('');
  const [showCustomSkillInput, setShowCustomSkillInput] = useState(false);

  const { createResume } = useResumeStore();
  const navigate = useNavigate();

  const industries = [
    'Technology', 'Healthcare', 'Finance', 'Education', 'Marketing',
    'Sales', 'Human Resources', 'Operations', 'Engineering', 'Design',
    'Consulting', 'Legal', 'Real Estate', 'Retail', 'Manufacturing',
    'Media', 'Non-Profit', 'Government', 'Hospitality', 'Transportation'
  ];

  const commonSkills = [
    'JavaScript', 'Python', 'React', 'Node.js', 'SQL', 'AWS',
    'Project Management', 'Leadership', 'Communication', 'Problem Solving',
    'Data Analysis', 'Marketing', 'Sales', 'Customer Service', 'Design',
    'Writing', 'Research', 'Strategy', 'Team Management', 'Agile'
  ];

  const handleInputChange = (field: keyof AIResumeData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSkillToggle = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const handleAddCustomSkill = () => {
    if (customSkill.trim() && !formData.skills.includes(customSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, customSkill.trim()]
      }));
      setCustomSkill('');
      setShowCustomSkillInput(false);
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);

    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Create resume with AI-generated content
    const resume = createResume(
      `${formData.jobTitle} Resume`,
      'single-column',
      {
        personalInfo: {
          fullName: formData.fullName,
          email: '',
          phone: '',
          location: formData.location,
          summary: `Experienced ${formData.jobTitle} with ${formData.yearsExperience}+ years in ${formData.industry}`,
        },
      }
    );

    setIsGenerating(false);
    onClose();
    navigate(`/editor/${resume.id}`);
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.fullName && formData.jobTitle;
      case 2:
        return formData.yearsExperience && formData.industry;
      case 3:
        return formData.skills.length > 0;
      default:
        return false;
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="flex items-center space-x-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${i <= step
                ? 'bg-teal-500 text-white'
                : 'bg-gray-200 text-gray-500'
                }`}
            >
              {i}
            </div>
            {i < 3 && (
              <div
                className={`w-12 h-0.5 ${i < step ? 'bg-teal-500' : 'bg-gray-200'
                  }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      {step === 1 && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Basic Information</h3>
            <p className="text-sm text-gray-500">Let's start with your basic details</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                placeholder="John Doe"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Title *
              </label>
              <input
                type="text"
                value={formData.jobTitle}
                onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                placeholder="Software Engineer"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location (Optional)
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="New York, NY"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Experience & Industry</h3>
            <p className="text-sm text-gray-500">Help us understand your background</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Years of Experience
              </label>
              <div className="relative">
                <select
                  value={formData.yearsExperience}
                  onChange={(e) => handleInputChange('yearsExperience', parseInt(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none appearance-none"
                >
                  {Array.from({ length: 20 }, (_, i) => i + 1).map(year => (
                    <option key={year} value={year}>
                      {year} {year === 1 ? 'year' : 'years'}
                    </option>
                  ))}
                  <option value={21}>20+ years</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Industry
              </label>
              <div className="relative">
                <select
                  value={formData.industry}
                  onChange={(e) => handleInputChange('industry', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none appearance-none"
                >
                  <option value="">Select an industry</option>
                  {industries.map(industry => (
                    <option key={industry} value={industry}>{industry}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Skills</h3>
            <p className="text-sm text-gray-500">Select your key skills (choose at least 3)</p>
          </div>

          {/* Selected Skills Display */}
          {formData.skills.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Skills:</h4>
              <div className="flex flex-wrap gap-2">
                {formData.skills.map(skill => (
                  <div
                    key={skill}
                    className="flex items-center space-x-1 bg-teal-50 border border-teal-200 rounded-md px-3 py-1"
                  >
                    <span className="text-sm text-teal-700">{skill}</span>
                    <button
                      onClick={() => handleRemoveSkill(skill)}
                      className="text-teal-500 hover:text-teal-700 text-xs font-bold"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add Custom Skill */}
          <div className="space-y-3">
            <button
              onClick={() => setShowCustomSkillInput(!showCustomSkillInput)}
              className="flex items-center space-x-2 text-teal-600 hover:text-teal-700 text-sm font-medium"
            >
              <span>+</span>
              <span>Add Custom Skill</span>
            </button>

            {showCustomSkillInput && (
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={customSkill}
                  onChange={(e) => setCustomSkill(e.target.value)}
                  placeholder="Enter your skill"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleAddCustomSkill();
                    }
                  }}
                />
                <button
                  onClick={handleAddCustomSkill}
                  disabled={!customSkill.trim()}
                  className="px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm"
                >
                  Add
                </button>
              </div>
            )}
          </div>

          {/* Common Skills Grid */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Common Skills:</h4>
            <div className="grid grid-cols-2 gap-2">
              {commonSkills.map(skill => (
                <button
                  key={skill}
                  onClick={() => handleSkillToggle(skill)}
                  className={`px-3 py-2 text-sm rounded-md border transition-colors ${formData.skills.includes(skill)
                    ? 'bg-teal-50 border-teal-300 text-teal-700'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>

          <div className="text-sm text-gray-500">
            Selected: {formData.skills.length} skills
          </div>
        </div>
      )}

      {/* Generating State */}
      {isGenerating && (
        <div className="text-center py-8">
          <div className="inline-flex items-center space-x-3">
            <Loader className="w-6 h-6 animate-spin text-teal-500" />
            <div>
              <p className="text-lg font-medium text-gray-900">Generating your resume...</p>
              <p className="text-sm text-gray-500">AI is creating personalized content for you</p>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      {!isGenerating && (
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="text-sm text-gray-500">
            Step {step} of 3
          </div>

          <div className="flex items-center space-x-3">
            {step > 1 && (
              <button
                onClick={handleBack}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
            )}
            <button
              onClick={step === 3 ? handleGenerate : handleNext}
              disabled={!isStepValid()}
              className="px-6 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              {step === 3 ? (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Resume</span>
                </>
              ) : (
                <span>Next</span>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIResumeForm;