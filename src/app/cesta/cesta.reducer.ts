import { createFeature, createReducer, on } from '@ngrx/store';
import { Libro } from '../libro';
import { CatalogoActions, CestaActions, PedidosApiActions } from './cesta.actions';

/** Una línea de la cesta: qué libro y cuántos ejemplares. */
export interface Linea {
  libro: Libro;
  cantidad: number;
}

/** La rama «cesta» del estado global. */
export interface EstadoCesta {
  lineas: Linea[];
  /** true mientras el pedido viaja a la API. */
  enviando: boolean;
  /** Lo último que ha pasado con el pedido, para enseñarlo en la página. */
  aviso: string;
}

const estadoInicial: EstadoCesta = {
  lineas: [],
  enviando: false,
  aviso: '',
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
    on(CestaActions.ejemplarQuitado, (estado, { id }) => ({
      ...estado,
      lineas: estado.lineas
        .map((linea) =>
          linea.libro.id === id ? { ...linea, cantidad: linea.cantidad - 1 } : linea,
        )
        .filter((linea) => linea.cantidad > 0),
    })),
    // El reducer no llama a la API: solo apunta que el pedido está en camino
    on(CestaActions.pedidoConfirmado, (estado) => ({ ...estado, enviando: true, aviso: '' })),
    on(PedidosApiActions.pedidoAceptado, (estado, { numero }) => ({
      ...estado,
      lineas: [],
      enviando: false,
      aviso: `Pedido ${numero} confirmado. ¡Gracias!`,
    })),
    on(PedidosApiActions.pedidoRechazado, (estado, { error }) => ({
      ...estado,
      enviando: false,
      aviso: `No se ha podido hacer el pedido: ${error}`,
    })),
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
