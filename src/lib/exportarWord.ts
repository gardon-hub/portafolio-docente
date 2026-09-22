import {
  datosEvidencias,
  evidenciasOrdenadas,
  lineaTiempo,
  perfil,
  proyectos,
  secciones,
} from '../datos/contenido'
import type { Bloque } from '../tipos'
import { crearZip, escaparXml } from './zip'

const W = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'

function parrafo(texto: string, estilo?: string, opciones?: { negrita?: boolean }): string {
  const props = '<w:pPr>' + (estilo ? '<w:pStyle w:val="' + estilo + '"/>' : '') + '</w:pPr>'
  const rpr = opciones?.negrita ? '<w:rPr><w:b/></w:rPr>' : ''
  return (
    '<w:p>' +
    props +
    '<w:r>' +
    rpr +
    '<w:t xml:space="preserve">' +
    escaparXml(texto) +
    '</w:t></w:r></w:p>'
  )
}

function celda(texto: string, encabezado = false): string {
  return (
    '<w:tc><w:tcPr><w:tcW w:w="0" w:type="auto"/>' +
    (encabezado ? '<w:shd w:val="clear" w:fill="EEF7F1"/>' : '') +
    '</w:tcPr>' +
    parrafo(texto, undefined, { negrita: encabezado }) +
    '</w:tc>'
  )
}

function tabla(columnas: string[], filas: string[][]): string {
  const bordes =
    '<w:tblBorders>' +
    ['top', 'left', 'bottom', 'right', 'insideH', 'insideV']
      .map((b) => '<w:' + b + ' w:val="single" w:sz="4" w:space="0" w:color="BCC1BD"/>')
      .join('') +
    '</w:tblBorders>'
  return (
    '<w:tbl><w:tblPr><w:tblW w:w="5000" w:type="pct"/>' +
    bordes +
    '</w:tblPr>' +
    '<w:tr>' +
    columnas.map((c) => celda(c, true)).join('') +
    '</w:tr>' +
    filas.map((f) => '<w:tr>' + f.map((c) => celda(c)).join('') + '</w:tr>').join('') +
    '</w:tbl>' +
    parrafo('')
  )
}

function bloqueAXml(bloque: Bloque): string {
  switch (bloque.tipo) {
    case 'parrafo':
      return (bloque.titulo ? parrafo(bloque.titulo, 'Heading3') : '') + parrafo(bloque.texto)
    case 'destacado':
      return parrafo(bloque.etiqueta, 'Heading3') + parrafo(bloque.texto)
    case 'nota':
      return parrafo('Nota: ' + bloque.texto)
    case 'lista':
      return (
        (bloque.titulo ? parrafo(bloque.titulo, 'Heading3') : '') +
        bloque.items.map((i) => parrafo('•  ' + i)).join('')
      )
    case 'tabla':
      return (
        (bloque.titulo ? parrafo(bloque.titulo, 'Heading3') : '') +
        tabla(bloque.columnas, bloque.filas) +
        (bloque.nota ? parrafo(bloque.nota) : '')
      )
    case 'tarjetas':
      return (
        (bloque.titulo ? parrafo(bloque.titulo, 'Heading3') : '') +
        bloque.items.map((i) => parrafo('•  ' + i.titulo + ': ' + i.texto)).join('')
      )
    case 'acordeon':
      return (
        (bloque.titulo ? parrafo(bloque.titulo, 'Heading3') : '') +
        bloque.items
          .map((i) => parrafo('•  ' + i.titulo) + i.contenido.map((c) => parrafo(c)).join(''))
          .join('')
      )
    case 'indicadores':
      return (
        (bloque.titulo ? parrafo(bloque.titulo, 'Heading3') : '') +
        bloque.items
          .map((i) => parrafo('•  ' + i.valor + ' ' + i.etiqueta + (i.nota ? ' — ' + i.nota : '')))
          .join('')
      )
    case 'linea-tiempo': {
      const grupo = lineaTiempo[bloque.referencia]
      const hitos = [...grupo.hitos].sort((a, b) => a.orden - b.orden)
      return (
        parrafo(grupo.titulo, 'Heading3') +
        parrafo(grupo.nota) +
        hitos.map((h) => parrafo('•  ' + h.periodo + ' — ' + h.titulo + '. ' + h.detalle)).join('')
      )
    }
    case 'publicaciones':
      return (
        (bloque.titulo ? parrafo(bloque.titulo, 'Heading3') : '') +
        bloque.items
          .map((i) =>
            parrafo('•  ' + i.referencia + (i.identificador ? ' ' + i.identificador : '')),
          )
          .join('') +
        (bloque.nota ? parrafo(bloque.nota) : '')
      )
    case 'recursos':
      return (
        (bloque.titulo ? parrafo(bloque.titulo, 'Heading3') : '') +
        bloque.items
          .map((r) =>
            parrafo(
              '•  ' +
                r.titulo +
                ' (' +
                r.formato +
                ', ' +
                r.plataforma +
                '). ' +
                r.descripcion +
                ' ' +
                r.enlace,
            ),
          )
          .join('') +
        (bloque.nota ? parrafo(bloque.nota) : '')
      )
    case 'proyectos':
      return (
        (bloque.titulo ? parrafo(bloque.titulo, 'Heading3') : '') +
        proyectos.map((p) => parrafo('•  ' + p.nombre + ': ' + p.descripcion)).join('')
      )
    case 'enlace-evidencias':
      return parrafo(bloque.texto)
  }
}

