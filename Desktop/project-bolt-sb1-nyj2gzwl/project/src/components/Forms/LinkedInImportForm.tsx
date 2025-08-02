import React, { useState } from 'react';
import { Link, CheckCircle, AlertCircle, User } from 'lucide-react';

interface LinkedInImportFormProps {
  onClose: () => void;
}

const LinkedInImportForm: React.FC<LinkedInImportFormProps> = ({ onClose }) => {
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');

  const validateLinkedInUrl = (url: string): boolean => {
    const linkedinRegex = /^https:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+\/?$/;
    return linkedinRegex.test(url);
  };

  const handleImport = async () => {
    if (!linkedinUrl) {
      setError('Please enter your LinkedIn profile URL');
      return;
    }

    if (!validateLinkedInUrl(linkedinUrl)) {
      setError('Please enter a valid LinkedIn profile URL');
      return;
    }

    setError('');
    setIsImporting(true);
    setProgress(0);

    // Simulate LinkedIn import process
    const steps = [
      'Connecting to LinkedIn...',
      'Fetching profile data...',
      'Extracting experience...',
      'Processing education...',
      'Importing skills...',
      'Creating resume...'
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setProgress(((i + 1) / steps.length) * 100);
    }

    setTimeout(() => {
      setIsImporting(false);
      onClose();
      // Navigate to editor with imported content
    }, 500);
  };

  return (
    <div className="space-y-6">
      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Link className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900">Import from LinkedIn</h4>
            <p className="text-sm text-blue-700 mt-1">
              We'll automatically import your profile information, work experience, education, and skills.
            </p>
          </div>
        </div>
      </div>

      {/* URL Input */}
      <div className="space-y-4">
        <div>
          <label htmlFor="linkedin-url" className="block text-sm font-medium text-gray-700 mb-2">
            LinkedIn Profile URL
          </label>
          <div className="relative">
            <input
              id="linkedin-url"
              type="url"
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
              placeholder="https://www.linkedin.com/in/your-profile"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none ${
                error ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            <Link className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
          {error && (
            <div className="flex items-center space-x-2 mt-2 text-red-600">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">{error}</span>
            </div>
          )}
        </div>

        {/* Example */}
        <div className="text-sm text-gray-500">
          <p className="font-medium mb-1">Example:</p>
          <code className="bg-gray-100 px-2 py-1 rounded text-xs">
            https://www.linkedin.com/in/john-doe-123456
          </code>
        </div>
      </div>

      {/* Processing */}
      {isImporting && (
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-teal-500"></div>
            <span className="text-sm font-medium text-gray-700">Importing from LinkedIn...</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-teal-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500">
            This may take a few moments while we fetch your profile data
          </p>
        </div>
      )}

      {/* Preview */}
      {linkedinUrl && validateLinkedInUrl(linkedinUrl) && !isImporting && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-3 flex items-center space-x-2">
            <User className="w-4 h-4" />
            <span>Preview Import</span>
          </h4>
          <div className="text-sm text-gray-600 space-y-2">
            <div className="flex justify-between">
              <span>Profile Information:</span>
              <CheckCircle className="w-4 h-4 text-green-500" />
            </div>
            <div className="flex justify-between">
              <span>Work Experience:</span>
              <CheckCircle className="w-4 h-4 text-green-500" />
            </div>
            <div className="flex justify-between">
              <span>Education:</span>
              <CheckCircle className="w-4 h-4 text-green-500" />
            </div>
            <div className="flex justify-between">
              <span>Skills:</span>
              <CheckCircle className="w-4 h-4 text-green-500" />
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="text-sm text-gray-500">
          {linkedinUrl && validateLinkedInUrl(linkedinUrl) ? (
            <div className="flex items-center space-x-2 text-green-600">
              <CheckCircle className="w-4 h-4" />
              <span>Valid LinkedIn URL</span>
            </div>
          ) : (
            'Enter your LinkedIn profile URL to continue'
          )}
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleImport}
            disabled={!linkedinUrl || !validateLinkedInUrl(linkedinUrl) || isImporting}
            className="px-6 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {isImporting ? 'Importing...' : 'Import Profile'}
          </button>
        </div>
      </div>

      {/* Privacy Note */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-amber-900">Privacy & Data</h4>
            <p className="text-sm text-amber-700 mt-1">
              We only import publicly available information from your LinkedIn profile. 
              Your data is stored securely and never shared with third parties.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LinkedInImportForm;