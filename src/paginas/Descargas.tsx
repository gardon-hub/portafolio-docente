import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Icono } from '../componentes/Icono'
import { evidenciasOrdenadas, perfil, recurso, secciones } from '../datos/contenido'
import { useMetadatos } from '../ganchos/useMetadatos'
import { descargarWord } from '../lib/exportarWord'

export function Descargas() {
  useMetadatos(
    'Descargas e impresión',
    'Descargue el portafolio docente ' +
      perfil.anio +
      ' en Word o genere el PDF desde la versión optimizada para impresión.',
  )

  const [estado, setEstado] = useState<'listo' | 'generando' | 'error'>('listo')

  const generarWord = () => {
    setEstado('generando')
    try {
      descargarWord()
      setEstado('listo')
    } catch {
      setEstado('error')
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="font-serif text-3xl font-bold text-texto sm:text-4xl">
        Descargas e impresión
      </h1>
      <p className="mt-3 text-[0.975rem] text-texto-suave">
        El portafolio completo puede llevarse en PDF, en Word o al papel. Todas las salidas incluyen
        los {secciones.length} apartados y la matriz de {evidenciasOrdenadas.length} evidencias; no
        incluyen los archivos anexos, que se consultan en el Centro de evidencias.
      </p>

      <ul className="mt-8 space-y-4">
        {perfil.pdfCompleto?.archivo ? (
          <li className="tarjeta p-5">
            <h2 className="flex items-center gap-2 font-serif text-lg font-semibold text-texto">
              <Icono nombre="documento" tamano={20} />
              Portafolio completo en PDF
            </h2>
            <p className="mt-2 text-sm text-texto-suave">
              Archivo listo de {perfil.pdfCompleto.paginas} páginas, actualizado al{' '}
              {perfil.pdfCompleto.actualizado}. {perfil.pdfCompleto.nota}
            </p>
            <a
              href={recurso('documentos/' + perfil.pdfCompleto.archivo)}
              download
              className="boton boton-primario mt-4"
            >
              <Icono nombre="descargar" tamano={16} />
              Descargar el PDF completo
            </a>
          </li>
        ) : null}

        <li className="tarjeta p-5">
          <h2 className="flex items-center gap-2 font-serif text-lg font-semibold text-texto">
            <Icono nombre="documento" tamano={20} />
            Documento de Word (.docx)
          </h2>
          <p className="mt-2 text-sm text-texto-suave">
            Genera el archivo en su navegador, con los apartados y las tablas del portafolio. No se
            envía nada a ningún servidor.
          </p>
          <button type="button" onClick={generarWord} className="boton boton-primario mt-4">
            <Icono nombre="descargar" tamano={16} />
            {estado === 'generando' ? 'Generando…' : 'Descargar en Word'}
          </button>
          {estado === 'error' ? (
            <p className="mt-2 text-sm text-ambar">
              No se pudo generar el archivo en este navegador. Use la versión para imprimir y guarde
              como PDF.
            </p>
          ) : null}
        </li>

        <li className="tarjeta p-5">
          <h2 className="flex items-center gap-2 font-serif text-lg font-semibold text-texto">
            <Icono nombre="imprimir" tamano={20} />
            PDF o impresión en papel
          </h2>
          <p className="mt-2 text-sm text-texto-suave">
            Abre el portafolio en una sola página, a una columna y sin menús. Desde el diálogo de
            impresión puede elegir «Guardar como PDF».
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link to="/imprimir" className="boton boton-primario">
              <Icono nombre="imprimir" tamano={16} />
              Abrir versión para imprimir
            </Link>
            <Link to="/imprimir?auto=1" className="boton boton-secundario">
              Abrir e imprimir directamente
            </Link>
          </div>
        </li>

        {perfil.documentoFuente.archivo ? (
          <li className="tarjeta p-5">
            <h2 className="flex items-center gap-2 font-serif text-lg font-semibold text-texto">
              <Icono nombre="libro" tamano={20} />
              Documento original
            </h2>
            <p className="mt-2 text-sm text-texto-suave">
              {perfil.documentoFuente.titulo}, la fuente de la que se construyó este sitio.
            </p>
            <a
              href={recurso('documentos/' + perfil.documentoFuente.archivo)}
              download
              className="boton boton-secundario mt-4"
            >
              <Icono nombre="descargar" tamano={16} />
              Descargar el documento original
            </a>
          </li>
        ) : (
          <li className="rounded-xl border border-dashed border-borde-fuerte bg-superficie-2 p-5">
            <h2 className="font-serif text-lg font-semibold text-texto">Documento original</h2>
            <p className="mt-2 text-sm text-texto-suave">{perfil.documentoFuente.nota}</p>
          </li>
        )}
      </ul>
    </div>
  )
}
