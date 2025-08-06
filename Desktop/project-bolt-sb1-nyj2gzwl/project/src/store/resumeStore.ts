import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Resume, ResumeContent, Template } from '../types';
import { generateId } from '../utils/helpers';
import { defaultTemplates } from '../data/templates';
import { createDefaultResumeContent } from '../data/defaultContent';

interface ResumeStore {
  resumes: Resume[];
  currentResume: Resume | null;
  templates: Template[];
  searchQuery: string;
  filterBy: 'all' | 'recent' | 'template';

  // Actions
  createResume: (title: string, templateId: string, content?: Partial<ResumeContent>) => Resume;
  updateResume: (id: string, updates: Partial<Resume>) => void;
  deleteResume: (id: string) => void;
  duplicateResume: (id: string) => Resume;
  setCurrentResume: (resume: Resume | null) => void;
  setSearchQuery: (query: string) => void;
  setFilterBy: (filter: 'all' | 'recent' | 'template') => void;
  getFilteredResumes: () => Resume[];
  saveCurrentResume: () => void;
  loadResume: (id: string) => Resume | null;
}

export const useResumeStore = create<ResumeStore>()(
  persist(
    (set, get) => ({
      resumes: [],
      currentResume: null,
      templates: defaultTemplates,
      searchQuery: '',
      filterBy: 'all',

      createResume: (title, templateId, content) => {
        const newResume: Resume = {
          id: generateId(),
          title,
          templateId,
          lastModified: new Date(),
          createdAt: new Date(),
          thumbnail: `https://images.pexels.com/photos/590016/pexels-photo-590016.jpeg?auto=compress&cs=tinysrgb&w=300`,
          content: content ? { ...createDefaultResumeContent(), ...content } : createDefaultResumeContent(),
        };

        set((state) => ({
          resumes: [...state.resumes, newResume],
          currentResume: newResume,
        }));

        return newResume;
      },

      updateResume: (id, updates) => {
        set((state) => ({
          resumes: state.resumes.map((resume) =>
            resume.id === id
              ? {
                ...resume,
                ...updates,
                content: updates.content ? { ...resume.content, ...updates.content } : resume.content,
                lastModified: new Date()
              }
              : resume
          ),
          currentResume: state.currentResume?.id === id
            ? {
              ...state.currentResume,
              ...updates,
              content: updates.content ? { ...state.currentResume.content, ...updates.content } : state.currentResume.content,
              lastModified: new Date()
            }
            : state.currentResume,
        }));
      },

      deleteResume: (id) => {
        set((state) => ({
          resumes: state.resumes.filter((resume) => resume.id !== id),
          currentResume: state.currentResume?.id === id ? null : state.currentResume,
        }));
      },

      duplicateResume: (id) => {
        const originalResume = get().resumes.find((r) => r.id === id);
        if (!originalResume) throw new Error('Resume not found');

        const duplicatedResume: Resume = {
          ...originalResume,
          id: generateId(),
          title: `${originalResume.title} (Copy)`,
          createdAt: new Date(),
          lastModified: new Date(),
        };

        set((state) => ({
          resumes: [...state.resumes, duplicatedResume],
        }));

        return duplicatedResume;
      },

      setCurrentResume: (resume) => {
        set({ currentResume: resume });
      },

      setSearchQuery: (query) => {
        set({ searchQuery: query });
      },

      setFilterBy: (filter) => {
        set({ filterBy: filter });
      },

      getFilteredResumes: () => {
        const { resumes, searchQuery, filterBy } = get();
        let filtered = [...resumes];

        // Apply search filter
        if (searchQuery) {
          filtered = filtered.filter((resume) =>
            resume.title.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }

        // Apply category filter
        if (filterBy === 'recent') {
          filtered = filtered.sort((a, b) =>
            new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime()
          ).slice(0, 5);
        }

        return filtered.sort((a, b) =>
          new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime()
        );
      },

      saveCurrentResume: () => {
        const { currentResume } = get();
        if (currentResume) {
          get().updateResume(currentResume.id, currentResume);
        }
      },

      loadResume: (id) => {
        const resume = get().resumes.find((r) => r.id === id);
        if (resume) {
          set({ currentResume: resume });
          return resume;
        }
        return null;
      },
    }),
    {
      name: 'resume-forge-storage',
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          const data = JSON.parse(str);



          // Convert date strings back to Date objects
          if (data.state?.resumes) {
            data.state.resumes = data.state.resumes.map((resume: any) => ({
              ...resume,
              lastModified: new Date(resume.lastModified),
              createdAt: new Date(resume.createdAt),
            }));
          }

          if (data.state?.currentResume) {
            data.state.currentResume = {
              ...data.state.currentResume,
              lastModified: new Date(data.state.currentResume.lastModified),
              createdAt: new Date(data.state.currentResume.createdAt),
            };
          }

          return data;
        },
        setItem: (name, value) => {
          localStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => {
          localStorage.removeItem(name);
        },
      },
      partialize: (state) => ({
        resumes: state.resumes,
        currentResume: state.currentResume,
      }),
    }
  )
);