import React, { useState } from 'react';
import { Plus, Search, Filter, Grid, List } from 'lucide-react';
import ResumeCard from './ResumeCard';
import EmptyState from './EmptyState';
import CreateResumeModal from '../Modals/CreateResumeModal';
import { useResumeStore } from '../../store/resumeStore';

const Dashboard: React.FC = () => {
  const {
    searchQuery,
    setSearchQuery,
    filterBy,
    setFilterBy,
    getFilteredResumes,
  } = useResumeStore();

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const filteredResumes = getFilteredResumes();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Resumes</h1>
          <p className="text-gray-600">Create, manage, and share your professional resumes</p>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search resumes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none w-64"
              />
            </div>

            {/* Filter */}
            <div className="relative">
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value as any)}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
              >
                <option value="all">All Resumes</option>
                <option value="recent">Recent</option>
                <option value="template">By Template</option>
              </select>
              <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* View mode toggle */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'list'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* Create new resume button */}
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Create New Resume</span>
            </button>
          </div>
        </div>

        {/* Content */}
        {filteredResumes.length === 0 ? (
          <EmptyState onCreateResume={() => setShowCreateModal(true)} />
        ) : (
          <div className={`${
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'space-y-4'
          }`}>
            {filteredResumes.map((resume) => (
              <ResumeCard
                key={resume.id}
                resume={resume}
                viewMode={viewMode}
              />
            ))}
          </div>
        )}

        {/* Create Resume Modal */}
        {showCreateModal && (
          <CreateResumeModal
            isOpen={showCreateModal}
            onClose={() => setShowCreateModal(false)}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;