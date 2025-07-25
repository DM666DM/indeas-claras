import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { ThemeService } from '@app/services/theme.service';
import { HeaderComponent } from '@app/components/header/header.component';
import { FooterComponent } from '@app/components/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent,
    FooterComponent
  ],
  template: `
    <div class="app-container" [class.loading]="isLoading">
      <!-- Skip to main content for accessibility -->
      <a href="#main-content" class="skip-link">Saltar al contenido principal</a>
      
      <!-- Header -->
      <app-header></app-header>
      
      <!-- Main Content -->
      <main id="main-content" class="main-content" role="main">
        <router-outlet></router-outlet>
      </main>
      
      <!-- Footer -->
      <app-footer></app-footer>
      
      <!-- Loading Overlay -->
      <div class="loading-overlay" *ngIf="isLoading">
        <div class="loading-spinner">
          <div class="spinner"></div>
          <p>Cargando...</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      background-color: var(--color-background);
      color: var(--color-text);
      transition: background-color 0.3s ease, color 0.3s ease;
    }
    
    .skip-link {
      position: absolute;
      top: -40px;
      left: 6px;
      background: var(--color-primary);
      color: white;
      padding: 8px;
      text-decoration: none;
      border-radius: 4px;
      z-index: 10000;
      transition: top 0.3s ease;
    }
    
    .skip-link:focus {
      top: 6px;
    }
    
    .main-content {
      flex: 1;
      width: 100%;
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
      animation: fadeIn 0.3s ease;
    }
    
    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    .loading-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      backdrop-filter: blur(4px);
    }
    
    .loading-spinner {
      text-align: center;
      color: white;
    }
    
    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid rgba(255, 255, 255, 0.3);
      border-top: 4px solid white;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 16px;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    /* Responsive Design */
    @media (max-width: 768px) {
      .main-content {
        padding: 16px;
      }
    }
    
    @media (max-width: 480px) {
      .main-content {
        padding: 12px;
      }
    }
    
    /* High contrast mode support */
    @media (prefers-contrast: high) {
      .app-container {
        border: 2px solid;
      }
      
      .skip-link {
        border: 2px solid;
      }
    }
    
    /* Print styles */
    @media print {
      .loading-overlay {
        display: none !important;
      }
      
      .main-content {
        padding: 0;
        max-width: none;
        animation: none;
      }
    }
    
    /* No animations for accessibility */
    .no-animations .main-content,
    .no-animations .loading-overlay,
    .no-animations .spinner {
      animation: none !important;
      transition: none !important;
    }
  `]
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Ideas Claras';
  isLoading = false;
  private destroy$ = new Subject<void>();

  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    this.initializeTheme();
    this.setupAccessibility();
    this.hideInitialLoadingScreen();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeTheme(): void {
    // Theme service will automatically apply the theme
    this.themeService.getCurrentTheme()
      .pipe(takeUntil(this.destroy$))
      .subscribe(theme => {
        // Theme is automatically applied by the service
        console.log('Current theme:', theme.displayName);
      });
  }

  private setupAccessibility(): void {
    // Set up keyboard navigation
    document.addEventListener('keydown', this.handleKeydown.bind(this));
    
    // Set up focus management
    this.setupFocusManagement();
    
    // Announce route changes to screen readers
    this.announceRouteChanges();
  }

  private handleKeydown(event: KeyboardEvent): void {
    // Handle common keyboard shortcuts
    if (event.altKey && event.key === '1') {
      // Alt+1: Focus main content
      event.preventDefault();
      const mainContent = document.getElementById('main-content');
      if (mainContent) {
        mainContent.focus();
      }
    }
  }

  private setupFocusManagement(): void {
    // Ensure focus is properly managed during navigation
    const observer = new MutationObserver(() => {
      const activeElement = document.activeElement;
      if (!activeElement || activeElement === document.body) {
        const firstFocusable = document.querySelector(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        ) as HTMLElement;
        if (firstFocusable) {
          firstFocusable.focus();
        }
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  private announceRouteChanges(): void {
    // Create a live region for announcing route changes
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    liveRegion.style.position = 'absolute';
    liveRegion.style.left = '-10000px';
    liveRegion.style.width = '1px';
    liveRegion.style.height = '1px';
    liveRegion.style.overflow = 'hidden';
    document.body.appendChild(liveRegion);

    // Listen for route changes and announce them
    // This would be implemented with router events in a real application
  }

  private hideInitialLoadingScreen(): void {
    // Hide the initial loading screen after a short delay
    setTimeout(() => {
      const loadingScreen = document.getElementById('loading-screen');
      if (loadingScreen) {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
          loadingScreen.style.display = 'none';
        }, 300);
      }
    }, 500);
  }
}