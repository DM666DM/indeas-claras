import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, of, delay } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { saveAs } from 'file-saver';
import { Idea, Category, Priority, Status, IdeaFilter, IdeaStats } from '@app/models/idea.model';

@Injectable({
  providedIn: 'root'
})
export class IdeaService {
  private readonly STORAGE_KEY = 'ideas-claras-data';
  private ideasSubject = new BehaviorSubject<Idea[]>([]);
  private categoriesSubject = new BehaviorSubject<Category[]>([]);

  public ideas$ = this.ideasSubject.asObservable();
  public categories$ = this.categoriesSubject.asObservable();

  constructor() {
    this.loadData();
    this.initializeDefaultCategories();
  }

  // CRUD Operations
  getAllIdeas(): Observable<Idea[]> {
    return this.ideas$;
  }

  getIdeaById(id: string): Observable<Idea | undefined> {
    return this.ideas$.pipe(
      map(ideas => ideas.find(idea => idea.id === id))
    );
  }

  createIdea(ideaData: Partial<Idea>): Observable<Idea> {
    const newIdea: Idea = {
      id: uuidv4(),
      title: ideaData.title || '',
      description: ideaData.description || '',
      category: ideaData.category || this.getDefaultCategory(),
      tags: ideaData.tags || [],
      priority: ideaData.priority || Priority.MEDIUM,
      status: ideaData.status || Status.DRAFT,
      isFavorite: ideaData.isFavorite || false,
      createdAt: new Date(),
      updatedAt: new Date(),
      author: ideaData.author || 'Usuario',
      color: ideaData.color,
      attachments: ideaData.attachments || []
    };

    const currentIdeas = this.ideasSubject.value;
    const updatedIdeas = [...currentIdeas, newIdea];
    this.ideasSubject.next(updatedIdeas);
    this.saveData();

    return of(newIdea).pipe(delay(100));
  }

  updateIdea(id: string, updates: Partial<Idea>): Observable<Idea | null> {
    const currentIdeas = this.ideasSubject.value;
    const ideaIndex = currentIdeas.findIndex(idea => idea.id === id);

    if (ideaIndex === -1) {
      return of(null);
    }

    const updatedIdea: Idea = {
      ...currentIdeas[ideaIndex],
      ...updates,
      updatedAt: new Date()
    };

    const updatedIdeas = [...currentIdeas];
    updatedIdeas[ideaIndex] = updatedIdea;
    this.ideasSubject.next(updatedIdeas);
    this.saveData();

    return of(updatedIdea).pipe(delay(100));
  }

  deleteIdea(id: string): Observable<boolean> {
    const currentIdeas = this.ideasSubject.value;
    const filteredIdeas = currentIdeas.filter(idea => idea.id !== id);
    
    if (filteredIdeas.length === currentIdeas.length) {
      return of(false);
    }

    this.ideasSubject.next(filteredIdeas);
    this.saveData();
    return of(true).pipe(delay(100));
  }

  // Filtering and Search
  filterIdeas(filter: IdeaFilter): Observable<Idea[]> {
    return this.ideas$.pipe(
      map(ideas => {
        return ideas.filter(idea => {
          // Search filter
          if (filter.search) {
            const searchTerm = filter.search.toLowerCase();
            const matchesSearch = 
              idea.title.toLowerCase().includes(searchTerm) ||
              idea.description.toLowerCase().includes(searchTerm) ||
              idea.tags.some(tag => tag.toLowerCase().includes(searchTerm));
            
            if (!matchesSearch) return false;
          }

          // Category filter
          if (filter.categories && filter.categories.length > 0) {
            if (!filter.categories.includes(idea.category.id)) return false;
          }

          // Tags filter
          if (filter.tags && filter.tags.length > 0) {
            if (!filter.tags.some(tag => idea.tags.includes(tag))) return false;
          }

          // Priority filter
          if (filter.priority && idea.priority !== filter.priority) return false;

          // Status filter
          if (filter.status && idea.status !== filter.status) return false;

          // Favorites filter
          if (filter.favorites !== undefined && idea.isFavorite !== filter.favorites) return false;

          // Date range filter
          if (filter.dateRange) {
            const ideaDate = new Date(idea.createdAt);
            if (ideaDate < filter.dateRange.from || ideaDate > filter.dateRange.to) return false;
          }

          return true;
        });
      })
    );
  }

  // Favorites
  toggleFavorite(id: string): Observable<boolean> {
    const currentIdeas = this.ideasSubject.value;
    const ideaIndex = currentIdeas.findIndex(idea => idea.id === id);

    if (ideaIndex === -1) {
      return of(false);
    }

    const updatedIdea = {
      ...currentIdeas[ideaIndex],
      isFavorite: !currentIdeas[ideaIndex].isFavorite,
      updatedAt: new Date()
    };

    const updatedIdeas = [...currentIdeas];
    updatedIdeas[ideaIndex] = updatedIdea;
    this.ideasSubject.next(updatedIdeas);
    this.saveData();

    return of(true).pipe(delay(100));
  }

  getFavoriteIdeas(): Observable<Idea[]> {
    return this.ideas$.pipe(
      map(ideas => ideas.filter(idea => idea.isFavorite))
    );
  }