const ESTILOS = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="${W}">
  <w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/><w:sz w:val="22"/></w:rPr></w:rPrDefault></w:docDefaults>
  <w:style w:type="paragraph" w:styleId="Title"><w:name w:val="Title"/><w:pPr><w:spacing w:after="120"/></w:pPr><w:rPr><w:b/><w:sz w:val="48"/><w:color w:val="1B5436"/></w:rPr></w:style>
  <w:style w:type="paragraph" w:styleId="Heading1"><w:name w:val="heading 1"/><w:pPr><w:spacing w:before="360" w:after="120"/><w:outlineLvl w:val="0"/></w:pPr><w:rPr><w:b/><w:sz w:val="32"/><w:color w:val="1B5436"/></w:rPr></w:style>
  <w:style w:type="paragraph" w:styleId="Heading2"><w:name w:val="heading 2"/><w:pPr><w:spacing w:before="280" w:after="100"/><w:outlineLvl w:val="1"/></w:pPr><w:rPr><w:b/><w:sz w:val="26"/><w:color w:val="1C3D5E"/></w:rPr></w:style>
  <w:style w:type="paragraph" w:styleId="Heading3"><w:name w:val="heading 3"/><w:pPr><w:spacing w:before="200" w:after="80"/><w:outlineLvl w:val="2"/></w:pPr><w:rPr><w:b/><w:sz w:val="23"/></w:rPr></w:style>
</w:styles>`

const TIPOS_CONTENIDO = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
  <Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
</Types>`

const RELACIONES = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`

const RELACIONES_DOC = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>`

function cuerpoDocumento(): string {
  const partes: string[] = []

  partes.push(parrafo(perfil.institucion.toUpperCase(), 'Heading2'))
  partes.push(parrafo(perfil.tituloPortafolio + ' ' + perfil.anio, 'Title'))
  partes.push(parrafo(perfil.lemaPortafolio))
  partes.push(parrafo(perfil.nombre, 'Heading2'))
  partes.push(parrafo(perfil.cargo + ' | ' + perfil.cargoSecundario))
  partes.push(parrafo(perfil.unidadAcademica))
  partes.push(parrafo(perfil.periodo + '   |   ' + perfil.version))
  partes.push(parrafo(perfil.guiaReferencia))

  for (const seccion of secciones) {
    const titulo = seccion.numero >= 1 ? seccion.numero + '. ' + seccion.titulo : seccion.titulo
    partes.push(parrafo(titulo, 'Heading1'))
    for (const bloque of seccion.bloques) partes.push(bloqueAXml(bloque))

    const codigos = seccion.evidencias
    if (codigos.length > 0) {
      partes.push(parrafo('Evidencias del apartado', 'Heading3'))
      for (const codigo of codigos) {
        const e = evidenciasOrdenadas.find((x) => x.codigo === codigo)
        if (e) partes.push(parrafo('•  ' + e.codigo + ' ' + e.titulo + ' — ' + e.estadoTexto))
      }
    }
  }

  partes.push(parrafo('Matriz de evidencias', 'Heading1'))
  partes.push(parrafo(datosEvidencias.notaHistorica))
  partes.push(parrafo(datosEvidencias.notaMatriz))
  partes.push(
    tabla(
      ['Código', 'Evidencia', 'Apartado', 'Estado', 'Visibilidad'],
      evidenciasOrdenadas.map((e) => [
        e.codigo,
        e.titulo,
        String(e.apartado),
        e.estadoTexto,
        datosEvidencias.visibilidades[e.visibility].etiqueta,
      ]),
    ),
  )

  return partes.join('')
}

/** Genera el .docx del portafolio completo y lo entrega al navegador. */
export function descargarWord() {
  const documento =
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
    '<w:document xmlns:w="' +
    W +
    '"><w:body>' +
    cuerpoDocumento() +
    '<w:sectPr><w:pgSz w:w="11906" w:h="16838"/>' +
    '<w:pgMar w:top="1134" w:right="1134" w:bottom="1134" w:left="1134"/></w:sectPr>' +
    '</w:body></w:document>'

  const blob = crearZip([
    { nombre: '[Content_Types].xml', contenido: TIPOS_CONTENIDO },
    { nombre: '_rels/.rels', contenido: RELACIONES },
    { nombre: 'word/_rels/document.xml.rels', contenido: RELACIONES_DOC },
    { nombre: 'word/document.xml', contenido: documento },
    { nombre: 'word/styles.xml', contenido: ESTILOS },
  ])

  const archivo = new Blob([blob], {
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  })
  const url = URL.createObjectURL(archivo)
  const enlace = document.createElement('a')
  enlace.href = url
  enlace.download = 'Portafolio_Docente_' + perfil.anio + '_Ardon.docx'
  document.body.appendChild(enlace)
  enlace.click()
  enlace.remove()
  // Liberar despues del clic: revocar de inmediato cancela la descarga en algunos navegadores.
  setTimeout(() => URL.revokeObjectURL(url), 10_000)
}
