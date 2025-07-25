# Ideas Claras - Gestión de Ideas con Angular

## Descripción
Ideas Claras es una aplicación web moderna desarrollada con Angular 17 para gestionar y organizar ideas de forma clara y eficiente. Incluye funcionalidades avanzadas como PWA, tema oscuro/claro, exportación de datos, y una arquitectura optimizada para rendimiento y accesibilidad.

## ✨ Características Principales

### 🎯 Gestión de Ideas
- ✅ CRUD completo de ideas (Crear, Leer, Actualizar, Eliminar)
- 📂 Organización por categorías predefinidas
- 🏷️ Sistema de etiquetas personalizable
- ⭐ Marcado de ideas favoritas
- 🔍 Búsqueda avanzada con filtros múltiples

### 🎨 Experiencia de Usuario
- 🌙 Tema oscuro/claro con modo automático
- 📱 Diseño totalmente responsivo
- ♿ Accesibilidad completa (WCAG 2.1)
- 🎬 Animaciones suaves y feedback visual
- ⌨️ Atajos de teclado

### 🚀 Características Técnicas
- 📱 PWA (Progressive Web App) con funcionalidad offline
- 💾 Persistencia de datos en localStorage
- 📊 Estadísticas y métricas de ideas
- 📤 Exportación en JSON y CSV
- 🔄 Lazy loading de componentes
- 🎯 OnPush change detection para optimización

### 🛠️ Arquitectura Moderna
- Angular 17 con Standalone Components
- RxJS para programación reactiva
- NgRx para gestión de estado (preparado)
- SCSS con CSS Custom Properties
- TypeScript estricto
- Service Workers para PWA

## 🚀 Cómo Probar la Aplicación

### Prerrequisitos
```bash
# Verificar versiones requeridas
node --version  # >= 18.13.0
npm --version   # >= 8.19.0
```

### Instalación Rápida
```bash
# 1. Instalar dependencias
npm install

# 2. Ejecutar en modo desarrollo
npm start
# o
ng serve

# 3. Abrir en el navegador
http://localhost:4200
```

### Scripts Disponibles
```bash
# Desarrollo
npm start              # Servidor de desarrollo
npm run watch          # Build con watch mode

# Producción
npm run build          # Build optimizado
npm run serve:pwa      # Servir como PWA

# Testing
npm test               # Unit tests
npm run test:coverage  # Tests con coverage
npm run e2e            # Tests end-to-end

# Análisis
npm run analyze        # Análisis del bundle
npm run lint           # Linting del código
```

## 📖 Guía de Uso

### 1. Primera Vez
1. **Abrir la aplicación** en `http://localhost:4200`
2. **Crear tu primera idea** usando el botón "Nueva Idea"
3. **Explorar las categorías** predefinidas disponibles
4. **Probar el tema oscuro** con el botón en el header

### 2. Gestión de Ideas
- **Crear**: Botón "+" en el header o "Nueva Idea"
- **Editar**: Click en cualquier idea
- **Favoritas**: Botón de corazón en cada idea
- **Buscar**: Barra de búsqueda en el header (Ctrl/Cmd + K)
- **Filtrar**: Por categoría, estado, prioridad
- **Exportar**: Footer → "Exportar JSON/CSV"

### 3. Características Avanzadas
- **PWA**: Instalar como app nativa (banner aparecerá)
- **Offline**: Funciona sin conexión una vez cargada
- **Temas**: Auto, claro, oscuro (botón en header)
- **Atajos**: 
  - `Ctrl/Cmd + K`: Abrir búsqueda
  - `Alt + 1`: Ir al contenido principal
  - `Escape`: Cerrar modales/menús

### 4. Datos de Prueba
La aplicación incluye categorías predefinidas:
- 👤 Personal
- 💼 Trabajo  
- 🚀 Proyectos
- 📚 Estudios
- 🎨 Creatividad
- 💻 Tecnología