  // Statistics
  getStats(): Observable<IdeaStats> {
    return this.ideas$.pipe(
      map(ideas => {
        const stats: IdeaStats = {
          total: ideas.length,
          byStatus: {
            [Status.DRAFT]: 0,
            [Status.IN_PROGRESS]: 0,
            [Status.COMPLETED]: 0,
            [Status.ARCHIVED]: 0
          },
          byPriority: {
            [Priority.LOW]: 0,
            [Priority.MEDIUM]: 0,
            [Priority.HIGH]: 0,
            [Priority.URGENT]: 0
          },
          byCategory: {},
          favorites: ideas.filter(idea => idea.isFavorite).length
        };

        ideas.forEach(idea => {
          stats.byStatus[idea.status]++;
          stats.byPriority[idea.priority]++;
          stats.byCategory[idea.category.name] = (stats.byCategory[idea.category.name] || 0) + 1;
        });

        return stats;
      })
    );
  }

  // Categories
  getAllCategories(): Observable<Category[]> {
    return this.categories$;
  }

  createCategory(categoryData: Partial<Category>): Observable<Category> {
    const newCategory: Category = {
      id: uuidv4(),
      name: categoryData.name || '',
      icon: categoryData.icon || '💡',
      color: categoryData.color || '#007bff'
    };

    const currentCategories = this.categoriesSubject.value;
    const updatedCategories = [...currentCategories, newCategory];
    this.categoriesSubject.next(updatedCategories);
    this.saveData();

    return of(newCategory).pipe(delay(100));
  }

  // Export/Import
  exportIdeas(): void {
    const ideas = this.ideasSubject.value;
    const categories = this.categoriesSubject.value;
    const exportData = {
      ideas,
      categories,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });

    const fileName = `ideas-claras-backup-${new Date().toISOString().split('T')[0]}.json`;
    saveAs(blob, fileName);
  }

  exportIdeasAsCSV(): void {
    const ideas = this.ideasSubject.value;
    const csvHeaders = [
      'ID', 'Título', 'Descripción', 'Categoría', 'Etiquetas', 
      'Prioridad', 'Estado', 'Favorito', 'Creado', 'Actualizado', 'Autor'
    ];

    const csvData = ideas.map(idea => [
      idea.id,
      `"${idea.title}"`,
      `"${idea.description}"`,
      idea.category.name,
      `"${idea.tags.join(', ')}"`,
      idea.priority,
      idea.status,
      idea.isFavorite ? 'Sí' : 'No',
      idea.createdAt.toISOString(),
      idea.updatedAt.toISOString(),
      idea.author
    ]);

    const csvContent = [csvHeaders, ...csvData]
      .map(row => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const fileName = `ideas-claras-${new Date().toISOString().split('T')[0]}.csv`;
    saveAs(blob, fileName);
  }

  importIdeas(file: File): Observable<boolean> {
    return new Observable(observer => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          
          if (data.ideas && Array.isArray(data.ideas)) {
            this.ideasSubject.next(data.ideas);
          }
          
          if (data.categories && Array.isArray(data.categories)) {
            this.categoriesSubject.next(data.categories);
          }
          
          this.saveData();
          observer.next(true);
          observer.complete();
        } catch (error) {
          observer.error(error);
        }
      };
      reader.readAsText(file);
    });
  }

  // Private methods
  private loadData(): void {
    try {
      const savedData = localStorage.getItem(this.STORAGE_KEY);
      if (savedData) {
        const data = JSON.parse(savedData);
        
        // Convert date strings back to Date objects
        if (data.ideas) {
          data.ideas = data.ideas.map((idea: any) => ({
            ...idea,
            createdAt: new Date(idea.createdAt),
            updatedAt: new Date(idea.updatedAt)
          }));
          this.ideasSubject.next(data.ideas);
        }
        
        if (data.categories) {
          this.categoriesSubject.next(data.categories);
        }
      }
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
    }
  }

  private saveData(): void {
    try {
      const data = {
        ideas: this.ideasSubject.value,
        categories: this.categoriesSubject.value
      };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving data to localStorage:', error);
    }
  }

  private initializeDefaultCategories(): void {
    const currentCategories = this.categoriesSubject.value;
    if (currentCategories.length === 0) {
      const defaultCategories: Category[] = [
        { id: '1', name: 'Personal', icon: '👤', color: '#28a745' },
        { id: '2', name: 'Trabajo', icon: '💼', color: '#007bff' },
        { id: '3', name: 'Proyectos', icon: '🚀', color: '#fd7e14' },
        { id: '4', name: 'Estudios', icon: '📚', color: '#6f42c1' },
        { id: '5', name: 'Creatividad', icon: '🎨', color: '#e83e8c' },
        { id: '6', name: 'Tecnología', icon: '💻', color: '#20c997' }
      ];
      this.categoriesSubject.next(defaultCategories);
      this.saveData();
    }
  }

  private getDefaultCategory(): Category {
    const categories = this.categoriesSubject.value;
    return categories[0] || { id: '1', name: 'General', icon: '💡', color: '#6c757d' };
  }
}