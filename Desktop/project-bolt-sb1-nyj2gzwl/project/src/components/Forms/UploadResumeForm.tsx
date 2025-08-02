import React, { useState, useCallback } from 'react';
import { Upload, File, CheckCircle, AlertCircle } from 'lucide-react';

interface UploadResumeFormProps {
  onClose: () => void;
}

const UploadResumeForm: React.FC<UploadResumeFormProps> = ({ onClose }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'application/pdf' || file.type.includes('word')) {
        setUploadedFile(file);
      }
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
    }
  };

  const handleProcess = async () => {
    if (!uploadedFile) return;

    setIsProcessing(true);
    setProgress(0);

    // Simulate file processing
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsProcessing(false);
            onClose();
            // Navigate to editor with processed content
          }, 500);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive
            ? 'border-teal-400 bg-teal-50'
            : uploadedFile
            ? 'border-green-300 bg-green-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {uploadedFile ? (
          <div className="space-y-4">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
            <div>
              <p className="text-lg font-medium text-green-700">File uploaded successfully!</p>
              <p className="text-sm text-green-600">{uploadedFile.name}</p>
              <p className="text-xs text-gray-500 mt-1">
                {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <Upload className="w-12 h-12 text-gray-400 mx-auto" />
            <div>
              <p className="text-lg font-medium text-gray-700">
                Drop your resume here, or{' '}
                <label className="text-teal-600 hover:text-teal-700 cursor-pointer underline">
                  browse
                  <input
                    type="file"
                    className="sr-only"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileInput}
                  />
                </label>
              </p>
              <p className="text-sm text-gray-500">Supports PDF, DOC, DOCX up to 10MB</p>
            </div>
          </div>
        )}
      </div>

      {/* Processing */}
      {isProcessing && (
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-teal-500"></div>
            <span className="text-sm font-medium text-gray-700">Processing your resume...</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-teal-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500">
            We're extracting and formatting your resume content
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="text-sm text-gray-500">
          {uploadedFile ? (
            <div className="flex items-center space-x-2">
              <File className="w-4 h-4" />
              <span>Ready to process</span>
            </div>
          ) : (
            'Upload a file to continue'
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
            onClick={handleProcess}
            disabled={!uploadedFile || isProcessing}
            className="px-6 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {isProcessing ? 'Processing...' : 'Continue'}
          </button>
        </div>
      </div>

      {/* Features */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-2">What happens next?</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• We'll extract your content and preserve formatting</li>
          <li>• You can edit and improve your resume with our AI suggestions</li>
          <li>• Choose from 9 professional templates</li>
          <li>• Download in multiple formats (PDF, Word, etc.)</li>
        </ul>
      </div>
    </div>
  );
};

export default UploadResumeForm;