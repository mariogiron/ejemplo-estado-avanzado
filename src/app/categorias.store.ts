import { HttpClient } from '@angular/common/http';
import { computed, inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { firstValueFrom } from 'rxjs';

/** Un dato maestro: una lista pequeña que casi nunca cambia y que usan varias pantallas. */
export interface Categoria {
  id: string;
  nombre: string;
}

interface EstadoCategorias {
  categorias: Categoria[];
  cargando: boolean;
}

/** Un SignalStore: un servicio con signals, montado por piezas. */
export const CategoriasStore = signalStore(
  // 1. El estado. Cada propiedad se lee como un signal: store.categorias()
  withState<EstadoCategorias>({ categorias: [], cargando: false }),
  // 2. Valores derivados, como un computed
  withComputed(({ categorias }) => ({
    /** Del id al nombre: nombres().get('comic') → 'Cómic' */
    nombres: computed(() => new Map(categorias().map((c) => [c.id, c.nombre]))),
  })),
  // 3. Los métodos: la única forma de cambiar el estado desde fuera
  withMethods((store, http = inject(HttpClient)) => ({
    async cargar() {
      patchState(store, { cargando: true });
      const categorias = await firstValueFrom(http.get<Categoria[]>('/api/categorias'));
      patchState(store, { categorias, cargando: false });
    },
  })),
  // 4. El ciclo de vida: al crearse el store, carga las categorías
  withHooks({
    onInit(store) {
      void store.cargar();
    },
  }),
);
