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

const mockTasksAppendix: Task[] = [
  {
    id: 't-app-1', type: 'Reading', name: '1.1 Read — What makes a sentence a valid mathematical statement?', description: 'Read section A1.1 and A1.2 through to the end of Example 2 on page 220.', minutes: 15, difficulty: 'Easy',
    subtasks: [
      { id: 'st-app-1-1', name: 'Read A1.1 (p. 218)', type: 'Reading', description: 'Note the politician and shoe-advertisement examples.', minutes: 2, difficulty: 'Easy' },
      { id: 'st-app-1-2', name: 'Read A1.2 (p. 219)', type: 'Reading', description: 'Note the three categories: always true, always false, ambiguous.', minutes: 3, difficulty: 'Easy' },
      { id: 'st-app-1-3', name: 'Read Example 1 (p. 219)', type: 'Reading', description: 'Try to classify before reading solution.', minutes: 3, difficulty: 'Easy' },
      { id: 'st-app-1-4', name: 'Read Example 2 (pp. 219–220)', type: 'Reading', description: 'Notice All, Some, and Not all.', minutes: 3, difficulty: 'Easy' },
      { id: 'st-app-1-5', name: 'Read Example 3 (p. 220)', type: 'Reading', description: 'See how a given condition restricts statements.', minutes: 2, difficulty: 'Easy' },
      { id: 'st-app-1-6', name: 'Read Example 4 (pp. 220–221)', type: 'Reading', description: 'Practise restating a false statement.', minutes: 2, difficulty: 'Easy' }
    ]
  },
  { id: 't-app-2', type: 'Video', name: '1.2 Watch — Types of mathematical statements explained', description: 'Watch an 8–12 minute video that covers what makes a statement mathematically valid.', minutes: 10, difficulty: 'Easy' },
  {
    id: 't-app-3', type: 'Practice', name: '1.3 Solve — Exercise A1.1: classifying and restating', description: 'Solve all 4 questions of Exercise A1.1.', minutes: 25, difficulty: 'Medium',
    subtasks: [
      { id: 'st-app-3-1', name: 'Q1 (i–v)', type: 'Practice', description: 'Read each sentence and decide: always true / always false / ambiguous.', minutes: 6, difficulty: 'Medium' },
      { id: 'st-app-3-2', name: 'Q2 (i–v)', type: 'Practice', description: 'Decide true or false and justify.', minutes: 6, difficulty: 'Medium' },
      { id: 'st-app-3-3', name: 'Q3 (i–iii)', type: 'Practice', description: 'Work through each option given ab ≠ 0.', minutes: 6, difficulty: 'Medium' },
      { id: 'st-app-3-4', name: 'Q4 (i–iv)', type: 'Practice', description: 'Add a condition or qualifier to make false statements true.', minutes: 7, difficulty: 'Hard' }
    ]
  },
  { id: 't-app-4', type: 'Chapter Quiz', name: '1.4 Quick check — Mathematical statements', description: 'Answer 3 questions.', minutes: 8, difficulty: 'Medium', fields: { questions: 3, format: 'Short Answer' } },
  {
    id: 't-app-5', type: 'Reading', name: '2.1 Read — Deductive reasoning', description: 'Read section A1.3 (pages 222–223).', minutes: 12, difficulty: 'Medium',
    subtasks: [
      { id: 'st-app-5-1', name: 'Definition', type: 'Reading', description: 'Read definition of premises and hypotheses.', minutes: 2, difficulty: 'Easy' },
      { id: 'st-app-5-2', name: 'Examples 5 & 6', type: 'Reading', description: 'Notice the two-premise structure.', minutes: 2, difficulty: 'Medium' },
      { id: 'st-app-5-3', name: 'Example 7', type: 'Reading', description: 'A purely algebraic deduction.', minutes: 2, difficulty: 'Medium' },
      { id: 'st-app-5-4', name: 'Example 8', type: 'Reading', description: 'A geometry deduction.', minutes: 2, difficulty: 'Medium' },
      { id: 'st-app-5-5', name: 'Example 9', type: 'Reading', description: 'Assume a premise and deduce.', minutes: 2, difficulty: 'Hard' },
      { id: 'st-app-5-6', name: 'Closing', type: 'Reading', description: 'Understand wrong premise leads to wrong conclusion.', minutes: 2, difficulty: 'Medium' }
    ]
  },
  { id: 't-app-6', type: 'Notes', name: '2.2 Notes — Deductive argument template', description: 'Premise 1 → Premise 2 → Deduction → Conclusion', minutes: 5, difficulty: 'Easy' },
  {
    id: 't-app-7', type: 'Practice', name: '2.3 Solve — Exercise A1.2: deductive reasoning', description: 'Solve all 7 questions from Exercise A1.2.', minutes: 20, difficulty: 'Hard',
    subtasks: [
      { id: 'st-app-7-1', name: 'Q1', type: 'Practice', description: 'Premises about mortality.', minutes: 2, difficulty: 'Medium' },
      { id: 'st-app-7-2', name: 'Q2', type: 'Practice', description: 'Product of two rationals.', minutes: 3, difficulty: 'Medium' },
      { id: 'st-app-7-3', name: 'Q3', type: 'Practice', description: '√17 is irrational.', minutes: 3, difficulty: 'Medium' },
      { id: 'st-app-7-4', name: 'Q4', type: 'Practice', description: 'Substitute x = -1.', minutes: 3, difficulty: 'Medium' },
      { id: 'st-app-7-5', name: 'Q5', type: 'Practice', description: 'Parallelogram angles.', minutes: 3, difficulty: 'Medium' },
      { id: 'st-app-7-6', name: 'Q6', type: 'Practice', description: 'Cyclic parallelogram.', minutes: 3, difficulty: 'Hard' },
      { id: 'st-app-7-7', name: 'Q7', type: 'Practice', description: 'Deduction about √3721.', minutes: 3, difficulty: 'Hard' }
    ]
  },
  { id: 't-app-8', type: 'Chapter Quiz', name: '2.4 Quick check — Deductive reasoning', description: 'Answer three questions in your notebook.', minutes: 7, difficulty: 'Medium' },
  {
    id: 't-app-9', type: 'Reading', name: '3.1 Read — Guess vs Proof', description: 'Read section A1.4 (pages 223–228).', minutes: 25, difficulty: 'Hard',
    subtasks: [
      { id: 'st-app-9-1', name: 'Pages 223–224', type: 'Reading', description: 'Circle-regions table.', minutes: 4, difficulty: 'Medium' },
      { id: 'st-app-9-2', name: 'Counter-example', type: 'Reading', description: 'n=6 destroying the claim.', minutes: 4, difficulty: 'Medium' },
      { id: 'st-app-9-3', name: 'Pages 224–225', type: 'Reading', description: 'Valid proofs.', minutes: 4, difficulty: 'Hard' },
      { id: 'st-app-9-4', name: 'Example 10', type: 'Reading', description: 'Sum of two rationals.', minutes: 5, difficulty: 'Hard' },
      { id: 'st-app-9-5', name: 'Example 11', type: 'Reading', description: 'Proof by exhaustion.', minutes: 4, difficulty: 'Hard' },
      { id: 'st-app-9-6', name: 'Theorem A1.1', type: 'Reading', description: 'Converse of Pythagoras Theorem.', minutes: 4, difficulty: 'Medium' }
    ]
  },
  { id: 't-app-10', type: 'Video', name: '3.2 Watch — Writing a formal proof', description: 'Watch a direct proof using statement-analysis.', minutes: 12, difficulty: 'Medium' },
  { id: 't-app-11', type: 'Practice', name: '3.3 Solve — Exercise A1.3: write 6 complete proofs', description: 'Solve all 6 questions from Exercise A1.3.', minutes: 40, difficulty: 'Hard' },
  { id: 't-app-12', type: 'Assignment', name: '3.4 Assignment — Two original proofs', description: 'Submit two original proofs in statement-analysis format.', minutes: 30, difficulty: 'Hard' },
  { id: 't-app-13', type: 'Chapter Quiz', name: '3.5 Quick check — Proofs and direct method', description: 'Answer three questions in your notebook.', minutes: 10, difficulty: 'Medium' },
  { id: 't-app-14', type: 'Reading', name: '4.1 Read — How to negate a statement', description: 'Read section A1.5 (pages 228–230).', minutes: 12, difficulty: 'Medium' },
  { id: 't-app-15', type: 'Practice', name: '4.2 Solve — Exercise A1.4: writing correct negations', description: 'Solve both questions from Exercise A1.4.', minutes: 20, difficulty: 'Hard' },
  { id: 't-app-16', type: 'Chapter Quiz', name: '4.3 Quick check — Negation', description: 'Answer three questions in your notebook.', minutes: 7, difficulty: 'Medium' },
  { id: 't-app-17', type: 'Reading', name: '5.1 Read — Converse of a statement', description: 'Read section A1.6 (pages 231–233).', minutes: 12, difficulty: 'Medium' },
  { id: 't-app-18', type: 'Practice', name: '5.2 Solve — Exercise A1.5: converses', description: 'Solve both questions from Exercise A1.5.', minutes: 20, difficulty: 'Hard' },
  { id: 't-app-19', type: 'Chapter Quiz', name: '5.3 Quick check — Converse', description: 'Answer three questions.', minutes: 7, difficulty: 'Medium' },
  { id: 't-app-20', type: 'Reading', name: '6.1 Read — Proof by contradiction', description: 'Read section A1.7 (pages 234–237).', minutes: 20, difficulty: 'Hard' },
  { id: 't-app-21', type: 'Video', name: '6.2 Watch — Proof by contradiction', description: 'Watch contradiction examples.', minutes: 12, difficulty: 'Medium' },
  { id: 't-app-22', type: 'Practice', name: '6.3 Solve — Exercise A1.6: 6 proofs by contradiction', description: 'Solve all 6 questions from Exercise A1.6.', minutes: 40, difficulty: 'Hard' },
  { id: 't-app-23', type: 'Chapter Quiz', name: '6.4 Quick check — Proof by contradiction', description: 'Answer three questions.', minutes: 10, difficulty: 'Medium' },
  { id: 't-app-24', type: 'Write', name: '7.1 Write — Your personal summary of Appendix A1', description: 'Write a summary of everything you learned in this appendix from memory.', minutes: 25, difficulty: 'Hard' },
  { id: 't-app-25', type: 'Revision', name: '7.2 Revision — Final sweep through all sub-topics', description: 'Review all key concepts from the full module before the chapter quiz.', minutes: 30, difficulty: 'Medium' },
  { id: 't-app-26', type: 'Chapter Quiz', name: '7.3 Chapter Quiz — Proofs in Mathematics', description: 'Attempt all 12 questions in one sitting.', minutes: 30, difficulty: 'Hard', fields: { questions: 12, format: 'Mixed' } }
];

export const mockSystem: LearningSystem = {
  id: 'sys-123',
  title: 'Astrophysics 101',
  modules: [
    { id: 'm1', title: 'Week 1: Foundations', color: 'bg-indigo-500', tasks: mockTasks1 },
    { id: 'm2', title: 'Week 2: Stars', color: 'bg-violet-500', tasks: mockTasks2 },
    { id: 'm3', title: 'Week 3: Galaxies', color: 'bg-emerald-500', tasks: mockTasks3 },
    { id: 'm-app-1', title: 'Appendix A1: Proofs in Mathematics', color: 'bg-rose-500', tasks: mockTasksAppendix }
  ]
};
