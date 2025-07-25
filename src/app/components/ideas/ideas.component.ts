import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ideas',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="ideas-page">
      <h1>Mis Ideas</h1>
      <p>Este componente se desarrollará completamente en la siguiente fase.</p>
      <div class="placeholder-content">
        <div class="placeholder-card">
          <h3>Lista de Ideas</h3>
          <p>Aquí se mostrará la lista completa de ideas con filtros y búsqueda.</p>
        </div>
        <div class="placeholder-card">
          <h3>Funcionalidades</h3>
          <ul>
            <li>Ver todas las ideas</li>
            <li>Filtrar por categoría</li>
            <li>Buscar por texto</li>
            <li>Ordenar por fecha, prioridad, etc.</li>
            <li>Acciones rápidas (editar, eliminar, favorito)</li>
          </ul>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .ideas-page {
      padding: var(--space-lg);
      max-width: 1200px;
      margin: 0 auto;
    }

    .placeholder-content {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: var(--space-lg);
      margin-top: var(--space-xl);
    }

    .placeholder-card {
      background-color: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      padding: var(--space-lg);
    }

    .placeholder-card h3 {
      color: var(--color-primary);
      margin-bottom: var(--space-md);
    }

    .placeholder-card ul {
      color: var(--color-text-secondary);
      line-height: var(--line-height-relaxed);
    }
  `]
})
export class IdeasComponent {
  constructor() {}
}