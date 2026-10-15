import { CurrencyPipe } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { Component } from '@angular/core';
import { Libro } from '../libro';

@Component({
  selector: 'app-catalogo',
  imports: [CurrencyPipe],
  template: `
    <h1>Catálogo</h1>
    @if (libros.isLoading()) {
      <p>Cargando el catálogo…</p>
    }
    @if (libros.hasValue()) {
      <ul>
        @for (libro of libros.value(); track libro.id) {
          <li>
            <strong>{{ libro.titulo }}</strong> · {{ libro.autor }} ·
            {{ libro.precio | currency: 'EUR' }}
          </li>
        }
      </ul>
    }
  `,
  styles: `
    li {
      margin: 10px 0;
    }
  `,
})
export class Catalogo {
  /** Estado del servidor: el catálogo es de la API. Aquí solo hay una copia. */
  protected readonly libros = httpResource<Libro[]>(() => '/api/libros');
}
