/**
 * Genera dist/sitemap.xml despues de compilar.
 * La direccion base se toma de la variable de entorno SITIO_URL; si no existe,
 * se usa la de GitHub Pages del repositorio.
 *
 *   SITIO_URL=https://mi-dominio.hn/ npm run build
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const raiz = resolve(import.meta.dirname, '..')
// Se usa || y no ??: en GitHub Actions una variable sin valor llega como cadena
// vacia, no como undefined, y dejaria el mapa del sitio con direcciones rotas.
const base = (process.env.SITIO_URL || 'https://gardon-hub.github.io/portafolio-docente/').replace(
  /\/?$/,
  '/',
)

const leer = (ruta) => JSON.parse(readFileSync(resolve(raiz, ruta), 'utf8'))
const { secciones } = leer('content/sections.json')
const { evidencias } = leer('content/evidence.json')

const rutas = [
  '',
  '#/portafolio',
  ...secciones.map((s) => '#/portafolio/' + s.slug),
  '#/evidencias',
  ...evidencias.map((e) => '#/evidencias/' + e.codigo),
  '#/anexo',
  '#/buscar',
  '#/descargas',
  '#/imprimir',
  '#/privacidad',
  '#/accesibilidad',
]

const hoy = new Date().toISOString().slice(0, 10)
const xml =
  '<?xml version="1.0" encoding="UTF-8"?>\n' +
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  rutas
    .map(
      (r) =>
        '  <url><loc>' +
        base +
        r +
        '</loc><lastmod>' +
        hoy +
        '</lastmod><changefreq>monthly</changefreq></url>',
    )
    .join('\n') +
  '\n</urlset>\n'

writeFileSync(resolve(raiz, 'dist/sitemap.xml'), xml, 'utf8')
console.log('sitemap.xml generado con ' + rutas.length + ' direcciones sobre ' + base)
