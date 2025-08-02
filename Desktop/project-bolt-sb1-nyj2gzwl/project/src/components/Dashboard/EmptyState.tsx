import React from 'react';
import { FileText, Plus } from 'lucide-react';

interface EmptyStateProps {
  onCreateResume: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onCreateResume }) => {
  return (
    <div className="text-center py-16">
      <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
        <FileText className="w-12 h-12 text-gray-400" />
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-2">No resumes yet</h3>
      <p className="text-gray-500 mb-8 max-w-md mx-auto">
        Get started by creating your first professional resume. Choose from our collection of 
        ATS-friendly templates and build something amazing.
      </p>
      
      <div className="space-y-4">
        <button
          onClick={onCreateResume}
          className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-3 rounded-lg font-medium transition-colors inline-flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Create Your First Resume</span>
        </button>
        
        <div className="flex items-center justify-center space-x-8 text-sm text-gray-500">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
            <span>ATS-friendly templates</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
            <span>AI-powered suggestions</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
            <span>Multiple export formats</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmptyState;