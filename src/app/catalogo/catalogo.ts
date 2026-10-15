import { CurrencyPipe } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { Component, computed, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { CategoriasStore } from '../categorias.store';
import { CatalogoActions } from '../cesta/cesta.actions';
import { Libro } from '../libro';
import { FiltrosStore } from './filtros.store';

@Component({
  selector: 'app-catalogo',
  imports: [CurrencyPipe],
  template: `
    <h1>Catálogo</h1>
    <div class="filtros">
      <input
        #texto
        placeholder="Buscar por título o autor"
        [value]="filtros.texto()"
        (input)="filtros.buscar(texto.value)"
      />
      <select #categoria (change)="filtros.elegirCategoria(categoria.value)">
        <option value="" [selected]="!filtros.categoria()">Todas las categorías</option>
        @for (c of categorias.categorias(); track c.id) {
          <option [value]="c.id" [selected]="c.id === filtros.categoria()">{{ c.nombre }}</option>
        }
      </select>
      <button (click)="filtros.limpiar()">Limpiar</button>
    </div>

    @if (libros.isLoading()) {
      <p>Cargando el catálogo…</p>
    }
    @if (libros.hasValue()) {
      <p class="nota">{{ visibles().length }} de {{ libros.value().length }} libros</p>
      <ul>
        @for (libro of visibles(); track libro.id) {
          <li>
            <strong>{{ libro.titulo }}</strong> · {{ libro.autor }} ·
            <span class="categoria">{{ categorias.nombres().get(libro.categoria) }}</span> ·
            {{ libro.precio | currency: 'EUR' }}
            <button (click)="elegir(libro)">Añadir a la cesta</button>
          </li>
        }
      </ul>
    }
  `,
  styles: `
    .filtros {
      display: flex;
      gap: 8px;
    }
    li {
      margin: 10px 0;
    }
    .categoria {
      color: #92400e;
    }
    .nota {
      color: #6b7280;
    }
  `,
})
export class Catalogo {
  private readonly store = inject(Store);
  protected readonly categorias = inject(CategoriasStore);
  protected readonly filtros = inject(FiltrosStore);

  /** Estado del servidor: el catálogo es de la API. Aquí solo hay una copia. */
  protected readonly libros = httpResource<Libro[]>(() => '/api/libros');

  /** Estado derivado: no se guarda, se calcula con los libros y los filtros. */
  protected readonly visibles = computed(() => {
    const texto = this.filtros.texto().toLowerCase();
    const categoria = this.filtros.categoria();
    return (this.libros.value() ?? []).filter(
      (libro) =>
        (!categoria || libro.categoria === categoria) &&
        (libro.titulo.toLowerCase().includes(texto) || libro.autor.toLowerCase().includes(texto)),
    );
  });

  /** El componente no cambia la cesta: cuenta lo que ha pasado y el Store decide. */
  protected elegir(libro: Libro) {
    this.store.dispatch(CatalogoActions.libroElegido({ libro }));
  }
}
