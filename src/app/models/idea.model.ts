export interface Idea {
  id: string;
  title: string;
  description: string;
  category: Category;
  tags: string[];
  priority: Priority;
  status: Status;
  isFavorite: boolean;
  createdAt: Date;
  updatedAt: Date;
  author: string;
  color?: string;
  attachments?: Attachment[];
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'document' | 'link';
  size?: number;
}

export enum Priority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

export enum Status {
  DRAFT = 'draft',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  ARCHIVED = 'archived'
}

export interface IdeaFilter {
  search?: string;
  categories?: string[];
  tags?: string[];
  priority?: Priority;
  status?: Status;
  favorites?: boolean;
  dateRange?: {
    from: Date;
    to: Date;
  };
}

export interface IdeaStats {
  total: number;
  byStatus: Record<Status, number>;
  byPriority: Record<Priority, number>;
  byCategory: Record<string, number>;
  favorites: number;
}