import { useState } from 'react'
import { recurso } from '../datos/contenido'
import type { Evidencia } from '../tipos'
import { Icono } from './Icono'

const EXTENSIONES_IMAGEN = ['.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif']
const EXTENSIONES_INTERACTIVAS = ['.html', '.htm']

function esImagen(archivo: string) {
  const nombre = archivo.toLowerCase()
  return EXTENSIONES_IMAGEN.some((ext) => nombre.endsWith(ext))
}

function esInteractivo(archivo: string) {
  const nombre = archivo.toLowerCase()
  return EXTENSIONES_INTERACTIVAS.some((ext) => nombre.endsWith(ext))
}

/**
 * Muestra el archivo de una evidencia publica. Los PDF van en <object>: si el
 * navegador del telefono no sabe dibujarlo, cae en los botones de abrir y
 * descargar, que es la unica salida fiable en moviles.
 */
export function VisorDocumento({ evidencia }: { evidencia: Evidencia }) {
  const [fallo, setFallo] = useState(false)

  if (!evidencia.archivo) return null
  const url = recurso('evidencias/' + evidencia.archivo)
  const imagen = esImagen(evidencia.archivo)

  // Un recurso interactivo no se incrusta: toma la pantalla completa, pide el
  // bloqueo de apagado y captura el teclado, cosas que no puede hacer dentro de
  // la ficha. Se abre en su propia pestana, que es como se usa en el aula.
  if (esInteractivo(evidencia.archivo)) {
    return (
      <section className="my-6">
        <h2 className="mb-3 font-serif text-xl font-semibold text-texto">Recurso interactivo</h2>
        <div className="tarjeta p-5">
          <p className="text-sm text-texto-suave">
            Este archivo es una página que se ejecuta en el navegador y usa la pantalla completa, de
            modo que se abre en una pestaña aparte en lugar de mostrarse aquí dentro.
          </p>
          <div className="mt-4 flex flex-wrap gap-2 no-imprimir">
            <a
              href={url}
              target="_blank"
              rel="noreferrer noopener"
              className="boton boton-primario"
            >
              <Icono nombre="externo" tamano={16} />
              Abrir el recurso
            </a>
            <a href={url} download className="boton boton-secundario">
              <Icono nombre="descargar" tamano={16} />
              Descargar
            </a>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="my-6">
      <h2 className="mb-3 font-serif text-xl font-semibold text-texto">Documento</h2>

      <div className="overflow-hidden rounded-xl border border-borde bg-superficie-2">
        {imagen ? (
          <img
            src={url}
            alt={'Evidencia ' + evidencia.codigo + ': ' + evidencia.titulo}
            loading="lazy"
            decoding="async"
            className="mx-auto block max-h-[75vh] w-auto"
            onError={() => setFallo(true)}
          />
        ) : (
          <object
            data={url}
            type="application/pdf"
            aria-label={'Documento de la evidencia ' + evidencia.codigo}
            className="h-[70vh] w-full"
          >
            <p className="p-6 text-sm text-texto-suave">
              Este navegador no puede mostrar el documento aquí. Use los botones de abajo para
              abrirlo o descargarlo.
            </p>
          </object>
        )}
      </div>

      {fallo ? (
        <p className="mt-2 text-sm text-texto-suave">
          El archivo no pudo mostrarse. Ábralo o descárguelo con los botones siguientes.
        </p>
      ) : null}

      <div className="mt-4 flex flex-wrap gap-2 no-imprimir">
        <a href={url} target="_blank" rel="noreferrer noopener" className="boton boton-secundario">
          <Icono nombre="externo" tamano={16} />
          Abrir documento
        </a>
        <a href={url} download className="boton boton-primario">
          <Icono nombre="descargar" tamano={16} />
          Descargar
        </a>
      </div>
    </section>
  )
}
