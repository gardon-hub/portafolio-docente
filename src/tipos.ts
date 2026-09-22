/** Tipos del contenido editable. Reflejan los archivos de la carpeta `content/`. */

export type Visibilidad = 'public' | 'restricted' | 'private'

export type EstadoEvidencia = 'historico' | 'vigente' | 'pendiente' | 'restringido'

export type OrigenExpediente = 'historico-2020' | 'vigente-2026' | null

export interface Evidencia {
  codigo: string
  titulo: string
  categoria: string
  tipo: string
  apartado: number
  apartadoSlug: string
  periodo: string
  anio: string | null
  descripcion: string
  estado: EstadoEvidencia
  estadoTexto: string
  origenExpediente: OrigenExpediente
  visibility: Visibilidad
  motivoRestriccion: string | null
  advertenciaPrivacidad?: string
  notaCodigo?: string
  enMatriz: boolean
  fuenteDocumento: string
  anexo: string | number | null
  archivo: string | null
  miniatura: string | null
  tipoArchivo: string | null
}

export interface DescriptorEstado {
  etiqueta: string
  descripcion: string
}

export interface ArchivoEvidencias {
  notaHistorica: string
  notaPrivacidad: string
  notaMatriz: string
  estados: Record<EstadoEvidencia, DescriptorEstado>
  visibilidades: Record<Visibilidad, DescriptorEstado>
  evidencias: Evidencia[]
}

export interface Indicador {
  valor: string
  etiqueta: string
  nota?: string
}

export interface Publicacion {
  referencia: string
  clase: string
  anio: string
  identificador: string | null
  enlace: string | null
  nota?: string
}

/** Recurso didáctico alojado fuera del sitio y consultable con un enlace. */
export interface RecursoEnLinea {
  titulo: string
  plataforma: string
  formato: string
  descripcion: string
  enlace: string
  detalle?: string
}

export type Bloque =
  | { tipo: 'parrafo'; titulo?: string; texto: string }
  | { tipo: 'destacado'; etiqueta: string; texto: string }
  | { tipo: 'nota'; texto: string }
  | { tipo: 'lista'; titulo?: string; items: string[] }
  | { tipo: 'tabla'; titulo?: string; nota?: string; columnas: string[]; filas: string[][] }
  | { tipo: 'tarjetas'; titulo?: string; items: { titulo: string; texto: string }[] }
  | { tipo: 'acordeon'; titulo?: string; items: { titulo: string; contenido: string[] }[] }
  | { tipo: 'indicadores'; titulo?: string; items: Indicador[] }
  | { tipo: 'linea-tiempo'; titulo?: string; referencia: 'trayectoria' | 'formacion' }
  | { tipo: 'proyectos'; titulo?: string }
  | { tipo: 'publicaciones'; titulo?: string; nota?: string; items: Publicacion[] }
  | { tipo: 'recursos'; titulo?: string; nota?: string; items: RecursoEnLinea[] }
  | { tipo: 'enlace-evidencias'; texto: string }

export interface Seccion {
  id: string
  numero: number
  slug: string
  titulo: string
  resumen: string
  icono: string
  evidencias: string[]
  bloques: Bloque[]
}

export interface Hito {
  periodo: string
  orden: number
  titulo: string
  detalle: string
  tipo: string
  evidencias: string[]
}

export interface GrupoHitos {
  titulo: string
  nota: string
  hitos: Hito[]
}

export interface ArchivoLineaTiempo {
  trayectoria: GrupoHitos
  formacion: GrupoHitos
}

export interface Proyecto {
  id: string
  nombre: string
  descripcion: string
  area: string
  enlace: string | null
  evidencias: string[]
}

export interface ArchivoProyectos {
  nota: string
  proyectos: Proyecto[]
}

export interface Perfil {
  nombre: string
  cargo: string
  cargoSecundario: string
  unidadAcademica: string
  departamento: string
  institucion: string
  siglaInstitucion: string
  sede: string
  anio: string
  periodo: string
  version: string
  tituloPortafolio: string
  lemaPortafolio: string
  guiaReferencia: string
  fotografia: { archivo: string | null; alt: string; iniciales: string; nota: string }
  identificadores: { etiqueta: string; valor: string; enlace: string | null; origen: string }[]
  contacto: { correoInstitucional: string | null; notaCorreo: string; sitio: string | null }
  presentacionBreve: string
  indicadores: Indicador[]
  creditos: { linea1: string; linea2: string; linea3: string }
  documentoFuente: { titulo: string; archivo: string | null; nota: string }
  /** PDF ya generado del portafolio completo; null mientras no se haya creado. */
  pdfCompleto: {
    archivo: string | null
    paginas: number
    actualizado: string
    nota: string
  } | null
}

export interface PaginaAnexo {
  pagina: string
  slug: string
  titulo: string
  fecha: string | null
  nota?: string
  girar?: number
  censura?: number[][]
  /** Los calcula el cargador a partir del codigo del grupo, su anio y el slug. */
  archivo: string
  carpeta: string
}

export interface GrupoAnexo {
  codigo: string
  /** Anio de la carpeta de imagenes; sin el, es el expediente de 2020. */
  anio?: string
  titulo: string
  descripcion: string
  paginas: PaginaAnexo[]
}

export interface ExclusionAnexo {
  paginas: string[]
  motivo: string
  categoria: 'privacidad' | 'sin-contenido' | 'pertinencia'
}

export interface ArchivoAnexo {
  titulo: string
  subtitulo: string
  introduccion: string
  notaHistorica: string
  notaPreparacion: string
  totalPaginasExpediente: number
  exclusiones: ExclusionAnexo[]
  grupos: GrupoAnexo[]
}

export interface DocumentoEvidencia {
  slug: string
  titulo: string
  descripcion: string
  origen: string
  nota?: string
  censura?: boolean
  /** Extension publicada. Por defecto pdf; una imagen se copia tal cual. */
  extension?: string
  /** Los calcula el cargador a partir del codigo del grupo, su anio y el slug. */
  archivo: string
  carpeta: string
}

export interface GrupoDocumentos {
  codigo: string
  documentos: DocumentoEvidencia[]
}

export interface ArchivoDocumentos {
  titulo: string
  introduccion: string
  notaPreparacion: string
  grupos: GrupoDocumentos[]
}
