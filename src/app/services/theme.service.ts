import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Theme, ThemeMode, ThemeSettings } from '@app/models/theme.model';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly STORAGE_KEY = 'ideas-claras-theme';
  
  private defaultLightTheme: Theme = {
    name: 'light',
    displayName: 'Claro',
    primary: '#007bff',
    secondary: '#6c757d',
    background: '#ffffff',
    surface: '#f8f9fa',
    text: '#212529',
    textSecondary: '#6c757d',
    border: '#dee2e6',
    shadow: 'rgba(0, 0, 0, 0.1)'
  };

  private defaultDarkTheme: Theme = {
    name: 'dark',
    displayName: 'Oscuro',
    primary: '#0d6efd',
    secondary: '#6c757d',
    background: '#121212',
    surface: '#1e1e1e',
    text: '#ffffff',
    textSecondary: '#adb5bd',
    border: '#343a40',
    shadow: 'rgba(0, 0, 0, 0.3)'
  };

  private defaultSettings: ThemeSettings = {
    mode: ThemeMode.LIGHT,
    animations: true,
    reducedMotion: false
  };

  private settingsSubject = new BehaviorSubject<ThemeSettings>(this.defaultSettings);
  private currentThemeSubject = new BehaviorSubject<Theme>(this.defaultLightTheme);

  public settings$ = this.settingsSubject.asObservable();
  public currentTheme$ = this.currentThemeSubject.asObservable();

  constructor() {
    this.loadSettings();
    this.initializeTheme();
    this.listenToSystemTheme();
  }

  getCurrentTheme(): Observable<Theme> {
    return this.currentTheme$;
  }

  getSettings(): Observable<ThemeSettings> {
    return this.settings$;
  }

  setThemeMode(mode: ThemeMode): void {
    const currentSettings = this.settingsSubject.value;
    const newSettings = { ...currentSettings, mode };
    this.settingsSubject.next(newSettings);
    this.saveSettings();
    this.updateTheme();
  }

  setCustomTheme(theme: Theme): void {
    const currentSettings = this.settingsSubject.value;
    const newSettings = { ...currentSettings, customTheme: theme };
    this.settingsSubject.next(newSettings);
    this.saveSettings();
    this.currentThemeSubject.next(theme);
    this.applyTheme(theme);
  }

  toggleAnimations(): void {
    const currentSettings = this.settingsSubject.value;
    const newSettings = { ...currentSettings, animations: !currentSettings.animations };
    this.settingsSubject.next(newSettings);
    this.saveSettings();
    this.updateAnimationSettings();
  }

  setReducedMotion(enabled: boolean): void {
    const currentSettings = this.settingsSubject.value;
    const newSettings = { ...currentSettings, reducedMotion: enabled };
    this.settingsSubject.next(newSettings);
    this.saveSettings();
    this.updateAnimationSettings();
  }

  resetToDefaults(): void {
    this.settingsSubject.next(this.defaultSettings);
    this.saveSettings();
    this.updateTheme();
  }

  exportTheme(): string {
    const currentTheme = this.currentThemeSubject.value;
    return JSON.stringify(currentTheme, null, 2);
  }

  importTheme(themeJson: string): boolean {
    try {
      const theme: Theme = JSON.parse(themeJson);
      
      // Validate theme structure
      const requiredFields = ['name', 'displayName', 'primary', 'secondary', 'background', 'surface', 'text', 'textSecondary', 'border', 'shadow'];
      const hasAllFields = requiredFields.every(field => field in theme);
      
      if (!hasAllFields) {
        throw new Error('Invalid theme structure');
      }
      
      this.setCustomTheme(theme);
      return true;
    } catch (error) {
      console.error('Error importing theme:', error);
      return false;
    }
  }

  private loadSettings(): void {
    try {
      const savedSettings = localStorage.getItem(this.STORAGE_KEY);
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        this.settingsSubject.next({ ...this.defaultSettings, ...settings });
      }
    } catch (error) {
      console.error('Error loading theme settings:', error);
    }
  }

  private saveSettings(): void {
    try {
      const settings = this.settingsSubject.value;
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving theme settings:', error);
    }
  }

  private initializeTheme(): void {
    this.updateTheme();
    this.updateAnimationSettings();
  }

  private updateTheme(): void {
    const settings = this.settingsSubject.value;
    let theme: Theme;

    if (settings.customTheme) {
      theme = settings.customTheme;
    } else {
      switch (settings.mode) {
        case ThemeMode.DARK:
          theme = this.defaultDarkTheme;
          break;
        case ThemeMode.LIGHT:
          theme = this.defaultLightTheme;
          break;
        case ThemeMode.AUTO:
          theme = this.getSystemPreferredTheme();
          break;
        default:
          theme = this.defaultLightTheme;
      }
    }

    this.currentThemeSubject.next(theme);
    this.applyTheme(theme);
  }

  private applyTheme(theme: Theme): void {
    const root = document.documentElement;
    
    // Apply CSS custom properties
    root.style.setProperty('--color-primary', theme.primary);
    root.style.setProperty('--color-secondary', theme.secondary);
    root.style.setProperty('--color-background', theme.background);
    root.style.setProperty('--color-surface', theme.surface);
    root.style.setProperty('--color-text', theme.text);
    root.style.setProperty('--color-text-secondary', theme.textSecondary);
    root.style.setProperty('--color-border', theme.border);
    root.style.setProperty('--shadow-base', `0 2px 4px ${theme.shadow}`);
    root.style.setProperty('--shadow-elevated', `0 4px 8px ${theme.shadow}`);

    // Update body class for theme-specific styles
    document.body.classList.remove('theme-light', 'theme-dark');
    document.body.classList.add(`theme-${theme.name}`);

    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', theme.primary);
    }
  }

  private updateAnimationSettings(): void {
    const settings = this.settingsSubject.value;
    const root = document.documentElement;

    if (!settings.animations || settings.reducedMotion) {
      root.classList.add('no-animations');
    } else {
      root.classList.remove('no-animations');
    }

    if (settings.reducedMotion) {
      root.classList.add('reduced-motion');
    } else {
      root.classList.remove('reduced-motion');
    }
  }

  private getSystemPreferredTheme(): Theme {
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? this.defaultDarkTheme : this.defaultLightTheme;
  }

  private listenToSystemTheme(): void {
    if (window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addListener(() => {
        const settings = this.settingsSubject.value;
        if (settings.mode === ThemeMode.AUTO) {
          this.updateTheme();
        }
      });
    }
  }
}