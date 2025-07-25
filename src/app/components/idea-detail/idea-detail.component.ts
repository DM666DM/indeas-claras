import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-idea-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="idea-detail-page">
      <h1>Detalle de Idea</h1>
      <p>Este componente se desarrollará completamente en la siguiente fase.</p>
      <div class="placeholder-content">
        <div class="placeholder-card">
          <h3>Formulario de Idea</h3>
          <p>Aquí se mostrará el formulario para crear o editar una idea.</p>
        </div>
        <div class="placeholder-card">
          <h3>Funcionalidades</h3>
          <ul>
            <li>Crear nueva idea</li>
            <li>Editar idea existente</li>
            <li>Seleccionar categoría</li>
            <li>Establecer prioridad y estado</li>
            <li>Añadir etiquetas</li>
            <li>Subir archivos adjuntos</li>
            <li>Guardar como borrador</li>
          </ul>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .idea-detail-page {
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
export class IdeaDetailComponent {
  constructor() {}
}