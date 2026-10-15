import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';

interface EstadoFiltros {
  texto: string;
  categoria: string;
}

const sinFiltros: EstadoFiltros = { texto: '', categoria: '' };

/**
 * Estado local: los filtros del catálogo.
 * Sin providedIn: cada componente que lo ponga en sus providers tiene el suyo, y muere con él.
 */
export const FiltrosStore = signalStore(
  withState(sinFiltros),
  withMethods((store) => ({
    buscar(texto: string) {
      patchState(store, { texto });
    },
    elegirCategoria(categoria: string) {
      patchState(store, { categoria });
    },
    limpiar() {
      patchState(store, sinFiltros);
    },
  })),
);
