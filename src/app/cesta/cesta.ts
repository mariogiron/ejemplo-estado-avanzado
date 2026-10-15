import { CurrencyPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { CategoriasStore } from '../categorias.store';
import { CestaActions } from './cesta.actions';
import { selectAviso, selectEnviando, selectLineas, selectTotal } from './cesta.selectors';

@Component({
  selector: 'app-cesta',
  imports: [CurrencyPipe],
  template: `
    <h1>Cesta</h1>
    @if (aviso()) {
      <p class="aviso">{{ aviso() }}</p>
    }
    @if (lineas().length === 0) {
      <p>La cesta está vacía.</p>
    } @else {
      <ul>
        @for (linea of lineas(); track linea.libro.id) {
          <li>
            {{ linea.cantidad }} × <strong>{{ linea.libro.titulo }}</strong> ·
            {{ categorias.nombres().get(linea.libro.categoria) }} ·
            {{ linea.cantidad * linea.libro.precio | currency: 'EUR' }}
            <button (click)="quitarEjemplar(linea.libro.id)">−1</button>
            <button (click)="quitar(linea.libro.id)">Quitar</button>
          </li>
        }
      </ul>
      <p class="total">Total: {{ total() | currency: 'EUR' }}</p>
      <button (click)="vaciar()" [disabled]="enviando()">Vaciar la cesta</button>
      <button (click)="confirmar()" [disabled]="enviando()">
        {{ enviando() ? 'Enviando…' : 'Confirmar pedido' }}
      </button>
    }
  `,
  styles: `
    li {
      margin: 10px 0;
    }
    .aviso {
      padding: 8px 12px;
      background: #fef3c7;
    }
    .total {
      font-size: 1.2em;
      font-weight: bold;
    }
  `,
})
export class Cesta {
  private readonly store = inject(Store);
  protected readonly categorias = inject(CategoriasStore);

  protected readonly lineas = this.store.selectSignal(selectLineas);
  protected readonly total = this.store.selectSignal(selectTotal);
  protected readonly enviando = this.store.selectSignal(selectEnviando);
  protected readonly aviso = this.store.selectSignal(selectAviso);

  protected quitar(id: string) {
    this.store.dispatch(CestaActions.libroQuitado({ id }));
  }

  protected quitarEjemplar(id: string) {
    this.store.dispatch(CestaActions.ejemplarQuitado({ id }));
  }

  protected vaciar() {
    this.store.dispatch(CestaActions.cestaVaciada());
  }

  /** La página no llama a la API: despacha la acción, y el efecto se encarga. */
  protected confirmar() {
    this.store.dispatch(CestaActions.pedidoConfirmado({ lineas: this.lineas() }));
  }
}
