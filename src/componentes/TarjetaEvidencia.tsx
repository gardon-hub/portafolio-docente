import { Link } from 'react-router-dom'
import { archivoConsultable, datosEvidencias, recurso } from '../datos/contenido'
import type { Evidencia } from '../tipos'
import { Icono } from './Icono'
import { Insignia, InsigniaEstado, InsigniaVisibilidad } from './Insignia'

/** Vineta de la evidencia: la miniatura real si existe, y si no una ficha con el codigo. */
function Miniatura({ evidencia }: { evidencia: Evidencia }) {
  const historico = evidencia.origenExpediente === 'historico-2020'
  if (evidencia.miniatura && evidencia.visibility === 'public') {
    return (
      <img
        src={recurso('evidencias/' + evidencia.miniatura)}
        alt={'Miniatura de la evidencia ' + evidencia.codigo + ': ' + evidencia.titulo}
        loading="lazy"
        decoding="async"
        width={112}
        height={144}
        className="h-36 w-28 shrink-0 rounded-lg border border-borde object-cover"
      />
    )
  }
  return (
    <div
      aria-hidden="true"
      className={
        'flex h-36 w-28 shrink-0 flex-col items-center justify-center gap-2 rounded-lg border text-center ' +
        (historico
          ? 'border-azul-borde bg-azul-suave text-azul'
          : 'border-borde bg-superficie-2 text-texto-tenue')
      }
    >
      <Icono nombre={evidencia.archivo ? 'documento' : 'carpeta'} tamano={26} />
      <span className="font-serif text-lg font-semibold">{evidencia.codigo}</span>
      <span className="px-2 text-[0.65rem] leading-tight">
        {evidencia.tipoArchivo ?? 'Sin archivo adjunto'}
      </span>
    </div>
  )
}

export function TarjetaEvidencia({ evidencia }: { evidencia: Evidencia }) {
  const estado = datosEvidencias.estados[evidencia.estado]
  const visibilidad = datosEvidencias.visibilidades[evidencia.visibility]
  const historico = evidencia.origenExpediente === 'historico-2020'
  const consultable = archivoConsultable(evidencia)

  return (
    <article
      id={evidencia.codigo}
      className={
        'tarjeta scroll-mt-28 p-4 sm:p-5 ' +
        (historico ? 'border-l-4 border-l-azul' : 'border-l-4 border-l-transparent')
      }
    >
      <div className="flex flex-col gap-4 sm:flex-row">
        <Miniatura evidencia={evidencia} />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-md bg-acento px-2 py-0.5 font-mono text-xs font-bold text-sobre-acento">
              {evidencia.codigo}
            </span>
            <InsigniaEstado
              estado={evidencia.estado}
              etiqueta={estado.etiqueta}
              descripcion={estado.descripcion}
            />
            <InsigniaVisibilidad
              visibilidad={evidencia.visibility}
              etiqueta={visibilidad.etiqueta}
              descripcion={visibilidad.descripcion}
            />
            {!evidencia.enMatriz ? (
              <Insignia tono="neutro" icono="info" titulo={evidencia.estadoTexto}>
                Fuera de la matriz
              </Insignia>
            ) : null}
          </div>

          <h3 className="mt-2 font-serif text-lg font-semibold text-texto">
            <Link to={'/evidencias/' + evidencia.codigo} className="no-underline hover:underline">
              {evidencia.titulo}
            </Link>
          </h3>

          <p className="mt-1.5 text-sm text-texto-suave">{evidencia.descripcion}</p>

          <dl className="mt-3 grid grid-cols-1 gap-x-6 gap-y-1.5 text-xs sm:grid-cols-2">
            <div className="flex gap-1.5">
              <dt className="font-semibold text-texto-tenue">Apartado:</dt>
              <dd>
                <Link
                  to={'/portafolio/' + evidencia.apartadoSlug}
                  className="no-underline hover:underline"
                >
                  {evidencia.apartado}
                </Link>
              </dd>
            </div>
            <div className="flex gap-1.5">
              <dt className="font-semibold text-texto-tenue">Categoría:</dt>
              <dd className="text-texto-suave">{evidencia.categoria}</dd>
            </div>
            <div className="flex gap-1.5">
              <dt className="font-semibold text-texto-tenue">Tipo:</dt>
              <dd className="text-texto-suave">{evidencia.tipo}</dd>
            </div>
            <div className="flex gap-1.5">
              <dt className="font-semibold text-texto-tenue">Periodo:</dt>
              <dd className="text-texto-suave">{evidencia.periodo}</dd>
            </div>
            <div className="flex gap-1.5">
              <dt className="font-semibold text-texto-tenue">Anexo:</dt>
              <dd className="text-texto-suave">{evidencia.anexo ?? 'Sin asignar'}</dd>
            </div>
            <div className="flex gap-1.5">
              <dt className="font-semibold text-texto-tenue">Estado en la matriz:</dt>
              <dd className="text-texto-suave">{evidencia.estadoTexto}</dd>
            </div>
          </dl>

          <div className="mt-4 flex flex-wrap gap-2">
            <Link to={'/evidencias/' + evidencia.codigo} className="boton boton-secundario">
              <Icono nombre="ojo" tamano={16} />
              Ver ficha
            </Link>
            {consultable ? (
              <a
                href={recurso('evidencias/' + evidencia.archivo)}
                download
                className="boton boton-primario"
              >
                <Icono nombre="descargar" tamano={16} />
                Descargar
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  )
}
