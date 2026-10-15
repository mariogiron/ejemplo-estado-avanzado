/** Un libro del catálogo, tal como lo devuelve la API. */
export interface Libro {
  id: string;
  titulo: string;
  autor: string;
  precio: number;
  categoria: string;
  existencias: number;
}
