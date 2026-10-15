import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, of } from 'rxjs';
import { CestaActions, PedidosApiActions } from './cesta.actions';

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
