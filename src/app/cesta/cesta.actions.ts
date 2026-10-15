import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Libro } from '../libro';

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
    'Cesta vaciada': emptyProps(),
  },
});