## 🏗️ Estructura del Proyecto

```
ideas-claras/
├── src/
│   ├── app/
│   │   ├── components/          # Componentes de UI
│   │   │   ├── header/         # Navegación principal
│   │   │   ├── footer/         # Pie de página
│   │   │   ├── home/           # Página de inicio
│   │   │   ├── ideas/          # Lista de ideas
│   │   │   └── idea-detail/    # Detalle/formulario
│   │   ├── services/           # Servicios de negocio
│   │   │   ├── idea.service.ts # Gestión de ideas
│   │   │   └── theme.service.ts # Gestión de temas
│   │   ├── models/             # Interfaces y tipos
│   │   ├── store/              # NgRx (preparado)
│   │   ├── shared/             # Componentes compartidos
│   │   └── guards/             # Route guards
│   ├── assets/                 # Recursos estáticos
│   ├── environments/           # Configuraciones
│   └── styles.scss            # Estilos globales
├── angular.json               # Configuración Angular
├── ngsw-config.json          # Service Worker
├── manifest.json             # PWA Manifest
└── package.json              # Dependencias
```

## 🧪 Testing

### Unit Tests
```bash
# Ejecutar todos los tests
npm test

# Tests con coverage
npm run test:coverage

# Tests en modo watch
npm run test:watch
```

### E2E Tests
```bash
# Tests end-to-end
npm run e2e

# E2E en modo headless
npm run e2e:headless
```

## 📱 PWA Features

La aplicación es una PWA completa con:
- ✅ Instalación como app nativa
- ✅ Funcionalidad offline
- ✅ Caché inteligente de recursos
- ✅ Updates automáticos
- ✅ Iconos adaptativos
- ✅ Shortcuts del sistema

### Probar PWA
1. Ejecutar `npm run build`
2. Servir con `npm run serve:pwa`
3. Abrir Chrome/Edge
4. Verá el banner de instalación
5. Instalar y probar offline

## 🎨 Personalización

### Temas
Los temas se pueden personalizar en `src/styles.scss`:
```scss
:root {
  --color-primary: #007bff;    # Color principal
  --color-secondary: #6c757d;  # Color secundario
  --color-background: #ffffff; # Fondo
  // ... más variables
}
```

### Añadir Categorías
En `src/app/services/idea.service.ts`:
```typescript
const defaultCategories: Category[] = [
  { id: '7', name: 'Nueva', icon: '🆕', color: '#ff6b6b' }
];
```

## 🚀 Despliegue

### Build de Producción
```bash
# Build optimizado
npm run build

# Servir estáticamente
npx http-server dist/ideas-claras
```

### Hosting Sugerido
- **Netlify**: Drag & drop de la carpeta `dist/`
- **Vercel**: Conectar repositorio Git
- **GitHub Pages**: Usar GitHub Actions
- **Firebase Hosting**: `firebase deploy`

## 🔧 Configuración Avanzada

### Performance
- Lazy loading habilitado
- OnPush change detection
- Bundle optimization
- Service Worker caching
- Image optimization ready

### Accessibility
- ARIA labels completos
- Navegación por teclado
- Screen reader support
- High contrast mode
- Reduced motion support

## 📋 Roadmap

### Próximas Funcionalidades
- [ ] Componentes de Ideas completos
- [ ] Formulario de creación/edición
- [ ] Filtros avanzados
- [ ] Drag & drop para organizar
- [ ] Colaboración en tiempo real
- [ ] Sincronización en la nube
- [ ] Notificaciones push
- [ ] Modo offline mejorado

## 🤝 Contribución

1. Fork del proyecto
2. Crear feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📄 Licencia

MIT License - ver [LICENSE](LICENSE) para detalles.

## 🙏 Agradecimientos

- Angular Team por el framework
- Material Design por los iconos
- Inter Font por la tipografía
- Comunidad open source

---

**¡Hecho con ❤️ para la comunidad de desarrolladores!**
