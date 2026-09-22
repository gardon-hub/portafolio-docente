import { recurso } from '../datos/contenido'
import type { DocumentoEvidencia } from '../tipos'
import { Icono } from './Icono'

/**
 * Documentos del periodo 2026 adjuntos a una evidencia. Se enlazan, no se
 * incrustan: son PDF de varias paginas y el visor se abre solo si el lector
 * lo pide, para no descargarlos sin que hagan falta.
 */
export function ListaDocumentos({ documentos }: { documentos: DocumentoEvidencia[] }) {
  return (
    <ul className="space-y-3">
      {documentos.map((d) => {
        const url = recurso('evidencias/documentos-2026/' + d.archivo)
        return (
          <li key={d.archivo} className="tarjeta p-4">
            <div className="flex items-start gap-3">
              <span
                aria-hidden="true"
                className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-lg bg-acento-suave text-acento"
              >
                <Icono nombre="documento" tamano={18} />
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="font-serif text-base font-semibold text-texto">{d.titulo}</h3>
                <p className="mt-1 text-sm text-texto-suave">{d.descripcion}</p>
                {d.nota ? (
                  <p className="mt-2 flex items-start gap-1.5 text-xs text-ambar">
                    <Icono nombre="candado" tamano={13} />
                    {d.nota}
                  </p>
                ) : null}
                <div className="mt-3 flex flex-wrap gap-2">
                  <a
                    href={url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="boton boton-secundario"
                  >
                    <Icono nombre="externo" tamano={15} />
                    Abrir
                  </a>
                  <a href={url} download className="boton boton-secundario">
                    <Icono nombre="descargar" tamano={15} />
                    Descargar
                  </a>
                </div>
              </div>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
