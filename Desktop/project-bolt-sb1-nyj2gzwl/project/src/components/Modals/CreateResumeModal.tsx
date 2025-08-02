import React, { useState } from 'react';
import { X, Upload, Link, Sparkles } from 'lucide-react';
import { CreateResumeMethod } from '../../types';
import UploadResumeForm from '../Forms/UploadResumeForm';
import LinkedInImportForm from '../Forms/LinkedInImportForm';
import AIResumeForm from '../Forms/AIResumeForm';

interface CreateResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateResumeModal: React.FC<CreateResumeModalProps> = ({ isOpen, onClose }) => {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

  const methods: CreateResumeMethod[] = [
    {
      id: 'upload',
      title: 'Upload Resume',
      description: 'Upload your existing resume (PDF/DOCX) and we\'ll help you improve it',
      icon: 'upload',
    },
    {
      id: 'linkedin',
      title: 'Import from LinkedIn',
      description: 'Import your profile information directly from LinkedIn',
      icon: 'link',
    },
    {
      id: 'ai',
      title: 'AI-Powered Creation',
      description: 'Answer a few questions and let AI create a professional resume for you',
      icon: 'ai',
    },
  ];

  const getIcon = (iconType: string) => {
    switch (iconType) {
      case 'upload':
        return Upload;
      case 'link':
        return Link;
      case 'ai':
        return Sparkles;
      default:
        return Upload;
    }
  };

  const handleBack = () => {
    setSelectedMethod(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {selectedMethod ? 'Create Resume' : 'How would you like to start?'}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {selectedMethod 
                ? 'Fill in the details below to create your resume'
                : 'Choose one of the methods below to get started'
              }
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {!selectedMethod ? (
            <div className="grid gap-4">
              {methods.map((method) => {
                const Icon = getIcon(method.icon);
                return (
                  <button
                    key={method.id}
                    onClick={() => setSelectedMethod(method.id)}
                    className="p-6 border-2 border-gray-200 rounded-lg hover:border-teal-300 hover:bg-teal-50 transition-colors text-left"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                        <Icon className="w-6 h-6 text-teal-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{method.title}</h3>
                        <p className="text-sm text-gray-500">{method.description}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div>
              {/* Back button */}
              <button
                onClick={handleBack}
                className="flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to methods
              </button>

              {/* Forms */}
              {selectedMethod === 'upload' && (
                <UploadResumeForm onClose={onClose} />
              )}
              {selectedMethod === 'linkedin' && (
                <LinkedInImportForm onClose={onClose} />
              )}
              {selectedMethod === 'ai' && (
                <AIResumeForm onClose={onClose} />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateResumeModal;