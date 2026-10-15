import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Libro } from '../libro';

/** Una línea de la cesta: qué libro y cuántos ejemplares. */
export interface Linea {
  libro: Libro;
  cantidad: number;
}

/**
 * La misma cesta, sin librería: un servicio con signals.
 * El estado es privado; desde fuera solo se lee, y solo cambia con los métodos.
 */
@Injectable({ providedIn: 'root' })
export class CestaService {
  private readonly http = inject(HttpClient);

  private readonly _lineas = signal<Linea[]>([]);
  private readonly _enviando = signal(false);
  private readonly _aviso = signal('');

  readonly lineas = this._lineas.asReadonly();
  readonly enviando = this._enviando.asReadonly();
  readonly aviso = this._aviso.asReadonly();

  readonly unidades = computed(() =>
    this._lineas().reduce((suma, linea) => suma + linea.cantidad, 0),
  );
  readonly total = computed(() =>
    this._lineas().reduce((suma, linea) => suma + linea.cantidad * linea.libro.precio, 0),
  );

  anadir(libro: Libro) {
    this._lineas.update((lineas) => {
      const existente = lineas.find((linea) => linea.libro.id === libro.id);
      if (!existente) {
        return [...lineas, { libro, cantidad: 1 }];
      }
      return lineas.map((linea) =>
        linea === existente ? { ...linea, cantidad: linea.cantidad + 1 } : linea,
      );
    });
  }

  quitar(id: string) {
    this._lineas.update((lineas) => lineas.filter((linea) => linea.libro.id !== id));
  }

  vaciar() {
    this._lineas.set([]);
  }

  async confirmar() {
    if (this._enviando()) {
      return;
    }
    this._enviando.set(true);
    this._aviso.set('');
    try {
      const { numero } = await firstValueFrom(
        this.http.post<{ numero: string }>('/api/pedidos', {
          lineas: this._lineas().map((linea) => ({ id: linea.libro.id, cantidad: linea.cantidad })),
        }),
      );
      this._lineas.set([]);
      this._aviso.set(`Pedido ${numero} confirmado. ¡Gracias!`);
    } catch (error) {
      const motivo = error instanceof HttpErrorResponse ? error.error?.error : undefined;
      this._aviso.set(`No se ha podido hacer el pedido: ${motivo ?? 'la API no responde'}`);
    } finally {
      this._enviando.set(false);
    }
  }
}
