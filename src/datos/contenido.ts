/**
 * Punto unico de lectura del contenido. Todo lo que se muestra en el sitio sale
 * de los archivos JSON de `content/`; los componentes nunca llevan texto propio
 * del portafolio. Para actualizar el sitio se editan esos archivos, no este.
 */
import perfilJson from '../../content/profile.json'
import seccionesJson from '../../content/sections.json'
import evidenciasJson from '../../content/evidence.json'
import lineaTiempoJson from '../../content/timeline.json'
import proyectosJson from '../../content/projects.json'
import anexoJson from '../../content/anexo.json'
import documentosJson from '../../content/documentos.json'

import type {
  ArchivoAnexo,
  ArchivoDocumentos,
  ArchivoEvidencias,
  ArchivoLineaTiempo,
  ArchivoProyectos,
  Evidencia,
  GrupoAnexo,
  GrupoDocumentos,
  Perfil,
  Seccion,
} from '../tipos'

export const perfil = perfilJson as Perfil
export const secciones = (seccionesJson as { secciones: Seccion[] }).secciones
export const datosEvidencias = evidenciasJson as unknown as ArchivoEvidencias
export const evidencias = datosEvidencias.evidencias
export const lineaTiempo = lineaTiempoJson as ArchivoLineaTiempo
export const datosProyectos = proyectosJson as ArchivoProyectos
export const proyectos = datosProyectos.proyectos

/** Apartados numerados que forman el recorrido academico (excluye la presentacion). */
export const apartados = secciones.filter((s) => s.numero >= 1)

const porSlug = new Map(secciones.map((s) => [s.slug, s]))
const porCodigo = new Map(evidencias.map((e) => [e.codigo, e]))

export function seccionPorSlug(slug: string | undefined): Seccion | undefined {
  return slug ? porSlug.get(slug) : undefined
}

export function evidenciaPorCodigo(codigo: string | undefined): Evidencia | undefined {
  return codigo ? porCodigo.get(codigo) : undefined
}

/** Orden natural de los codigos: E2.3 va antes que E10.1. */
export function compararCodigos(a: string, b: string): number {
  const partes = (c: string) => {
    const m = /^E(\d+)\.(\d+)$/.exec(c)
    return m ? [Number(m[1]), Number(m[2])] : [Number.MAX_SAFE_INTEGER, 0]
  }
  const [a1, a2] = partes(a)
  const [b1, b2] = partes(b)
  return a1 - b1 || a2 - b2 || a.localeCompare(b)
}

export const evidenciasOrdenadas = [...evidencias].sort((a, b) =>
  compararCodigos(a.codigo, b.codigo),
)

export function evidenciasDeApartado(numero: number): Evidencia[] {
  return evidenciasOrdenadas.filter((e) => e.apartado === numero)
}

export const categoriasEvidencia = [...new Set(evidencias.map((e) => e.categoria))]
export const tiposEvidencia = [...new Set(evidencias.map((e) => e.tipo))].sort()
export const aniosEvidencia = [
  ...new Set(evidencias.map((e) => e.anio).filter((a): a is string => a !== null)),
].sort()

/** Un archivo solo llega al navegador si existe y su visibilidad es publica. */
export function archivoConsultable(evidencia: Evidencia): boolean {
  return evidencia.visibility === 'public' && evidencia.archivo !== null
}

export const rutaPublica = import.meta.env.BASE_URL

/** Resuelve una ruta de `public/` respetando la base con la que se publico el sitio. */
export function recurso(ruta: string): string {
  return rutaPublica.replace(/\/$/, '') + '/' + ruta.replace(/^\//, '')
}

// --- Anexo documental del expediente de 2020 ---

const anexoCrudo = anexoJson as unknown as ArchivoAnexo

/**
 * El nombre del archivo no se escribe en el JSON: se deriva del codigo del grupo
 * y del slug, con la misma regla que usa herramientas/preparar-anexo.ps1. Asi no
 * hay forma de que el manifiesto y las imagenes dejen de coincidir.
 */
const gruposAnexo = anexoCrudo.grupos.map((grupo) => {
  const anio = grupo.anio ?? '2020'
  return {
    ...grupo,
    paginas: grupo.paginas.map((pagina) => ({
      ...pagina,
      archivo: grupo.codigo + '_' + anio + '_' + pagina.slug + '_Ardon.jpg',
      carpeta: 'evidencias/anexo-' + anio,
    })),
  }
})

/** El anexo documental propiamente dicho es el expediente de 2020; las galerias
 *  posteriores (por ejemplo el curriculo firmado de 2026) solo se muestran en
 *  la ficha de su evidencia. */
export const anexo: ArchivoAnexo = {
  ...anexoCrudo,
  grupos: gruposAnexo.filter((g) => (g.anio ?? '2020') === '2020'),
}

export const totalPaginasAnexo = anexo.grupos.reduce((n, g) => n + g.paginas.length, 0)

// Si una evidencia tiene galeria de 2020 y otra mas reciente, la ficha muestra la reciente.
const anexoPorCodigo = new Map<string, GrupoAnexo>()
for (const g of [...gruposAnexo].sort((a, b) => (a.anio ?? '2020').localeCompare(b.anio ?? '2020'))) {
  anexoPorCodigo.set(g.codigo, g)
}

/** Paginas del anexo que respaldan un codigo de evidencia concreto. */
export function anexoDeEvidencia(codigo: string): GrupoAnexo | undefined {
  return anexoPorCodigo.get(codigo)
}

// --- Documentos de trabajo del periodo 2026 ---

const documentosCrudo = documentosJson as unknown as ArchivoDocumentos

/** Igual que en el anexo: el nombre del archivo se deriva, no se escribe. */
export const documentos: ArchivoDocumentos = {
  ...documentosCrudo,
  grupos: documentosCrudo.grupos.map((grupo) => ({
    ...grupo,
    documentos: grupo.documentos.map((d) => ({
      ...d,
      archivo: grupo.codigo + '_2026_' + d.slug + '_Ardon.' + (d.extension ?? 'pdf'),
    })),
  })),
}

export const totalDocumentos = documentos.grupos.reduce((n, g) => n + g.documentos.length, 0)

const documentosPorCodigo = new Map(documentos.grupos.map((g) => [g.codigo, g]))

/** Documentos del periodo 2026 que respaldan un codigo de evidencia. */
export function documentosDeEvidencia(codigo: string): GrupoDocumentos | undefined {
  return documentosPorCodigo.get(codigo)
}
