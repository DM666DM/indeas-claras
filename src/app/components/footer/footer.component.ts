import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { IdeaService } from '@app/services/idea.service';
import { ThemeService } from '@app/services/theme.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <footer class="footer" role="contentinfo">
      <div class="footer-container">
        <!-- Main Footer Content -->
        <div class="footer-content">
          <!-- Brand Section -->
          <div class="footer-section brand-section">
            <div class="footer-brand">
              <span class="brand-icon">💡</span>
              <span class="brand-text">Ideas Claras</span>
            </div>
            <p class="footer-description">
              Organiza y gestiona tus ideas de forma clara y eficiente. 
              Convierte tus pensamientos en proyectos exitosos.
            </p>
            <div class="social-links">
              <a href="https://github.com/ideas-claras" target="_blank" rel="noopener noreferrer" class="social-link" aria-label="GitHub">
                <span class="material-icons">code</span>
              </a>
              <a href="https://twitter.com/ideas_claras" target="_blank" rel="noopener noreferrer" class="social-link" aria-label="Twitter">
                <span class="material-icons">alternate_email</span>
              </a>
              <a href="mailto:contacto@ideas-claras.app" class="social-link" aria-label="Email">
                <span class="material-icons">email</span>
              </a>
            </div>
          </div>

          <!-- Navigation Links -->
          <div class="footer-section">
            <h3 class="footer-title">Navegación</h3>
            <ul class="footer-links">
              <li><a routerLink="/home" class="footer-link">Inicio</a></li>
              <li><a routerLink="/ideas" class="footer-link">Mis Ideas</a></li>
              <li><a routerLink="/favorites" class="footer-link">Favoritas</a></li>
              <li><a routerLink="/categories" class="footer-link">Categorías</a></li>
              <li><a routerLink="/search" class="footer-link">Buscar</a></li>
            </ul>
          </div>

          <!-- Tools & Features -->
          <div class="footer-section">
            <h3 class="footer-title">Herramientas</h3>
            <ul class="footer-links">
              <li><a routerLink="/ideas/new" class="footer-link">Nueva Idea</a></li>
              <li><a routerLink="/stats" class="footer-link">Estadísticas</a></li>
              <li><button (click)="exportIdeas()" class="footer-link-button">Exportar JSON</button></li>
              <li><button (click)="exportCSV()" class="footer-link-button">Exportar CSV</button></li>
              <li><a routerLink="/settings" class="footer-link">Configuración</a></li>
            </ul>
          </div>

          <!-- Support & Info -->
          <div class="footer-section">
            <h3 class="footer-title">Soporte</h3>
            <ul class="footer-links">
              <li><a routerLink="/help" class="footer-link">Centro de Ayuda</a></li>
              <li><a routerLink="/about" class="footer-link">Acerca de</a></li>
              <li><a href="https://github.com/ideas-claras/app/issues" target="_blank" rel="noopener noreferrer" class="footer-link">Reportar Error</a></li>
              <li><a href="https://github.com/ideas-claras/app/discussions" target="_blank" rel="noopener noreferrer" class="footer-link">Sugerencias</a></li>
              <li><button (click)="resetData()" class="footer-link-button danger">Restablecer Datos</button></li>
            </ul>
          </div>
        </div>

        <!-- Footer Bottom -->
        <div class="footer-bottom">
          <div class="footer-info">
            <p class="copyright">
              © {{ currentYear }} Ideas Claras. Hecho con ❤️ para la comunidad.
            </p>
            <p class="tech-info">
              Desarrollado con Angular {{ angularVersion }} • PWA • Open Source
            </p>
          </div>
          <div class="footer-links-bottom">
            <a href="#" class="footer-link-small">Privacidad</a>
            <span class="separator">•</span>
            <a href="#" class="footer-link-small">Términos</a>
            <span class="separator">•</span>
            <a href="https://github.com/ideas-claras/app" target="_blank" rel="noopener noreferrer" class="footer-link-small">Código</a>
            <span class="separator">•</span>
            <button (click)="toggleTheme()" class="footer-link-small theme-toggle">
              <span class="material-icons">{{ currentThemeIcon }}</span>
              Cambiar Tema
            </button>
          </div>
        </div>

        <!-- PWA Install Banner -->
        <div class="pwa-banner" *ngIf="showPWABanner">
          <div class="pwa-content">
            <span class="material-icons pwa-icon">get_app</span>
            <div class="pwa-text">
              <strong>¡Instala Ideas Claras!</strong>
              <span>Accede desde tu escritorio sin navegador</span>
            </div>
            <button class="pwa-install-btn" (click)="installPWA()">Instalar</button>
            <button class="pwa-dismiss-btn" (click)="dismissPWA()" aria-label="Cerrar">
              <span class="material-icons">close</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background-color: var(--color-surface);
      border-top: 1px solid var(--color-border);
      margin-top: auto;
      color: var(--color-text);
    }

    .footer-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: var(--space-2xl) var(--space-lg) var(--space-lg);
      position: relative;
    }

    .footer-content {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 1fr;
      gap: var(--space-2xl);
      margin-bottom: var(--space-2xl);
    }

    .footer-section {
      display: flex;
      flex-direction: column;
    }

    /* Brand Section */
    .brand-section {
      max-width: 350px;
    }

    .footer-brand {
      display: flex;
      align-items: center;
      gap: var(--space-sm);
      font-size: var(--font-size-xl);
      font-weight: var(--font-weight-semibold);
      margin-bottom: var(--space-md);
      color: var(--color-text);
    }

    .brand-icon {
      font-size: 1.5rem;
    }

    .footer-description {
      color: var(--color-text-secondary);
      line-height: var(--line-height-relaxed);
      margin-bottom: var(--space-lg);
    }

    .social-links {
      display: flex;
      gap: var(--space-sm);
    }

    .social-link {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background-color: var(--color-background);
      color: var(--color-text-secondary);
      text-decoration: none;
      transition: all var(--transition-base);
      border: 1px solid var(--color-border);
    }

    .social-link:hover {
      background-color: var(--color-primary);
      color: white;
      transform: translateY(-2px);
      box-shadow: var(--shadow-base);
    }

    /* Footer Sections */
    .footer-title {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-semibold);
      margin-bottom: var(--space-md);
      color: var(--color-text);
    }

    .footer-links {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: var(--space-sm);
    }

    .footer-link {
      color: var(--color-text-secondary);
      text-decoration: none;
      transition: color var(--transition-base);
      font-size: var(--font-size-sm);
      padding: var(--space-xs) 0;
    }

    .footer-link:hover {
      color: var(--color-primary);
    }

    .footer-link-button {
      background: none;
      border: none;
      color: var(--color-text-secondary);
      text-align: left;
      cursor: pointer;
      transition: color var(--transition-base);
      font-size: var(--font-size-sm);
      padding: var(--space-xs) 0;
    }

    .footer-link-button:hover {
      color: var(--color-primary);
    }

    .footer-link-button.danger:hover {
      color: #dc3545;
    }

    /* Footer Bottom */
    .footer-bottom {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: var(--space-lg);
      border-top: 1px solid var(--color-border);
      flex-wrap: wrap;
      gap: var(--space-md);
    }

    .footer-info {
      display: flex;
      flex-direction: column;
      gap: var(--space-xs);
    }

    .copyright,
    .tech-info {
      margin: 0;
      font-size: var(--font-size-sm);
      color: var(--color-text-secondary);
    }

    .footer-links-bottom {
      display: flex;
      align-items: center;
      gap: var(--space-sm);
      flex-wrap: wrap;
    }

    .footer-link-small {
      font-size: var(--font-size-xs);
      color: var(--color-text-secondary);
      text-decoration: none;
      transition: color var(--transition-base);
      background: none;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: var(--space-xs);
    }

    .footer-link-small:hover {
      color: var(--color-primary);
    }

    .separator {
      color: var(--color-text-secondary);
      font-size: var(--font-size-xs);
    }

    .theme-toggle {
      display: flex;
      align-items: center;
      gap: var(--space-xs);
    }

    .theme-toggle .material-icons {
      font-size: 14px;
    }

    /* PWA Banner */
    .pwa-banner {
      position: fixed;
      bottom: var(--space-lg);
      left: var(--space-lg);
      right: var(--space-lg);
      background-color: var(--color-surface);
      border: 2px solid var(--color-primary);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-elevated);
      z-index: var(--z-toast);
      animation: slideUp 0.3s ease;
    }

    .pwa-content {
      display: flex;
      align-items: center;
      gap: var(--space-md);
      padding: var(--space-md);
    }

    .pwa-icon {
      color: var(--color-primary);
      font-size: 24px;
    }

    .pwa-text {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: var(--space-xs);
    }

    .pwa-text strong {
      font-weight: var(--font-weight-semibold);
      color: var(--color-text);
    }

    .pwa-text span {
      font-size: var(--font-size-sm);
      color: var(--color-text-secondary);
    }

    .pwa-install-btn {
      background-color: var(--color-primary);
      color: white;
      border: none;
      padding: var(--space-sm) var(--space-md);
      border-radius: var(--radius-md);
      font-weight: var(--font-weight-medium);
      cursor: pointer;
      transition: all var(--transition-base);
    }

    .pwa-install-btn:hover {
      opacity: 0.9;
      transform: translateY(-1px);
    }

    .pwa-dismiss-btn {
      background: none;
      border: none;
      color: var(--color-text-secondary);
      cursor: pointer;
      padding: var(--space-xs);
      border-radius: 50%;
      transition: all var(--transition-base);
    }

    .pwa-dismiss-btn:hover {
      background-color: var(--color-background);
      color: var(--color-text);
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .footer-container {
        padding: var(--space-xl) var(--space-md) var(--space-md);
      }

      .footer-content {
        grid-template-columns: 1fr;
        gap: var(--space-xl);
      }

      .brand-section {
        max-width: none;
        text-align: center;
      }

      .footer-bottom {
        flex-direction: column;
        text-align: center;
        gap: var(--space-md);
      }

      .footer-links-bottom {
        justify-content: center;
      }

      .pwa-banner {
        left: var(--space-sm);
        right: var(--space-sm);
        bottom: var(--space-sm);
      }

      .pwa-content {
        flex-direction: column;
        text-align: center;
        gap: var(--space-sm);
      }

      .pwa-text {
        text-align: center;
      }
    }

    @media (max-width: 480px) {
      .footer-content {
        gap: var(--space-lg);
      }

      .footer-links-bottom {
        flex-direction: column;
        gap: var(--space-xs);
      }

      .separator {
        display: none;
      }

      .social-links {
        justify-content: center;
      }
    }

    /* Print styles */
    @media print {
      .footer {
        border-top: 1px solid #000;
        background: none;
      }

      .pwa-banner,
      .social-links {
        display: none;
      }

      .footer-link-button {
        display: none;
      }
    }

    /* High contrast mode */
    @media (prefers-contrast: high) {
      .social-link {
        border-width: 2px;
      }

      .pwa-banner {
        border-width: 3px;
      }
    }

    /* Accessibility */
    @media (prefers-reduced-motion: reduce) {
      .pwa-banner {
        animation: none;
      }

      .social-link:hover,
      .pwa-install-btn:hover {
        transform: none;
      }
    }
  `]
})
export class FooterComponent implements OnInit {
  currentYear = new Date().getFullYear();
  angularVersion = '17';
  showPWABanner = false;
  currentThemeIcon = 'light_mode';
  
  private deferredPrompt: any;

  constructor(
    private ideaService: IdeaService,
    private themeService: ThemeService
  ) {}

  ngOnInit(): void {
    this.setupPWA();
    this.initializeTheme();
  }

  exportIdeas(): void {
    this.ideaService.exportIdeas();
  }

  exportCSV(): void {
    this.ideaService.exportIdeasAsCSV();
  }

  resetData(): void {
    if (confirm('¿Estás seguro de que quieres eliminar todos los datos? Esta acción no se puede deshacer.')) {
      localStorage.removeItem('ideas-claras-data');
      localStorage.removeItem('ideas-claras-theme');
      window.location.reload();
    }
  }

  toggleTheme(): void {
    this.themeService.getSettings().subscribe(settings => {
      const nextMode = this.getNextThemeMode(settings.mode);
      this.themeService.setThemeMode(nextMode);
    });
  }

  installPWA(): void {
    if (this.deferredPrompt) {
      this.deferredPrompt.prompt();
      this.deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('PWA installed');
        }
        this.deferredPrompt = null;
        this.showPWABanner = false;
      });
    }
  }

  dismissPWA(): void {
    this.showPWABanner = false;
    localStorage.setItem('pwa-dismissed', 'true');
  }

  private setupPWA(): void {
    // Check if PWA is already dismissed
    const dismissed = localStorage.getItem('pwa-dismissed');
    if (dismissed) {
      return;
    }

    // Listen for the beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      
      // Check if the app is already installed
      if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
        return;
      }
      
      // Show the PWA banner after a delay
      setTimeout(() => {
        this.showPWABanner = true;
      }, 5000);
    });

    // Listen for the app being installed
    window.addEventListener('appinstalled', () => {
      console.log('PWA was installed');
      this.showPWABanner = false;
      this.deferredPrompt = null;
    });
  }

  private initializeTheme(): void {
    this.themeService.getSettings().subscribe(settings => {
      this.currentThemeIcon = this.getThemeIcon(settings.mode);
    });
  }

  private getThemeIcon(mode: any): string {
    switch (mode) {
      case 'light':
        return 'light_mode';
      case 'dark':
        return 'dark_mode';
      case 'auto':
        return 'brightness_auto';
      default:
        return 'light_mode';
    }
  }

  private getNextThemeMode(currentMode: any): any {
    switch (currentMode) {
      case 'light':
        return 'dark';
      case 'dark':
        return 'auto';
      case 'auto':
        return 'light';
      default:
        return 'dark';
    }
  }
}