import { CurrencyPipe } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { CatalogoActions } from '../cesta/cesta.actions';
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
            <button (click)="elegir(libro)">Añadir a la cesta</button>
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
  private readonly store = inject(Store);

  /** Estado del servidor: el catálogo es de la API. Aquí solo hay una copia. */
  protected readonly libros = httpResource<Libro[]>(() => '/api/libros');

  /** El componente no cambia la cesta: cuenta lo que ha pasado y el Store decide. */
  protected elegir(libro: Libro) {
    this.store.dispatch(CatalogoActions.libroElegido({ libro }));
  }
}
