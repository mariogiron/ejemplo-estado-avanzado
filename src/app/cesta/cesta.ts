import { CurrencyPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { CestaActions } from './cesta.actions';
import { selectLineas, selectTotal } from './cesta.selectors';

@Component({
  selector: 'app-cesta',
  imports: [CurrencyPipe],
  template: `
    <h1>Cesta</h1>
    @if (lineas().length === 0) {
      <p>La cesta está vacía.</p>
    } @else {
      <ul>
        @for (linea of lineas(); track linea.libro.id) {
          <li>
            {{ linea.cantidad }} × <strong>{{ linea.libro.titulo }}</strong> ·
            {{ linea.cantidad * linea.libro.precio | currency: 'EUR' }}
            <button (click)="quitar(linea.libro.id)">Quitar</button>
          </li>
        }
      </ul>
      <p class="total">Total: {{ total() | currency: 'EUR' }}</p>
      <button (click)="vaciar()">Vaciar la cesta</button>
    }
  `,
  styles: `
    li {
      margin: 10px 0;
    }
    .total {
      font-size: 1.2em;
      font-weight: bold;
    }
  `,
})
export class Cesta {
  private readonly store = inject(Store);

  protected readonly lineas = this.store.selectSignal(selectLineas);
  protected readonly total = this.store.selectSignal(selectTotal);

  protected quitar(id: string) {
    this.store.dispatch(CestaActions.libroQuitado({ id }));
  }

  protected vaciar() {
    this.store.dispatch(CestaActions.cestaVaciada());
  }
}
