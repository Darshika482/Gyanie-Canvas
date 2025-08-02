import React, { useState } from 'react';
import { MoreVertical, Download, Copy, Trash2, Edit, Eye } from 'lucide-react';
import { Resume } from '../../types';
import { useResumeStore } from '../../store/resumeStore';
import { formatRelativeTime } from '../../utils/helpers';
import { useNavigate } from 'react-router-dom';
import { downloadResume } from '../../utils/pdfExport';

interface ResumeCardProps {
  resume: Resume;
  viewMode: 'grid' | 'list';
}

const ResumeCard: React.FC<ResumeCardProps> = ({ resume, viewMode }) => {
  const { deleteResume, duplicateResume } = useResumeStore();
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`/editor/${resume.id}`);
  };

  const handleDuplicate = () => {
    duplicateResume(resume.id);
    setShowDropdown(false);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this resume?')) {
      deleteResume(resume.id);
    }
    setShowDropdown(false);
  };

  const handleDownload = () => {
    // For dashboard download, we need to get the resume element from the editor
    // This is a simplified version - in a real app, you'd navigate to editor first
    alert('Please open the resume in the editor to download it.');
    setShowDropdown(false);
  };

  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-16 bg-gray-100 rounded border overflow-hidden">
              <img
                src={resume.thumbnail}
                alt={resume.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{resume.title}</h3>
              <p className="text-sm text-gray-500">
                Modified {formatRelativeTime(resume.lastModified)}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleEdit}
              className="p-2 text-gray-500 hover:text-teal-600 hover:bg-teal-50 rounded-md transition-colors"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={handleDownload}
              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
            >
              <Download className="w-4 h-4" />
            </button>
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
              >
                <MoreVertical className="w-4 h-4" />
              </button>
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                  <button
                    onClick={handleDuplicate}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                  >
                    <Copy className="w-4 h-4" />
                    <span>Duplicate</span>
                  </button>
                  <button
                    onClick={handleDelete}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
      {/* Thumbnail */}
      <div className="aspect-[3/4] bg-gray-100 overflow-hidden">
        <img
          src={resume.thumbnail}
          alt={resume.title}
          className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
          onClick={handleEdit}
        />
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 truncate mb-1">{resume.title}</h3>
        <p className="text-sm text-gray-500 mb-3">
          Modified {formatRelativeTime(resume.lastModified)}
        </p>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={handleEdit}
              className="p-1.5 text-teal-600 hover:bg-teal-50 rounded-md transition-colors"
              title="Edit"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={handleDownload}
              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
              title="Download"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={handleDuplicate}
              className="p-1.5 text-gray-600 hover:bg-gray-50 rounded-md transition-colors"
              title="Duplicate"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>

          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-md transition-colors"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                <button
                  onClick={() => console.log('View resume')}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                >
                  <Eye className="w-4 h-4" />
                  <span>Preview</span>
                </button>
                <button
                  onClick={handleDelete}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeCard;