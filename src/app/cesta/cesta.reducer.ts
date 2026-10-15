import { createFeature, createReducer, on } from '@ngrx/store';
import { Libro } from '../libro';
import { CatalogoActions, CestaActions } from './cesta.actions';

/** Una línea de la cesta: qué libro y cuántos ejemplares. */
export interface Linea {
  libro: Libro;
  cantidad: number;
}

/** La rama «cesta» del estado global. */
export interface EstadoCesta {
  lineas: Linea[];
}

const estadoInicial: EstadoCesta = {
  lineas: [],
};

/**
 * El reducer: recibe el estado anterior y una acción, y devuelve el estado nuevo.
 * Nunca modifica el que recibe: devuelve una copia con el cambio.
 */
export const cestaFeature = createFeature({
  name: 'cesta',
  reducer: createReducer(
    estadoInicial,
    on(CatalogoActions.libroElegido, (estado, { libro }) => ({
      ...estado,
      lineas: anadir(estado.lineas, libro),
    })),
    on(CestaActions.libroQuitado, (estado, { id }) => ({
      ...estado,
      lineas: estado.lineas.filter((linea) => linea.libro.id !== id),
    })),
    on(CestaActions.cestaVaciada, (estado) => ({ ...estado, lineas: [] })),
  ),
});

/** Si el libro ya está en la cesta, un ejemplar más; si no, una línea nueva. */
function anadir(lineas: Linea[], libro: Libro): Linea[] {
  const existente = lineas.find((linea) => linea.libro.id === libro.id);
  if (!existente) {
    return [...lineas, { libro, cantidad: 1 }];
  }
  return lineas.map((linea) =>
    linea === existente ? { ...linea, cantidad: linea.cantidad + 1 } : linea,
  );
}
