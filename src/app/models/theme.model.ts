export interface Theme {
  name: string;
  displayName: string;
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  shadow: string;
}

export enum ThemeMode {
  LIGHT = 'light',
  DARK = 'dark',
  AUTO = 'auto'
}

export interface ThemeSettings {
  mode: ThemeMode;
  customTheme?: Theme;
  animations: boolean;
  reducedMotion: boolean;
}