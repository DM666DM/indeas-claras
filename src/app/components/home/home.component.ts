import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subject, takeUntil, combineLatest } from 'rxjs';

import { IdeaService } from '@app/services/idea.service';
import { ThemeService } from '@app/services/theme.service';
import { Idea, IdeaStats, Priority, Status } from '@app/models/idea.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="home-container">
      <!-- Hero Section -->
      <section class="hero" aria-labelledby="hero-title">
        <div class="hero-content">
          <h1 id="hero-title" class="hero-title">
            <span class="hero-icon">💡</span>
            Bienvenido a Ideas Claras
          </h1>
          <p class="hero-description">
            Organiza, gestiona y desarrolla tus ideas de forma clara y eficiente. 
            Convierte tus pensamientos en proyectos exitosos.
          </p>
          <div class="hero-actions">
            <button routerLink="/ideas/new" class="btn-primary">
              <span class="material-icons">add</span>
              Nueva Idea
            </button>
            <button routerLink="/ideas" class="btn-outline">
              <span class="material-icons">lightbulb</span>
              Ver Mis Ideas
            </button>
          </div>
        </div>
        <div class="hero-illustration">
          <div class="floating-ideas">
            <div class="idea-bubble idea-1">🚀</div>
            <div class="idea-bubble idea-2">💡</div>
            <div class="idea-bubble idea-3">⭐</div>
            <div class="idea-bubble idea-4">🎯</div>
            <div class="idea-bubble idea-5">✨</div>
          </div>
        </div>
      </section>

      <!-- Quick Stats -->
      <section class="quick-stats" aria-labelledby="stats-title" *ngIf="stats">
        <h2 id="stats-title" class="sr-only">Estadísticas rápidas</h2>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon">📝</div>
            <div class="stat-content">
              <div class="stat-number">{{ stats.total }}</div>
              <div class="stat-label">Ideas Totales</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">⭐</div>
            <div class="stat-content">
              <div class="stat-number">{{ stats.favorites }}</div>
              <div class="stat-label">Favoritas</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">✅</div>
            <div class="stat-content">
              <div class="stat-number">{{ stats.byStatus[statusEnum.COMPLETED] || 0 }}</div>
              <div class="stat-label">Completadas</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">🚀</div>
            <div class="stat-content">
              <div class="stat-number">{{ stats.byStatus[statusEnum.IN_PROGRESS] || 0 }}</div>
              <div class="stat-label">En Progreso</div>
            </div>
          </div>
        </div>
      </section>

      <!-- Recent Ideas -->
      <section class="recent-ideas" aria-labelledby="recent-title" *ngIf="recentIdeas.length > 0">
        <div class="section-header">
          <h2 id="recent-title">Ideas Recientes</h2>
          <a routerLink="/ideas" class="view-all-link">
            Ver todas
            <span class="material-icons">arrow_forward</span>
          </a>
        </div>
        <div class="ideas-grid">
          <article 
            *ngFor="let idea of recentIdeas; trackBy: trackIdea" 
            class="idea-card"
            [routerLink]="['/ideas', idea.id]"
          >
            <div class="idea-header">
              <div class="idea-category">
                <span class="category-icon">{{ idea.category.icon }}</span>
                <span class="category-name">{{ idea.category.name }}</span>
              </div>
              <button 
                class="favorite-btn"
                [class.active]="idea.isFavorite"
                (click)="toggleFavorite($event, idea.id)"
                [attr.aria-label]="idea.isFavorite ? 'Quitar de favoritos' : 'Añadir a favoritos'"
              >
                <span class="material-icons">{{ idea.isFavorite ? 'favorite' : 'favorite_border' }}</span>
              </button>
            </div>
            <h3 class="idea-title">{{ idea.title }}</h3>
            <p class="idea-description">{{ idea.description | slice:0:100 }}{{ idea.description.length > 100 ? '...' : '' }}</p>
            <div class="idea-footer">
              <div class="idea-meta">
                <span class="priority priority-{{ idea.priority }}">{{ getPriorityLabel(idea.priority) }}</span>
                <span class="status status-{{ idea.status }}">{{ getStatusLabel(idea.status) }}</span>
              </div>
              <div class="idea-date">
                {{ idea.updatedAt | date:'short' }}
              </div>
            </div>
          </article>
        </div>
      </section>

      <!-- Features Section -->
      <section class="features" aria-labelledby="features-title" *ngIf="recentIdeas.length === 0">
        <h2 id="features-title">¿Qué puedes hacer con Ideas Claras?</h2>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">🎯</div>
            <h3 class="feature-title">Organiza por Categorías</h3>
            <p class="feature-description">
              Clasifica tus ideas por temas: trabajo, personal, proyectos, estudios y más.
            </p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">⭐</div>
            <h3 class="feature-title">Marca Favoritas</h3>
            <p class="feature-description">
              Destaca las ideas más importantes para acceder rápidamente a ellas.
            </p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🔍</div>
            <h3 class="feature-title">Búsqueda Avanzada</h3>
            <p class="feature-description">
              Encuentra cualquier idea usando filtros por categoría, estado, prioridad y más.
            </p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">📊</div>
            <h3 class="feature-title">Estadísticas</h3>
            <p class="feature-description">
              Visualiza el progreso de tus ideas con gráficos y métricas detalladas.
            </p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">💾</div>
            <h3 class="feature-title">Exportar Datos</h3>
            <p class="feature-description">
              Descarga tus ideas en formato JSON o CSV para hacer respaldos.
            </p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🌙</div>
            <h3 class="feature-title">Tema Oscuro</h3>
            <p class="feature-description">
              Cambia entre tema claro y oscuro según tus preferencias.
            </p>
          </div>
        </div>
      </section>

      <!-- Call to Action -->
      <section class="cta" aria-labelledby="cta-title" *ngIf="recentIdeas.length === 0">
        <h2 id="cta-title">¡Comienza ahora!</h2>
        <p class="cta-description">
          Crea tu primera idea y comienza a organizar tus pensamientos de manera eficiente.
        </p>
        <button routerLink="/ideas/new" class="cta-button">
          <span class="material-icons">add_circle</span>
          Crear Mi Primera Idea
        </button>
      </section>
    </div>
  `,
  styles: [`
    .home-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: var(--space-lg);
    }

    /* Hero Section */
    .hero {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--space-2xl);
      align-items: center;
      margin-bottom: var(--space-2xl);
      padding: var(--space-2xl) 0;
    }

    .hero-content {
      max-width: 500px;
    }

    .hero-title {
      font-size: var(--font-size-3xl);
      font-weight: var(--font-weight-bold);
      margin-bottom: var(--space-lg);
      display: flex;
      align-items: center;
      gap: var(--space-md);
      animation: fadeIn 0.8s ease;
    }

    .hero-icon {
      font-size: 2.5rem;
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.1); }
    }

    .hero-description {
      font-size: var(--font-size-lg);
      color: var(--color-text-secondary);
      margin-bottom: var(--space-xl);
      line-height: var(--line-height-relaxed);
      animation: fadeIn 0.8s ease 0.2s both;
    }

    .hero-actions {
      display: flex;
      gap: var(--space-md);
      animation: fadeIn 0.8s ease 0.4s both;
    }

    .btn-primary {
      background-color: var(--color-primary);
      color: white;
      padding: var(--space-md) var(--space-xl);
      border: none;
      border-radius: var(--radius-lg);
      font-weight: var(--font-weight-medium);
      display: flex;
      align-items: center;
      gap: var(--space-sm);
      text-decoration: none;
      transition: all var(--transition-base);
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-elevated);
    }

    .btn-outline {
      background-color: transparent;
      color: var(--color-primary);
      border: 2px solid var(--color-primary);
      padding: var(--space-md) var(--space-xl);
      border-radius: var(--radius-lg);
      font-weight: var(--font-weight-medium);
      display: flex;
      align-items: center;
      gap: var(--space-sm);
      text-decoration: none;
      transition: all var(--transition-base);
    }

    .btn-outline:hover {
      background-color: var(--color-primary);
      color: white;
      transform: translateY(-2px);
    }

    /* Hero Illustration */
    .hero-illustration {
      position: relative;
      height: 400px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .floating-ideas {
      position: relative;
      width: 300px;
      height: 300px;
    }

    .idea-bubble {
      position: absolute;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--color-primary), var(--color-surface));
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      box-shadow: var(--shadow-base);
      animation: float 3s ease-in-out infinite;
    }

    .idea-1 { top: 20%; left: 20%; animation-delay: 0s; }
    .idea-2 { top: 10%; right: 20%; animation-delay: 0.6s; }
    .idea-3 { bottom: 20%; left: 10%; animation-delay: 1.2s; }
    .idea-4 { bottom: 30%; right: 10%; animation-delay: 1.8s; }
    .idea-5 { top: 50%; left: 50%; transform: translate(-50%, -50%); animation-delay: 2.4s; }

    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-20px); }
    }

    /* Quick Stats */
    .quick-stats {
      margin-bottom: var(--space-2xl);
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: var(--space-lg);
    }

    .stat-card {
      background-color: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      padding: var(--space-lg);
      display: flex;
      align-items: center;
      gap: var(--space-md);
      transition: all var(--transition-base);
      animation: slideUp 0.6s ease;
    }

    .stat-card:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-elevated);
    }

    .stat-icon {
      font-size: 2rem;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .stat-number {
      font-size: var(--font-size-2xl);
      font-weight: var(--font-weight-bold);
      color: var(--color-primary);
    }

    .stat-label {
      font-size: var(--font-size-sm);
      color: var(--color-text-secondary);
      font-weight: var(--font-weight-medium);
    }

    /* Recent Ideas */
    .recent-ideas {
      margin-bottom: var(--space-2xl);
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-xl);
    }

    .section-header h2 {
      font-size: var(--font-size-2xl);
      font-weight: var(--font-weight-semibold);
    }

    .view-all-link {
      display: flex;
      align-items: center;
      gap: var(--space-sm);
      color: var(--color-primary);
      font-weight: var(--font-weight-medium);
      text-decoration: none;
      transition: all var(--transition-base);
    }

    .view-all-link:hover {
      transform: translateX(4px);
    }

    .ideas-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: var(--space-lg);
    }

    .idea-card {
      background-color: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      padding: var(--space-lg);
      cursor: pointer;
      transition: all var(--transition-base);
      text-decoration: none;
      color: inherit;
      animation: slideUp 0.6s ease;
    }

    .idea-card:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-elevated);
      border-color: var(--color-primary);
    }

    .idea-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-md);
    }

    .idea-category {
      display: flex;
      align-items: center;
      gap: var(--space-sm);
      font-size: var(--font-size-sm);
      color: var(--color-text-secondary);
    }

    .category-icon {
      font-size: 16px;
    }

    .favorite-btn {
      background: none;
      border: none;
      color: var(--color-text-secondary);
      cursor: pointer;
      padding: var(--space-xs);
      border-radius: 50%;
      transition: all var(--transition-base);
    }

    .favorite-btn:hover {
      background-color: var(--color-background);
      color: #ff6b6b;
    }

    .favorite-btn.active {
      color: #ff6b6b;
    }

    .idea-title {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-semibold);
      margin-bottom: var(--space-sm);
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .idea-description {
      color: var(--color-text-secondary);
      margin-bottom: var(--space-md);
      line-height: var(--line-height-relaxed);
    }

    .idea-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .idea-meta {
      display: flex;
      gap: var(--space-sm);
    }

    .priority,
    .status {
      padding: var(--space-xs) var(--space-sm);
      border-radius: var(--radius-full);
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-medium);
    }

    .priority-low { background-color: #e3f2fd; color: #1976d2; }
    .priority-medium { background-color: #fff3e0; color: #f57c00; }
    .priority-high { background-color: #fce4ec; color: #c2185b; }
    .priority-urgent { background-color: #ffebee; color: #d32f2f; }

    .status-draft { background-color: #f5f5f5; color: #757575; }
    .status-in_progress { background-color: #e8f5e8; color: #388e3c; }
    .status-completed { background-color: #e3f2fd; color: #1976d2; }
    .status-archived { background-color: #efebe9; color: #5d4037; }

    .idea-date {
      font-size: var(--font-size-xs);
      color: var(--color-text-secondary);
    }

    /* Features Section */
    .features {
      margin-bottom: var(--space-2xl);
    }

    .features h2 {
      text-align: center;
      font-size: var(--font-size-2xl);
      margin-bottom: var(--space-2xl);
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: var(--space-lg);
    }

    .feature-card {
      text-align: center;
      padding: var(--space-xl);
      background-color: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      transition: all var(--transition-base);
      animation: fadeIn 0.6s ease;
    }

    .feature-card:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-elevated);
    }

    .feature-icon {
      font-size: 3rem;
      margin-bottom: var(--space-md);
    }

    .feature-title {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-semibold);
      margin-bottom: var(--space-sm);
    }

    .feature-description {
      color: var(--color-text-secondary);
      line-height: var(--line-height-relaxed);
    }

    /* Call to Action */
    .cta {
      text-align: center;
      padding: var(--space-2xl);
      background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
      border-radius: var(--radius-xl);
      color: white;
    }

    .cta h2 {
      font-size: var(--font-size-2xl);
      margin-bottom: var(--space-md);
      color: white;
    }

    .cta-description {
      font-size: var(--font-size-lg);
      margin-bottom: var(--space-xl);
      opacity: 0.9;
    }

    .cta-button {
      background-color: white;
      color: var(--color-primary);
      padding: var(--space-md) var(--space-2xl);
      border: none;
      border-radius: var(--radius-lg);
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-semibold);
      display: inline-flex;
      align-items: center;
      gap: var(--space-sm);
      transition: all var(--transition-base);
    }

    .cta-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .home-container {
        padding: var(--space-md);
      }

      .hero {
        grid-template-columns: 1fr;
        text-align: center;
        gap: var(--space-xl);
      }

      .hero-actions {
        flex-direction: column;
        align-items: center;
      }

      .btn-primary,
      .btn-outline {
        width: 100%;
        max-width: 280px;
        justify-content: center;
      }

      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .ideas-grid {
        grid-template-columns: 1fr;
      }

      .features-grid {
        grid-template-columns: 1fr;
      }

      .section-header {
        flex-direction: column;
        gap: var(--space-md);
        text-align: center;
      }
    }

    @media (max-width: 480px) {
      .stats-grid {
        grid-template-columns: 1fr;
      }

      .stat-card {
        text-align: center;
        flex-direction: column;
        gap: var(--space-sm);
      }

      .hero-title {
        font-size: var(--font-size-2xl);
        flex-direction: column;
        gap: var(--space-sm);
      }
    }

    /* Accessibility */
    @media (prefers-reduced-motion: reduce) {
      .idea-bubble,
      .stat-card,
      .idea-card,
      .feature-card {
        animation: none;
      }

      .hero-icon {
        animation: none;
      }
    }
  `]
})
export class HomeComponent implements OnInit, OnDestroy {
  stats: IdeaStats | null = null;
  recentIdeas: Idea[] = [];
  statusEnum = Status;

  private destroy$ = new Subject<void>();

  constructor(
    private ideaService: IdeaService,
    private themeService: ThemeService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleFavorite(event: Event, ideaId: string): void {
    event.preventDefault();
    event.stopPropagation();
    
    this.ideaService.toggleFavorite(ideaId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.loadData();
      });
  }

  trackIdea(index: number, idea: Idea): string {
    return idea.id;
  }

  getPriorityLabel(priority: Priority): string {
    const labels = {
      [Priority.LOW]: 'Baja',
      [Priority.MEDIUM]: 'Media',
      [Priority.HIGH]: 'Alta',
      [Priority.URGENT]: 'Urgente'
    };
    return labels[priority];
  }

  getStatusLabel(status: Status): string {
    const labels = {
      [Status.DRAFT]: 'Borrador',
      [Status.IN_PROGRESS]: 'En Progreso',
      [Status.COMPLETED]: 'Completada',
      [Status.ARCHIVED]: 'Archivada'
    };
    return labels[status];
  }

  private loadData(): void {
    combineLatest([
      this.ideaService.getStats(),
      this.ideaService.getAllIdeas()
    ]).pipe(
      takeUntil(this.destroy$)
    ).subscribe(([stats, ideas]) => {
      this.stats = stats;
      this.recentIdeas = ideas
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .slice(0, 6);
    });
  }
}