import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { catchError, of, tap } from 'rxjs';
import { Libro } from '../libro';

// ---------- Acciones: clases con un type ----------

export class LibroElegido {
  static readonly type = '[Catálogo] Libro elegido';
  constructor(readonly libro: Libro) {}
}

export class LibroQuitado {
  static readonly type = '[Cesta] Libro quitado';
  constructor(readonly id: string) {}
}

export class CestaVaciada {
  static readonly type = '[Cesta] Cesta vaciada';
}

export class PedidoConfirmado {
  static readonly type = '[Cesta] Pedido confirmado';
}

// ---------- El estado ----------

/** Una línea de la cesta: qué libro y cuántos ejemplares. */
export interface Linea {
  libro: Libro;
  cantidad: number;
}

export interface EstadoCesta {
  lineas: Linea[];
  enviando: boolean;
  aviso: string;
}

/** La misma cesta con NGXS: estado, selectores y acciones en una sola clase. */
@State<EstadoCesta>({
  name: 'cesta',
  defaults: { lineas: [], enviando: false, aviso: '' },
})
@Injectable()
export class CestaState {
  private readonly http = inject(HttpClient);

  @Selector()
  static lineas(estado: EstadoCesta) {
    return estado.lineas;
  }

  @Selector()
  static unidades(estado: EstadoCesta) {
    return estado.lineas.reduce((suma, linea) => suma + linea.cantidad, 0);
  }

  @Selector()
  static total(estado: EstadoCesta) {
    return estado.lineas.reduce((suma, linea) => suma + linea.cantidad * linea.libro.precio, 0);
  }

  @Selector()
  static enviando(estado: EstadoCesta) {
    return estado.enviando;
  }

  @Selector()
  static aviso(estado: EstadoCesta) {
    return estado.aviso;
  }

  @Action(LibroElegido)
  elegir(ctx: StateContext<EstadoCesta>, { libro }: LibroElegido) {
    const lineas = ctx.getState().lineas;
    const existente = lineas.find((linea) => linea.libro.id === libro.id);
    ctx.patchState({
      lineas: existente
        ? lineas.map((linea) =>
            linea === existente ? { ...linea, cantidad: linea.cantidad + 1 } : linea,
          )
        : [...lineas, { libro, cantidad: 1 }],
    });
  }

  @Action(LibroQuitado)
  quitar(ctx: StateContext<EstadoCesta>, { id }: LibroQuitado) {
    ctx.patchState({ lineas: ctx.getState().lineas.filter((linea) => linea.libro.id !== id) });
  }

  @Action(CestaVaciada)
  vaciar(ctx: StateContext<EstadoCesta>) {
    ctx.patchState({ lineas: [] });
  }

  /** En NGXS no hay efectos aparte: la acción devuelve el observable de la petición. */
  @Action(PedidoConfirmado)
  confirmar(ctx: StateContext<EstadoCesta>) {
    ctx.patchState({ enviando: true, aviso: '' });
    const lineas = ctx.getState().lineas;
    return this.http
      .post<{ numero: string }>('/api/pedidos', {
        lineas: lineas.map((linea) => ({ id: linea.libro.id, cantidad: linea.cantidad })),
      })
      .pipe(
        tap(({ numero }) =>
          ctx.patchState({
            lineas: [],
            enviando: false,
            aviso: `Pedido ${numero} confirmado. ¡Gracias!`,
          }),
        ),
        catchError((respuesta: HttpErrorResponse) => {
          ctx.patchState({
            enviando: false,
            aviso: `No se ha podido hacer el pedido: ${respuesta.error?.error ?? 'la API no responde'}`,
          });
          return of(null);
        }),
      );
  }
}
