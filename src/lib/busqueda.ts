import { evidenciasOrdenadas, proyectos, secciones } from '../datos/contenido'
import type { Bloque } from '../tipos'

export interface Resultado {
  clase: 'apartado' | 'evidencia' | 'proyecto'
  titulo: string
  subtitulo: string
  ruta: string
  cuerpo: string
  codigo?: string
}

/** Texto plano de un bloque, para poder buscar dentro de tablas, listas y tarjetas. */
function textoDeBloque(bloque: Bloque): string {
  switch (bloque.tipo) {
    case 'parrafo':
      return (bloque.titulo ?? '') + ' ' + bloque.texto
    case 'destacado':
      return bloque.etiqueta + ' ' + bloque.texto
    case 'nota':
    case 'enlace-evidencias':
      return bloque.texto
    case 'lista':
      return (bloque.titulo ?? '') + ' ' + bloque.items.join(' ')
    case 'tabla':
      return (
        (bloque.titulo ?? '') +
        ' ' +
        bloque.columnas.join(' ') +
        ' ' +
        bloque.filas.map((f) => f.join(' ')).join(' ') +
        ' ' +
        (bloque.nota ?? '')
      )
    case 'tarjetas':
      return (
        (bloque.titulo ?? '') + ' ' + bloque.items.map((i) => i.titulo + ' ' + i.texto).join(' ')
      )
    case 'acordeon':
      return (
        (bloque.titulo ?? '') +
        ' ' +
        bloque.items.map((i) => i.titulo + ' ' + i.contenido.join(' ')).join(' ')
      )
    case 'indicadores':
      return (
        (bloque.titulo ?? '') +
        ' ' +
        bloque.items.map((i) => i.valor + ' ' + i.etiqueta + ' ' + (i.nota ?? '')).join(' ')
      )
    case 'publicaciones':
      return (
        (bloque.titulo ?? '') +
        ' ' +
        bloque.items
          .map((i) => i.referencia + ' ' + i.clase + ' ' + (i.identificador ?? ''))
          .join(' ')
      )
    case 'recursos':
      return (
        (bloque.titulo ?? '') +
        ' ' +
        bloque.items
          .map((i) => i.titulo + ' ' + i.plataforma + ' ' + i.formato + ' ' + i.descripcion)
          .join(' ')
      )
    case 'linea-tiempo':
      return bloque.titulo ?? ''
    case 'proyectos':
      return bloque.titulo ?? ''
  }
}

/** Quita acentos y pasa a minusculas: buscar "practica" tiene que encontrar "práctica". */
export function normalizar(texto: string): string {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

const indice: (Resultado & { busqueda: string })[] = [
  ...secciones.map((s) => {
    const cuerpo = s.bloques.map(textoDeBloque).join(' ')
    const item: Resultado = {
      clase: 'apartado',
      titulo: s.numero >= 1 ? s.numero + '. ' + s.titulo : s.titulo,
      subtitulo: 'Apartado del portafolio',
      ruta: '/portafolio/' + s.slug,
      cuerpo: s.resumen,
    }
    return { ...item, busqueda: normalizar(s.titulo + ' ' + s.resumen + ' ' + cuerpo) }
  }),
  ...evidenciasOrdenadas.map((e) => {
    const item: Resultado = {
      clase: 'evidencia',
      titulo: e.titulo,
      subtitulo: 'Evidencia · ' + e.categoria,
      ruta: '/evidencias/' + e.codigo,
      cuerpo: e.descripcion,
      codigo: e.codigo,
    }
    return {
      ...item,
      busqueda: normalizar(
        [
          e.codigo,
          e.titulo,
          e.descripcion,
          e.categoria,
          e.tipo,
          e.periodo,
          e.anio ?? '',
          e.estadoTexto,
          e.fuenteDocumento,
        ].join(' '),
      ),
    }
  }),
  ...proyectos.map((p) => {
    const item: Resultado = {
      clase: 'proyecto',
      titulo: p.nombre,
      subtitulo: 'Innovación educativa · ' + p.area,
      ruta: '/portafolio/innovacion-educativa',
      cuerpo: p.descripcion,
    }
    return { ...item, busqueda: normalizar(p.nombre + ' ' + p.descripcion + ' ' + p.area) }
  }),
]

export function buscar(consulta: string): Resultado[] {
  const terminos = normalizar(consulta).split(/\s+/).filter(Boolean)
  if (terminos.length === 0) return []

  return indice
    .map((item) => {
      let puntaje = 0
      for (const t of terminos) {
        if (!item.busqueda.includes(t)) return null
        // Coincidir en el titulo pesa mas que coincidir en el cuerpo del apartado.
        puntaje += normalizar(item.titulo).includes(t) ? 3 : 1
        if (item.codigo && normalizar(item.codigo) === t) puntaje += 6
      }
      return { item, puntaje }
    })
    .filter((r): r is { item: Resultado & { busqueda: string }; puntaje: number } => r !== null)
    .sort((a, b) => b.puntaje - a.puntaje)
    .map((r) => {
      const { busqueda: _descartar, ...resto } = r.item
      void _descartar
      return resto
    })
}
