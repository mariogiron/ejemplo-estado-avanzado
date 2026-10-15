# Angular Avanzado · Módulo 5 · Gestión de estado desde cero

Una aplicación pequeña, la **Librería**, que empieza recién salida de `ng new` y a la que se le añade, paso a paso, gestión de estado: NgRx Store para la cesta, NgRx SignalStore para las categorías y para los filtros, y dos alternativas (un servicio con signals y NGXS) para comparar.

## Arrancar

Dos terminales:

```
node servidores/api.mjs     # API de la librería en http://localhost:3000 (700 ms de retardo)
npm start                   # la aplicación en http://localhost:4200 (la API va por el proxy /api)
```

`RETARDO=2000 node servidores/api.mjs` hace la API más lenta, para ver mejor los estados de carga.

Para comprobar el proxy, abre http://localhost:4200/api/categorias: tiene que salir una lista JSON. Si sale el HTML de la aplicación, reinicia `npm start`.

En el navegador, instala la extensión **Redux DevTools** (Chrome, Edge o Firefox).

## API

| Ruta                  | Qué hace                                                                    |
| --------------------- | --------------------------------------------------------------------------- |
| `GET /api/libros`     | Los ocho libros del catálogo                                                |
| `GET /api/categorias` | Las cuatro categorías                                                       |
| `POST /api/pedidos`   | `{ lineas: [{ id, cantidad }] }` → 201 con el número, o 409 sin existencias |

«El dragón que tenía hipo» no tiene existencias: un pedido con él siempre se rechaza.

## Etiquetas

`git checkout <etiqueta>` deja el código en ese paso. `main` es el final.

| Etiqueta             | Paso                                                        |
| -------------------- | ----------------------------------------------------------- |
| `paso-0-ng-new`      | Lo que genera `ng new`, sin tocar                           |
| `paso-1-partida`     | Catálogo, Cesta (vacía), el proxy y la API                  |
| `paso-2-store`       | NgRx Store vacío y Redux DevTools                           |
| `paso-3-acciones`    | Acciones: el catálogo despacha «Libro elegido»              |
| `paso-4-reducer`     | El reducer: la rama `cesta` del estado                      |
| `paso-5-selectores`  | Selectores: unidades y total, la cabecera y la página Cesta |
| `paso-6-efectos`     | Efectos: el pedido viaja a la API                           |
| `paso-7-signalstore` | SignalStore de categorías, en los providers del catálogo    |
| `paso-8-root`        | El SignalStore de categorías, en root                       |
| `paso-9-local`       | Los filtros del catálogo, en un SignalStore local           |

Ramas laterales, que salen de `paso-9-local`:

| Etiqueta               | Qué es                                                     |
| ---------------------- | ---------------------------------------------------------- |
| `alternativa-servicio` | La cesta con un servicio y signals, sin NgRx Store         |
| `alternativa-ngxs`     | La cesta con NGXS (después del checkout: `npm install`)    |
| `ejercicio-1-ejemplar` | Solución del ejercicio 1: un ejemplar menos                |
| `ejercicio-2-guardar`  | Solución del ejercicio 2: la cesta sobrevive a una recarga |
| `ejercicio-3-subir`    | Solución del ejercicio 3: los filtros, globales            |
| `ejercicio-4-url`      | Solución del ejercicio 4: los filtros, en la URL           |

Después de cambiar a una etiqueta con dependencias distintas, ejecuta `npm install` y reinicia `npm start`.
