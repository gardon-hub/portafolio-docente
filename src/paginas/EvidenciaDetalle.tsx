import { Link, useParams } from 'react-router-dom'
import { Icono } from '../componentes/Icono'
import { Insignia, InsigniaEstado, InsigniaVisibilidad } from '../componentes/Insignia'
import { GaleriaAnexo } from '../componentes/GaleriaAnexo'
import { ListaDocumentos } from '../componentes/ListaDocumentos'
import { VisorDocumento } from '../componentes/VisorDocumento'
import {
  anexoDeEvidencia,
  documentosDeEvidencia,
  archivoConsultable,
  datosEvidencias,
  evidenciaPorCodigo,
  evidenciasOrdenadas,
  recurso,
  seccionPorSlug,
} from '../datos/contenido'
import { useMetadatos } from '../ganchos/useMetadatos'
import { NoEncontrada } from './NoEncontrada'

export function EvidenciaDetalle() {
  const { codigo } = useParams<{ codigo: string }>()
  const evidencia = evidenciaPorCodigo(codigo)

  useMetadatos(
    evidencia ? evidencia.codigo + ' · ' + evidencia.titulo : null,
    evidencia ? evidencia.descripcion : 'Evidencia no encontrada.',
  )

  if (!evidencia) return <NoEncontrada />

  const seccion = seccionPorSlug(evidencia.apartadoSlug)
  const grupoAnexo = anexoDeEvidencia(evidencia.codigo)
  const grupoDocumentos = documentosDeEvidencia(evidencia.codigo)
  const estado = datosEvidencias.estados[evidencia.estado]
  const visibilidad = datosEvidencias.visibilidades[evidencia.visibility]
  const indice = evidenciasOrdenadas.findIndex((e) => e.codigo === evidencia.codigo)
  const anterior = indice > 0 ? evidenciasOrdenadas[indice - 1] : null
  const siguiente = indice < evidenciasOrdenadas.length - 1 ? evidenciasOrdenadas[indice + 1] : null
  const historico = evidencia.origenExpediente === 'historico-2020'

  const ficha: { termino: string; dato: string }[] = [
    { termino: 'Código', dato: evidencia.codigo },
    { termino: 'Categoría', dato: evidencia.categoria },
    { termino: 'Tipo de evidencia', dato: evidencia.tipo },
    { termino: 'Fecha o período', dato: evidencia.periodo },
    { termino: 'Apartado', dato: seccion ? seccion.numero + '. ' + seccion.titulo : '—' },
    {
      termino: 'Número de anexo',
      dato: evidencia.anexo === null ? 'Sin asignar' : String(evidencia.anexo),
    },
    { termino: 'Página fuente', dato: evidencia.fuenteDocumento },
    { termino: 'Tipo de archivo', dato: evidencia.tipoArchivo ?? 'Sin archivo adjunto' },
    { termino: 'Estado en la matriz', dato: evidencia.estadoTexto },
    {
      termino: 'Origen',
      dato: historico
        ? 'Expediente histórico compilado en enero de 2020'
        : evidencia.origenExpediente === 'vigente-2026'
          ? 'Periodo académico 2026'
          : 'Pendiente de definir',
    },
  ]

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <nav aria-label="Ruta" className="mb-4 text-xs text-texto-tenue no-imprimir">
        <Link to="/" className="no-underline hover:underline">
          Inicio
        </Link>
        <span className="mx-1.5">/</span>
        <Link to="/evidencias" className="no-underline hover:underline">
          Evidencias
        </Link>
        <span className="mx-1.5">/</span>
        <span className="text-texto-suave">{evidencia.codigo}</span>
      </nav>

      <header className={historico ? 'border-l-4 border-azul pl-4' : ''}>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-md bg-acento px-2.5 py-1 font-mono text-sm font-bold text-sobre-acento">
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
          {historico ? (
            <Insignia tono="azul" icono="reloj">
              Expediente 2020
            </Insignia>
          ) : null}
          {!evidencia.enMatriz ? (
            <Insignia tono="neutro" icono="info">
              Fuera de la matriz maestra
            </Insignia>
          ) : null}
        </div>

        <h1 className="mt-3 font-serif text-3xl font-bold text-texto">{evidencia.titulo}</h1>
        <p className="mt-3 text-[0.975rem] text-texto-suave">{evidencia.descripcion}</p>
      </header>

      {evidencia.motivoRestriccion ? (
        <aside className="my-6 flex gap-3 rounded-xl border border-ambar-borde bg-ambar-suave p-4">
          <span className="mt-0.5 shrink-0 text-ambar">
            <Icono nombre="candado" tamano={20} />
          </span>
          <div className="text-sm text-texto-suave">
            <p className="font-semibold text-texto">Por qué no se publica el archivo</p>
            <p className="mt-1">{evidencia.motivoRestriccion}</p>
          </div>
        </aside>
      ) : null}

      {evidencia.advertenciaPrivacidad ? (
        <aside className="my-6 flex gap-3 rounded-xl border border-borde bg-superficie-2 p-4">
          <span className="mt-0.5 shrink-0 text-texto-tenue">
            <Icono nombre="alerta" tamano={20} />
          </span>
          <div className="text-sm text-texto-suave">
            {/* Cuando todavia no hay archivo, la advertencia es una instruccion para
                quien lo prepare; cuando ya lo hay, es una aclaracion sobre lo que
                el visitante esta viendo. El mismo texto, distinto encabezado. */}
            <p className="font-semibold text-texto">
              {evidencia.archivo ? 'Sobre este archivo' : 'Antes de adjuntar este archivo'}
            </p>
            <p className="mt-1">{evidencia.advertenciaPrivacidad}</p>
          </div>
        </aside>
      ) : null}

      {evidencia.notaCodigo ? (
        <aside className="my-6 flex gap-3 rounded-xl border border-borde bg-superficie-2 p-4">
          <span className="mt-0.5 shrink-0 text-texto-tenue">
            <Icono nombre="info" tamano={20} />
          </span>
          <p className="text-sm text-texto-suave">{evidencia.notaCodigo}</p>
        </aside>
      ) : null}

      <section aria-labelledby="ficha" className="my-8">
        <h2 id="ficha" className="mb-3 font-serif text-xl font-semibold text-texto">
          Ficha de la evidencia
        </h2>
        <dl className="overflow-hidden rounded-xl border border-borde">
          {ficha.map((f, i) => (
            <div
              key={f.termino}
              className={
                'grid gap-1 px-4 py-3 sm:grid-cols-[12rem_1fr] sm:gap-4 ' +
                (i % 2 === 0 ? 'bg-superficie' : 'bg-superficie-2')
              }
            >
              <dt className="text-xs font-semibold tracking-wide text-texto-tenue uppercase">
                {f.termino}
              </dt>
              <dd className="text-sm text-texto">{f.dato}</dd>
            </div>
          ))}
        </dl>
      </section>

      {grupoDocumentos ? (
        <section aria-labelledby="documentos" className="my-8">
          <h2 id="documentos" className="font-serif text-xl font-semibold text-texto">
            Documentos del periodo 2026
          </h2>
          <p className="mt-1.5 mb-4 text-sm text-texto-suave">
            {grupoDocumentos.documentos.length}{' '}
            {grupoDocumentos.documentos.length === 1 ? 'documento' : 'documentos'} de trabajo que
            respaldan esta evidencia.
          </p>
          <ListaDocumentos documentos={grupoDocumentos.documentos} />
        </section>
      ) : null}

      {grupoAnexo ? (
        <section aria-labelledby="anexo" className="my-8">
          <h2 id="anexo" className="font-serif text-xl font-semibold text-texto">
            {grupoAnexo.anio ? grupoAnexo.titulo : 'Páginas del anexo documental'}
          </h2>
          <p className="mt-1.5 text-sm text-texto-suave">
            {grupoAnexo.anio
              ? grupoAnexo.paginas.length + ' páginas. ' + grupoAnexo.descripcion
              : grupoAnexo.paginas.length +
                ' páginas del expediente de enero de 2020 respaldan esta evidencia.'}{' '}
            Pulse cualquiera para verla completa.
          </p>
          <div className="mt-5">
            <GaleriaAnexo
              paginas={grupoAnexo.paginas}
              contexto={evidencia.codigo + ' · ' + grupoAnexo.titulo}
            />
          </div>
          <p className="mt-4 text-sm">
            <Link
              to={'/anexo#' + evidencia.codigo}
              className="inline-flex items-center gap-1.5 font-semibold"
            >
              {grupoAnexo.anio
                ? 'Ver la versión de enero de 2020 en el anexo documental'
                : 'Ver este grupo en el anexo completo'}
              <Icono nombre="flecha-derecha" tamano={15} />
            </Link>
          </p>
        </section>
      ) : null}

      {archivoConsultable(evidencia) ? (
        <VisorDocumento evidencia={evidencia} />
      ) : grupoAnexo || grupoDocumentos ? null : (
        <section className="my-8 rounded-xl border border-dashed border-borde-fuerte bg-superficie-2 p-6 text-center">
          <span className="inline-flex text-texto-tenue">
            <Icono
              nombre={evidencia.visibility === 'public' ? 'documento' : 'candado'}
              tamano={28}
            />
          </span>
          <p className="mt-2 text-sm font-semibold text-texto">
            {evidencia.visibility === 'public'
              ? 'Todavía no hay archivo adjunto para esta evidencia'
              : 'Esta evidencia se publica solo como ficha descriptiva'}
          </p>
          <p className="mt-1 text-sm text-texto-suave">
            {evidencia.visibility === 'public'
              ? 'Cuando el documento esté listo, se coloca en public/evidencias/ y se anota su nombre en content/evidence.json.'
              : 'Su archivo no forma parte de la carpeta pública del sitio.'}
          </p>
          {evidencia.archivo && evidencia.visibility === 'public' ? (
            <a
              href={recurso('evidencias/' + evidencia.archivo)}
              download
              className="boton boton-primario mt-4"
            >
              <Icono nombre="descargar" tamano={16} />
              Descargar
            </a>
          ) : null}
        </section>
      )}

      {seccion ? (
        <p className="my-6 text-sm">
          <Link
            to={'/portafolio/' + seccion.slug}
            className="inline-flex items-center gap-1.5 font-semibold"
          >
            <Icono nombre="flecha-izquierda" tamano={16} />
            Volver al apartado {seccion.numero}: {seccion.titulo}
          </Link>
        </p>
      ) : null}

      <nav
        aria-label="Evidencia anterior y siguiente"
        className="mt-8 grid gap-3 border-t border-borde pt-6 sm:grid-cols-2 no-imprimir"
      >
        {anterior ? (
          <Link
            to={'/evidencias/' + anterior.codigo}
            className="tarjeta flex items-center gap-3 p-4 no-underline hover:border-acento"
          >
            <Icono nombre="flecha-izquierda" tamano={18} />
            <span className="min-w-0">
              <span className="block text-xs text-texto-tenue">Anterior · {anterior.codigo}</span>
              <span className="block truncate text-sm font-semibold text-texto">
                {anterior.titulo}
              </span>
            </span>
          </Link>
        ) : (
          <span />
        )}
        {siguiente ? (
          <Link
            to={'/evidencias/' + siguiente.codigo}
            className="tarjeta flex items-center justify-end gap-3 p-4 text-right no-underline hover:border-acento"
          >
            <span className="min-w-0">
              <span className="block text-xs text-texto-tenue">Siguiente · {siguiente.codigo}</span>
              <span className="block truncate text-sm font-semibold text-texto">
                {siguiente.titulo}
              </span>
            </span>
            <Icono nombre="flecha-derecha" tamano={18} />
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </div>
  )
}
