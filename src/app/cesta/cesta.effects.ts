import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, exhaustMap, map, of, skip, tap } from 'rxjs';
import { CestaActions, PedidosApiActions } from './cesta.actions';
import { cestaFeature } from './cesta.reducer';

/**
 * Un efecto escucha acciones, habla con el exterior y devuelve otra acción.
 * Aquí: «Pedido confirmado» → POST /api/pedidos → «Pedido aceptado» o «Pedido rechazado».
 */
export const enviarPedido = createEffect(
  (acciones = inject(Actions), http = inject(HttpClient)) =>
    acciones.pipe(
      ofType(CestaActions.pedidoConfirmado),
      // exhaustMap: mientras un pedido está en camino, los clics repetidos se ignoran
      exhaustMap(({ lineas }) =>
        http
          .post<{ numero: string }>('/api/pedidos', {
            lineas: lineas.map((linea) => ({ id: linea.libro.id, cantidad: linea.cantidad })),
          })
          .pipe(
            map(({ numero }) => PedidosApiActions.pedidoAceptado({ numero })),
            // El error se convierte en una acción: el efecto sigue vivo para el siguiente pedido
            catchError((respuesta: HttpErrorResponse) =>
              of(
                PedidosApiActions.pedidoRechazado({
                  error: respuesta.error?.error ?? 'la API no responde',
                }),
              ),
            ),
          ),
      ),
    ),
  { functional: true },
);

/** Un efecto que no despacha nada: cada vez que cambian las líneas, las guarda en localStorage. */
export const guardarCesta = createEffect(
  (store = inject(Store)) =>
    store.select(cestaFeature.selectLineas).pipe(
      skip(1), // la primera emisión es el estado inicial, que acaba de leerse de localStorage
      tap((lineas) => localStorage.setItem('cesta', JSON.stringify(lineas))),
    ),
  { functional: true, dispatch: false },
);
