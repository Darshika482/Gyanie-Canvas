import { LearningSystem, Task } from '../types';

const mockTasks1: Task[] = [
  { 
    id: 't1', type: 'Reading', name: 'Intro to the Cosmos', description: 'Read section 1.1 - 1.3', minutes: 15, difficulty: 'Easy', 
    subtasks: [
      { id: 'st1', name: 'Read 1.1', type: 'Reading', description: '', minutes: 5, difficulty: 'Easy', isCompleted: true }, 
      { id: 'st2', name: 'Read 1.2', type: 'Reading', description: '', minutes: 5, difficulty: 'Easy', isCompleted: false }, 
      { id: 'st3', name: 'Read 1.3', type: 'Reading', description: '', minutes: 5, difficulty: 'Easy', isCompleted: false }
    ] 
  },
  { 
    id: 't2', type: 'Video', name: 'What is a Star?', description: 'Watch the 10 min explainer', minutes: 10, difficulty: 'Easy', 
    subtasks: [
      { id: 'st4', name: 'Watch Intro', type: 'Video', description: '', minutes: 3, difficulty: 'Easy', isCompleted: false }, 
      { id: 'st5', name: 'Take notes on main sequence', type: 'Notes', description: '', minutes: 7, difficulty: 'Easy', isCompleted: false }
    ] 
  },
  { 
    id: 't3', type: 'Chapter Quiz', name: 'Basic Definitions', description: '5 Questions', minutes: 15, difficulty: 'Medium', fields: { questions: 5, format: 'MCQ' },
    subtasks: [
      { id: 'st6', name: 'Answer MCQ', type: 'Chapter Quiz', description: '', minutes: 10, difficulty: 'Easy', isCompleted: false },
      { id: 'st7', name: 'Review answers', type: 'Reading', description: '', minutes: 5, difficulty: 'Easy', isCompleted: false }
    ]
  }
];

const mockTasks2: Task[] = [
  { id: 't4', type: 'Reading', name: 'Life Cycle of Stars', description: 'Read section 2.0', minutes: 20, difficulty: 'Medium' },
  { id: 't5', type: 'Notes', name: 'Stellar Evolution', description: 'Submit summary notes', minutes: 30, difficulty: 'Hard' },
  { id: 't6', type: 'Assignment', name: 'HR Diagram plotting', description: 'Plot 10 local stars', minutes: 45, difficulty: 'Hard' }
];

const mockTasks3: Task[] = [
  { id: 't7', type: 'Practice', name: 'Speed of Light Equations', description: 'Solve 10 problems', minutes: 20, difficulty: 'Medium' },
  { id: 't8', type: 'Write', name: 'Essay on Supernovas', description: '500 words minimum', minutes: 45, difficulty: 'Medium' },
  { id: 't9', type: 'Revision', name: 'Flashcards: Galaxy Types', description: 'Review 30 flashcards', minutes: 15, difficulty: 'Easy' }
];

export const mockSystem: LearningSystem = {
  id: 'sys-123',
  title: 'Astrophysics 101',
  modules: [
    { id: 'm1', title: 'Week 1: Foundations', color: 'bg-indigo-500', tasks: mockTasks1 },
    { id: 'm2', title: 'Week 2: Stars', color: 'bg-violet-500', tasks: mockTasks2 },
    { id: 'm3', title: 'Week 3: Galaxies', color: 'bg-emerald-500', tasks: mockTasks3 }
  ]
};
