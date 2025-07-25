import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';

import { ThemeService } from '@app/services/theme.service';
import { IdeaService } from '@app/services/idea.service';
import { ThemeMode } from '@app/models/theme.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <header class="header" role="banner">
      <div class="header-container">
        <!-- Logo and Brand -->
        <div class="brand">
          <a routerLink="/home" class="brand-link" aria-label="Ideas Claras - Ir al inicio">
            <span class="brand-icon">💡</span>
            <span class="brand-text">Ideas Claras</span>
          </a>
        </div>

        <!-- Search Bar (Desktop) -->
        <div class="search-container" [class.active]="showMobileSearch">
          <div class="search-input-wrapper">
            <span class="search-icon material-icons" aria-hidden="true">search</span>
            <input
              type="search"
              class="search-input"
              placeholder="Buscar ideas..."
              [(ngModel)]="searchQuery"
              (focus)="onSearchFocus()"
              (blur)="onSearchBlur()"
              aria-label="Buscar ideas"
              autocomplete="off"
            >
            <button
              *ngIf="searchQuery"
              class="search-clear"
              (click)="clearSearch()"
              aria-label="Limpiar búsqueda"
              type="button"
            >
              <span class="material-icons">close</span>
            </button>
          </div>
          
          <!-- Search Suggestions -->
          <div class="search-suggestions" *ngIf="showSuggestions && searchSuggestions.length > 0">
            <div class="suggestion-group">
              <div class="suggestion-title">Ideas recientes</div>
              <button
                *ngFor="let suggestion of searchSuggestions; trackBy: trackSuggestion"
                class="suggestion-item"
                (click)="selectSuggestion(suggestion)"
                type="button"
              >
                <span class="suggestion-icon">{{ suggestion.category.icon }}</span>
                <span class="suggestion-text">{{ suggestion.title }}</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Navigation -->
        <nav class="navigation" role="navigation" aria-label="Navegación principal">
          <!-- Desktop Navigation -->
          <ul class="nav-list desktop-nav">
            <li class="nav-item">
              <a routerLink="/ideas" routerLinkActive="active" class="nav-link">
                <span class="material-icons nav-icon">lightbulb</span>
                <span class="nav-text">Mis Ideas</span>
              </a>
            </li>
            <li class="nav-item">
              <a routerLink="/favorites" routerLinkActive="active" class="nav-link">
                <span class="material-icons nav-icon">favorite</span>
                <span class="nav-text">Favoritas</span>
              </a>
            </li>
            <li class="nav-item">
              <a routerLink="/categories" routerLinkActive="active" class="nav-link">
                <span class="material-icons nav-icon">category</span>
                <span class="nav-text">Categorías</span>
              </a>
            </li>
          </ul>

          <!-- Action Buttons -->
          <div class="action-buttons">
            <!-- Search Toggle (Mobile) -->
            <button
              class="action-btn mobile-search-toggle"
              (click)="toggleMobileSearch()"
              [attr.aria-label]="showMobileSearch ? 'Cerrar búsqueda' : 'Abrir búsqueda'"
              [attr.aria-expanded]="showMobileSearch"
              type="button"
            >
              <span class="material-icons">{{ showMobileSearch ? 'close' : 'search' }}</span>
            </button>

            <!-- Theme Toggle -->
            <button
              class="action-btn theme-toggle"
              (click)="toggleTheme()"
              [attr.aria-label]="'Cambiar a tema ' + getNextThemeLabel()"
              title="Cambiar tema"
              type="button"
            >
              <span class="material-icons">{{ getThemeIcon() }}</span>
            </button>

            <!-- New Idea Button -->
            <button
              class="action-btn new-idea-btn"
              routerLink="/ideas/new"
              aria-label="Crear nueva idea"
              title="Nueva idea"
              type="button"
            >
              <span class="material-icons">add</span>
              <span class="btn-text">Nueva</span>
            </button>

            <!-- Menu Toggle (Mobile) -->
            <button
              class="action-btn menu-toggle"
              (click)="toggleMobileMenu()"
              [attr.aria-label]="showMobileMenu ? 'Cerrar menú' : 'Abrir menú'"
              [attr.aria-expanded]="showMobileMenu"
              type="button"
            >
              <span class="material-icons">{{ showMobileMenu ? 'close' : 'menu' }}</span>
            </button>
          </div>
        </nav>

        <!-- Mobile Menu -->
        <div class="mobile-menu" [class.active]="showMobileMenu" role="menu">
          <ul class="mobile-nav-list">
            <li class="mobile-nav-item">
              <a routerLink="/ideas" routerLinkActive="active" class="mobile-nav-link" (click)="closeMobileMenu()">
                <span class="material-icons">lightbulb</span>
                <span>Mis Ideas</span>
              </a>
            </li>
            <li class="mobile-nav-item">
              <a routerLink="/favorites" routerLinkActive="active" class="mobile-nav-link" (click)="closeMobileMenu()">
                <span class="material-icons">favorite</span>
                <span>Favoritas</span>
              </a>
            </li>
            <li class="mobile-nav-item">
              <a routerLink="/categories" routerLinkActive="active" class="mobile-nav-link" (click)="closeMobileMenu()">
                <span class="material-icons">category</span>
                <span>Categorías</span>
              </a>
            </li>
            <li class="mobile-nav-item">
              <a routerLink="/stats" routerLinkActive="active" class="mobile-nav-link" (click)="closeMobileMenu()">
                <span class="material-icons">analytics</span>
                <span>Estadísticas</span>
              </a>
            </li>
            <li class="mobile-nav-item">
              <a routerLink="/settings" routerLinkActive="active" class="mobile-nav-link" (click)="closeMobileMenu()">
                <span class="material-icons">settings</span>
                <span>Configuración</span>
              </a>
            </li>
            <li class="mobile-nav-item">
              <a routerLink="/help" routerLinkActive="active" class="mobile-nav-link" (click)="closeMobileMenu()">
                <span class="material-icons">help</span>
                <span>Ayuda</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .header {
      background-color: var(--color-surface);
      border-bottom: 1px solid var(--color-border);
      box-shadow: var(--shadow-base);
      position: sticky;
      top: 0;
      z-index: 1000;
      transition: all 0.3s ease;
    }

    .header-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 64px;
      position: relative;
    }

    /* Brand */
    .brand {
      flex-shrink: 0;
    }

    .brand-link {
      display: flex;
      align-items: center;
      text-decoration: none;
      color: var(--color-text);
      font-weight: 600;
      font-size: 20px;
      transition: color 0.2s ease;
    }

    .brand-link:hover {
      color: var(--color-primary);
    }

    .brand-icon {
      font-size: 24px;
      margin-right: 8px;
    }

    .brand-text {
      font-family: 'Inter', sans-serif;
    }

    /* Search */
    .search-container {
      flex: 1;
      max-width: 500px;
      margin: 0 40px;
      position: relative;
    }

    .search-input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
    }

    .search-input {
      width: 100%;
      padding: 12px 16px 12px 48px;
      border: 2px solid var(--color-border);
      border-radius: 25px;
      background-color: var(--color-background);
      color: var(--color-text);
      font-size: 14px;
      transition: all 0.2s ease;
      outline: none;
    }

    .search-input:focus {
      border-color: var(--color-primary);
      box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
    }

    .search-icon {
      position: absolute;
      left: 16px;
      color: var(--color-text-secondary);
      font-size: 20px;
      pointer-events: none;
    }

    .search-clear {
      position: absolute;
      right: 16px;
      background: none;
      border: none;
      color: var(--color-text-secondary);
      cursor: pointer;
      padding: 4px;
      border-radius: 50%;
      transition: all 0.2s ease;
    }

    .search-clear:hover {
      background-color: var(--color-border);
      color: var(--color-text);
    }

    /* Search Suggestions */
    .search-suggestions {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background-color: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: 12px;
      box-shadow: var(--shadow-elevated);
      margin-top: 8px;
      max-height: 300px;
      overflow-y: auto;
      z-index: 1001;
    }

    .suggestion-group {
      padding: 12px 0;
    }

    .suggestion-title {
      padding: 8px 16px;
      font-size: 12px;
      font-weight: 500;
      color: var(--color-text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .suggestion-item {
      width: 100%;
      padding: 12px 16px;
      background: none;
      border: none;
      text-align: left;
      color: var(--color-text);
      cursor: pointer;
      transition: background-color 0.2s ease;
      display: flex;
      align-items: center;
    }

    .suggestion-item:hover {
      background-color: var(--color-background);
    }

    .suggestion-icon {
      margin-right: 12px;
      font-size: 16px;
    }

    .suggestion-text {
      font-size: 14px;
    }

    /* Navigation */
    .navigation {
      display: flex;
      align-items: center;
      gap: 20px;
    }

    .nav-list {
      display: flex;
      list-style: none;
      margin: 0;
      padding: 0;
      gap: 8px;
    }

    .nav-item {
      position: relative;
    }

    .nav-link {
      display: flex;
      align-items: center;
      padding: 8px 16px;
      color: var(--color-text);
      text-decoration: none;
      border-radius: 8px;
      transition: all 0.2s ease;
      font-size: 14px;
      font-weight: 500;
    }

    .nav-link:hover {
      background-color: var(--color-background);
      color: var(--color-primary);
    }

    .nav-link.active {
      background-color: var(--color-primary);
      color: white;
    }

    .nav-icon {
      margin-right: 8px;
      font-size: 18px;
    }

    /* Action Buttons */
    .action-buttons {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .action-btn {
      display: flex;
      align-items: center;
      padding: 10px;
      background: none;
      border: none;
      color: var(--color-text);
      cursor: pointer;
      border-radius: 8px;
      transition: all 0.2s ease;
      text-decoration: none;
    }

    .action-btn:hover {
      background-color: var(--color-background);
      color: var(--color-primary);
    }

    .new-idea-btn {
      background-color: var(--color-primary);
      color: white;
      padding: 10px 16px;
      font-weight: 500;
    }

    .new-idea-btn:hover {
      background-color: var(--color-primary);
      opacity: 0.9;
      color: white;
    }

    .btn-text {
      margin-left: 8px;
      font-size: 14px;
    }

    /* Mobile Menu */
    .mobile-menu {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background-color: var(--color-surface);
      border: 1px solid var(--color-border);
      border-top: none;
      box-shadow: var(--shadow-elevated);
      transform: translateY(-10px);
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease;
    }

    .mobile-menu.active {
      transform: translateY(0);
      opacity: 1;
      visibility: visible;
    }

    .mobile-nav-list {
      list-style: none;
      margin: 0;
      padding: 12px 0;
    }

    .mobile-nav-item {
      border-bottom: 1px solid var(--color-border);
    }

    .mobile-nav-item:last-child {
      border-bottom: none;
    }

    .mobile-nav-link {
      display: flex;
      align-items: center;
      padding: 16px 20px;
      color: var(--color-text);
      text-decoration: none;
      transition: all 0.2s ease;
    }

    .mobile-nav-link:hover {
      background-color: var(--color-background);
      color: var(--color-primary);
    }

    .mobile-nav-link.active {
      background-color: var(--color-primary);
      color: white;
    }

    .mobile-nav-link .material-icons {
      margin-right: 16px;
      font-size: 20px;
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .header-container {
        padding: 0 16px;
        height: 56px;
      }

      .brand-text {
        display: none;
      }

      .search-container {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        margin: 0;
        max-width: none;
        background-color: var(--color-surface);
        padding: 16px;
        border-bottom: 1px solid var(--color-border);
        transform: translateY(-10px);
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
      }

      .search-container.active {
        transform: translateY(0);
        opacity: 1;
        visibility: visible;
      }

      .desktop-nav {
        display: none;
      }

      .mobile-search-toggle {
        display: flex;
      }

      .menu-toggle {
        display: flex;
      }

      .btn-text {
        display: none;
      }
    }

    @media (min-width: 769px) {
      .mobile-search-toggle,
      .menu-toggle {
        display: none;
      }
    }

    /* Accessibility */
    @media (prefers-reduced-motion: reduce) {
      .header,
      .search-input,
      .nav-link,
      .action-btn,
      .mobile-menu {
        transition: none;
      }
    }

    /* High contrast mode */
    @media (prefers-contrast: high) {
      .nav-link.active {
        border: 2px solid;
      }
      
      .new-idea-btn {
        border: 2px solid;
      }
    }
  `]
})
export class HeaderComponent implements OnInit, OnDestroy {
  searchQuery = '';
  showSuggestions = false;
  showMobileMenu = false;
  showMobileSearch = false;
  searchSuggestions: any[] = [];
  currentTheme: ThemeMode = ThemeMode.LIGHT;

  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<string>();

  constructor(
    private themeService: ThemeService,
    private ideaService: IdeaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeTheme();
    this.setupSearch();
    this.setupKeyboardShortcuts();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Theme methods
  toggleTheme(): void {
    const nextMode = this.getNextThemeMode();
    this.themeService.setThemeMode(nextMode);
  }

  getThemeIcon(): string {
    switch (this.currentTheme) {
      case ThemeMode.LIGHT:
        return 'light_mode';
      case ThemeMode.DARK:
        return 'dark_mode';
      case ThemeMode.AUTO:
        return 'brightness_auto';
      default:
        return 'light_mode';
    }
  }

  getNextThemeLabel(): string {
    switch (this.currentTheme) {
      case ThemeMode.LIGHT:
        return 'oscuro';
      case ThemeMode.DARK:
        return 'automático';
      case ThemeMode.AUTO:
        return 'claro';
      default:
        return 'oscuro';
    }
  }

  // Search methods
  onSearchFocus(): void {
    this.showSuggestions = true;
    this.loadSuggestions();
  }

  onSearchBlur(): void {
    // Delay hiding suggestions to allow clicking on them
    setTimeout(() => {
      this.showSuggestions = false;
    }, 200);
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.showSuggestions = false;
  }

  selectSuggestion(suggestion: any): void {
    this.router.navigate(['/ideas', suggestion.id]);
    this.showSuggestions = false;
    this.searchQuery = '';
  }

  trackSuggestion(index: number, suggestion: any): string {
    return suggestion.id;
  }

  // Mobile menu methods
  toggleMobileMenu(): void {
    this.showMobileMenu = !this.showMobileMenu;
    this.showMobileSearch = false;
  }

  closeMobileMenu(): void {
    this.showMobileMenu = false;
  }

  toggleMobileSearch(): void {
    this.showMobileSearch = !this.showMobileSearch;
    this.showMobileMenu = false;
  }

  // Private methods
  private initializeTheme(): void {
    this.themeService.getSettings()
      .pipe(takeUntil(this.destroy$))
      .subscribe(settings => {
        this.currentTheme = settings.mode;
      });
  }

  private setupSearch(): void {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(query => {
      if (query.trim()) {
        this.router.navigate(['/search'], { queryParams: { q: query } });
      }
    });

    // Watch for search query changes
    this.searchSubject.next(this.searchQuery);
  }

  private loadSuggestions(): void {
    this.ideaService.getAllIdeas()
      .pipe(takeUntil(this.destroy$))
      .subscribe(ideas => {
        this.searchSuggestions = ideas
          .slice(0, 5)
          .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      });
  }

  private getNextThemeMode(): ThemeMode {
    switch (this.currentTheme) {
      case ThemeMode.LIGHT:
        return ThemeMode.DARK;
      case ThemeMode.DARK:
        return ThemeMode.AUTO;
      case ThemeMode.AUTO:
        return ThemeMode.LIGHT;
      default:
        return ThemeMode.DARK;
    }
  }

  private setupKeyboardShortcuts(): void {
    document.addEventListener('keydown', (event) => {
      // Ctrl/Cmd + K for search
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        const searchInput = document.querySelector('.search-input') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        }
      }

      // Escape to close mobile menu/search
      if (event.key === 'Escape') {
        this.showMobileMenu = false;
        this.showMobileSearch = false;
        this.showSuggestions = false;
      }
    });
  }
}