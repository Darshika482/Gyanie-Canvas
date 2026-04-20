export type TaskType = 
  | 'Reading' 
  | 'Video' 
  | 'Chapter Quiz' 
  | 'Notes' 
  | 'Assignment' 
  | 'Write' 
  | 'Revision' 
  | 'Practice';

export interface Task {
  id: string;
  type: TaskType;
  name: string;
  description: string;
  minutes: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  subtasks?: Task[];
  isCompleted?: boolean;
  // Extra schema-driven fields
  fields?: Record<string, any>;
}

export interface Module {
  id: string;
  title: string;
  color: string;
  tasks: Task[];
  objectives?: string[];
  weeks?: number;
}

export interface LearningSystem {
  id: string;
  title: string;
  modules: Module[];
}
