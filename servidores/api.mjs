// API de prácticas del módulo 5: una librería con catálogo, categorías y pedidos.
// Node sin dependencias. Arranca con: node servidores/api.mjs
import http from 'node:http';

const PUERTO = Number(process.env.PUERTO ?? 3000);
/** Milisegundos que tarda cada respuesta, para que se vean los estados de carga. */
const RETARDO = Number(process.env.RETARDO ?? 700);

const CATEGORIAS = [
  { id: 'novela', nombre: 'Novela' },
  { id: 'ensayo', nombre: 'Ensayo' },
  { id: 'infantil', nombre: 'Infantil' },
  { id: 'comic', nombre: 'Cómic' },
];

const LIBROS = [
  {
    id: 'l1',
    titulo: 'La sombra del ciprés',
    autor: 'Elena Robles',
    precio: 18.9,
    categoria: 'novela',
    existencias: 12,
  },
  {
    id: 'l2',
    titulo: 'El faro de las dunas',
    autor: 'Tomás Ibáñez',
    precio: 21.5,
    categoria: 'novela',
    existencias: 5,
  },
  {
    id: 'l3',
    titulo: 'Breve historia del café',
    autor: 'Lucía Varela',
    precio: 16,
    categoria: 'ensayo',
    existencias: 8,
  },
  {
    id: 'l4',
    titulo: 'Pensar despacio',
    autor: 'Andrés Mora',
    precio: 24.9,
    categoria: 'ensayo',
    existencias: 2,
  },
  {
    id: 'l5',
    titulo: 'Nube quiere llover',
    autor: 'Sara Prieto',
    precio: 12.5,
    categoria: 'infantil',
    existencias: 20,
  },
  {
    id: 'l6',
    titulo: 'El dragón que tenía hipo',
    autor: 'Pablo Gil',
    precio: 14,
    categoria: 'infantil',
    existencias: 0,
  },
  {
    id: 'l7',
    titulo: 'Capitana Brisa',
    autor: 'Irene Sanz',
    precio: 19.95,
    categoria: 'comic',
    existencias: 7,
  },
  {
    id: 'l8',
    titulo: 'Los gatos de la azotea',
    autor: 'Óscar Llorente',
    precio: 22,
    categoria: 'comic',
    existencias: 3,
  },
];

let siguientePedido = 1001;

async function leerJson(req) {
  let texto = '';
  for await (const trozo of req) texto += trozo;
  return texto ? JSON.parse(texto) : {};
}

async function atender(req) {
  const { pathname } = new URL(req.url, 'http://localhost');

  if (req.method === 'GET' && pathname === '/api/libros') {
    return { estado: 200, cuerpo: LIBROS };
  }

  if (req.method === 'GET' && pathname === '/api/categorias') {
    return { estado: 200, cuerpo: CATEGORIAS };
  }

  // Un pedido: { lineas: [{ id, cantidad }] }. Se rechaza si no hay ejemplares suficientes.
  if (req.method === 'POST' && pathname === '/api/pedidos') {
    const { lineas = [] } = await leerJson(req);
    if (lineas.length === 0) {
      return { estado: 400, cuerpo: { error: 'El pedido está vacío' } };
    }
    for (const { id, cantidad } of lineas) {
      const libro = LIBROS.find((l) => l.id === id);
      if (!libro) {
        return { estado: 404, cuerpo: { error: `No existe el libro ${id}` } };
      }
      if (libro.existencias < cantidad) {
        const error =
          libro.existencias === 0
            ? `No quedan ejemplares de «${libro.titulo}»`
            : `Solo quedan ${libro.existencias} ejemplares de «${libro.titulo}»`;
        return { estado: 409, cuerpo: { error } };
      }
    }
    const total = lineas.reduce(
      (suma, { id, cantidad }) => suma + LIBROS.find((l) => l.id === id).precio * cantidad,
      0,
    );
    const numero = `P-${siguientePedido++}`;
    return { estado: 201, cuerpo: { numero, total: Math.round(total * 100) / 100 } };
  }

  return { estado: 404, cuerpo: { error: 'No existe esa ruta' } };
}

http
  .createServer(async (req, res) => {
    let resultado;
    try {
      resultado = await atender(req);
    } catch (error) {
      resultado = { estado: 500, cuerpo: { error: error.message } };
    }
    await new Promise((listo) => setTimeout(listo, RETARDO));
    const { estado, cuerpo } = resultado;
    const detalle = estado >= 400 ? ` ${cuerpo.error}` : cuerpo.numero ? ` ${cuerpo.numero}` : '';
    console.log(`[api] ${req.method} ${req.url} → ${estado}${detalle}`);
    res.writeHead(estado, { 'content-type': 'application/json' });
    res.end(JSON.stringify(cuerpo));
  })
  .listen(PUERTO, () =>
    console.log(`API de la librería en http://localhost:${PUERTO} · retardo ${RETARDO} ms`),
  );
