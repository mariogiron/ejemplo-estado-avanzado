import { CurrencyPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { CategoriasStore } from '../categorias.store';
import { CestaService } from './cesta.service';

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
  private readonly cesta = inject(CestaService);
  protected readonly categorias = inject(CategoriasStore);

  protected readonly lineas = this.cesta.lineas;
  protected readonly total = this.cesta.total;
  protected readonly enviando = this.cesta.enviando;
  protected readonly aviso = this.cesta.aviso;

  protected quitar(id: string) {
    this.cesta.quitar(id);
  }

  protected vaciar() {
    this.cesta.vaciar();
  }

  protected confirmar() {
    void this.cesta.confirmar();
  }
}
