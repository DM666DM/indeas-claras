import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent),
    title: 'Inicio - Ideas Claras',
    data: {
      description: 'Página principal de Ideas Claras',
      keywords: 'inicio, ideas, bienvenida'
    }
  },
  {
    path: 'ideas',
    loadComponent: () => import('./components/ideas/ideas.component').then(m => m.IdeasComponent),
    title: 'Mis Ideas - Ideas Claras',
    data: {
      description: 'Gestiona y organiza todas tus ideas',
      keywords: 'ideas, gestión, organización'
    }
  },
  {
    path: 'ideas/new',
    loadComponent: () => import('./components/idea-detail/idea-detail.component').then(m => m.IdeaDetailComponent),
    title: 'Nueva Idea - Ideas Claras',
    data: {
      description: 'Crear una nueva idea',
      keywords: 'nueva idea, crear, añadir'
    }
  },
  {
    path: 'ideas/:id',
    loadComponent: () => import('./components/idea-detail/idea-detail.component').then(m => m.IdeaDetailComponent),
    title: 'Detalle de Idea - Ideas Claras',
    data: {
      description: 'Ver y editar los detalles de una idea',
      keywords: 'detalle, editar, idea'
    }
  },
  {
    path: 'favorites',
    loadComponent: () => import('./components/ideas/ideas.component').then(m => m.IdeasComponent),
    title: 'Ideas Favoritas - Ideas Claras',
    data: {
      description: 'Tus ideas marcadas como favoritas',
      keywords: 'favoritas, importantes, destacadas',
      filter: { favorites: true }
    }
  },
  {
    path: 'categories',
    loadComponent: () => import('./components/ideas/ideas.component').then(m => m.IdeasComponent),
    title: 'Categorías - Ideas Claras',
    data: {
      description: 'Organizar ideas por categorías',
      keywords: 'categorías, organización, clasificación'
    }
  },
  {
    path: 'search',
    loadComponent: () => import('./components/ideas/ideas.component').then(m => m.IdeasComponent),
    title: 'Buscar Ideas - Ideas Claras',
    data: {
      description: 'Buscar entre todas tus ideas',
      keywords: 'buscar, encontrar, filtrar'
    }
  },
  {
    path: 'stats',
    loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent),
    title: 'Estadísticas - Ideas Claras',
    data: {
      description: 'Estadísticas de tus ideas',
      keywords: 'estadísticas, métricas, análisis',
      showStats: true
    }
  },
  {
    path: 'settings',
    loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent),
    title: 'Configuración - Ideas Claras',
    data: {
      description: 'Configuración de la aplicación',
      keywords: 'configuración, ajustes, preferencias',
      showSettings: true
    }
  },
  {
    path: 'about',
    loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent),
    title: 'Acerca de - Ideas Claras',
    data: {
      description: 'Información sobre Ideas Claras',
      keywords: 'acerca de, información, ayuda',
      showAbout: true
    }
  },
  {
    path: 'help',
    loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent),
    title: 'Ayuda - Ideas Claras',
    data: {
      description: 'Centro de ayuda y documentación',
      keywords: 'ayuda, soporte, documentación',
      showHelp: true
    }
  },
  {
    path: '404',
    loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent),
    title: 'Página no encontrada - Ideas Claras',
    data: {
      description: 'La página que buscas no existe',
      keywords: 'error, 404, no encontrado',
      showError: true
    }
  },
  {
    path: '**',
    redirectTo: '/404'
  }
];