import { createSelector } from '@ngrx/store';
import { cestaFeature } from './cesta.reducer';

/** createFeature ya trae un selector por cada propiedad de la rama: selectLineas. */
export const { selectLineas } = cestaFeature;

/** Cuántos ejemplares hay en la cesta, sumando las cantidades. */
export const selectUnidades = createSelector(selectLineas, (lineas) =>
  lineas.reduce((suma, linea) => suma + linea.cantidad, 0),
);

/** El importe total. No se guarda en el estado: se calcula a partir de las líneas. */
export const selectTotal = createSelector(selectLineas, (lineas) =>
  lineas.reduce((suma, linea) => suma + linea.cantidad * linea.libro.precio, 0),
);
