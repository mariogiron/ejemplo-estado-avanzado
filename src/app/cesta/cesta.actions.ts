import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Libro } from '../libro';
import { Linea } from './cesta.reducer';

/** Lo que puede pasar en el catálogo. Cada acción cuenta un hecho, en pasado. */
export const CatalogoActions = createActionGroup({
  source: 'Catálogo',
  events: {
    'Libro elegido': props<{ libro: Libro }>(),
  },
});

/** Lo que puede pasar en la página de la cesta. */
export const CestaActions = createActionGroup({
  source: 'Cesta',
  events: {
    'Libro quitado': props<{ id: string }>(),
    'Ejemplar quitado': props<{ id: string }>(),
    'Cesta vaciada': emptyProps(),
    'Pedido confirmado': props<{ lineas: Linea[] }>(),
  },
});

/** Lo que contesta la API. Estas acciones no las despacha un componente: las despacha el efecto. */
export const PedidosApiActions = createActionGroup({
  source: 'API de pedidos',
  events: {
    'Pedido aceptado': props<{ numero: string }>(),
    'Pedido rechazado': props<{ error: string }>(),
  },
});
