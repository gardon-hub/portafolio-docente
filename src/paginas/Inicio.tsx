import { Link } from 'react-router-dom'
import { Icono } from '../componentes/Icono'
import { Indicadores } from '../componentes/Indicadores'
import { Insignia } from '../componentes/Insignia'
import { apartados, evidencias, perfil, recurso, secciones } from '../datos/contenido'
import { useMetadatos } from '../ganchos/useMetadatos'

function Fotografia() {
  if (perfil.fotografia.archivo) {
    return (
      <img
        src={recurso('imagenes/' + perfil.fotografia.archivo)}
        alt={perfil.fotografia.alt}
        width={220}
        height={280}
        decoding="async"
        className="h-64 w-52 rounded-2xl border border-borde object-cover shadow-tarjeta sm:h-72 sm:w-56"
      />
    )
  }
  return (
    <div
      role="img"
      aria-label={perfil.fotografia.alt + ' (pendiente de cargar)'}
      className="grid h-64 w-52 place-items-center rounded-2xl border border-dashed border-borde-fuerte bg-superficie-2 text-center sm:h-72 sm:w-56"
    >
      <div className="px-4">
        <span className="font-serif text-5xl font-bold text-acento">
          {perfil.fotografia.iniciales}
        </span>
        <p className="mt-3 text-xs text-texto-tenue">Fotografía pendiente de cargar</p>
      </div>
    </div>
  )
}

export function Inicio() {
  useMetadatos(
    null,
    perfil.presentacionBreve.slice(0, 180) +
      ' Portafolio docente ' +
      perfil.anio +
      ' de la ' +
      perfil.unidadAcademica +
      '.',
  )

  const presentacion = secciones.find((s) => s.numero === 0)
  const pendientes = evidencias.filter((e) => e.estado === 'pendiente').length

  return (
    <>
      {/* Hero */}
      <section className="border-b border-borde bg-fondo-alterno">
        {/* En el teléfono la fotografía va entre el título y el nombre, para que no
            haya que recorrer todo el encabezado antes de ver al docente. En pantalla
            ancha ocupa la columna derecha, a la altura de ambos bloques de texto. */}
        <div className="mx-auto grid max-w-6xl gap-x-12 gap-y-7 px-4 py-10 sm:py-14 lg:grid-cols-[1fr_auto] lg:grid-rows-[auto_auto] lg:items-start">
          <div className="max-w-2xl lg:col-start-1 lg:row-start-1">
            <p className="text-xs font-semibold tracking-[0.18em] text-acento uppercase">
              {perfil.institucion} · {perfil.siglaInstitucion}
            </p>
            <h1 className="mt-3 font-serif text-4xl leading-tight font-bold text-texto sm:text-5xl">
              {perfil.tituloPortafolio} {perfil.anio}
            </h1>
            <p className="mt-3 text-lg text-texto-suave">{perfil.lemaPortafolio}</p>
          </div>

          <div className="lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-center lg:justify-self-end">
            <Fotografia />
          </div>

          <div className="max-w-2xl lg:col-start-1 lg:row-start-2">
            <div className="border-l-4 border-acento pl-4">
              <p className="font-serif text-2xl font-semibold text-texto">{perfil.nombre}</p>
              <p className="mt-1 text-sm text-texto-suave">{perfil.cargo}</p>
              <p className="text-sm text-texto-suave">{perfil.cargoSecundario}</p>
              <p className="mt-2 text-sm text-texto-tenue">
                {perfil.unidadAcademica} · {perfil.sede}
              </p>
            </div>

            <p className="mt-6 text-[0.975rem] leading-relaxed text-texto-suave">
              {perfil.presentacionBreve}
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/portafolio" className="boton boton-primario">
                <Icono nombre="mapa" tamano={18} />
                Explorar portafolio
              </Link>
              <Link to="/evidencias" className="boton boton-secundario">
                <Icono nombre="carpeta" tamano={18} />
                Consultar evidencias
              </Link>
              {/* La descarga directa del PDF se ofrece aquí y no solo en Descargas:
                  es lo que pide quien llega al sitio para revisar el expediente. */}
              {perfil.pdfCompleto?.archivo ? (
                <a
                  href={recurso('documentos/' + perfil.pdfCompleto.archivo)}
                  download
                  className="boton boton-secundario"
                >
                  <Icono nombre="descargar" tamano={18} />
                  Descargar el PDF completo
                </a>
              ) : null}
            </div>

            {perfil.pdfCompleto?.archivo ? (
              <p className="mt-3 text-sm text-texto-tenue">
                El portafolio íntegro en un archivo de {perfil.pdfCompleto.paginas} páginas,
                actualizado al {perfil.pdfCompleto.actualizado}.
              </p>
            ) : null}

            <div className="mt-6 flex flex-wrap items-center gap-2">
              <Insignia tono="neutro" icono="reloj">
                {perfil.periodo}
              </Insignia>
              {perfil.identificadores.map((id) => (
                <Insignia key={id.etiqueta} tono="azul" icono="verificado" titulo={id.origen}>
                  {id.enlace ? (
                    <a
                      href={id.enlace}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="no-underline"
                    >
                      {id.etiqueta} {id.valor}
                    </a>
                  ) : (
                    id.etiqueta + ' ' + id.valor
                  )}
                </Insignia>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-10">
        {/* Resumen visual de la trayectoria */}
        <section aria-labelledby="resumen">
          <h2 id="resumen" className="font-serif text-2xl font-semibold text-texto">
            Resumen de la trayectoria
          </h2>
          <p className="mt-1 text-sm text-texto-suave">
            Cifras tomadas del documento fuente. Cada una remite al apartado que la sustenta.
          </p>
          <Indicadores items={perfil.indicadores} />
        </section>

        {/* Presentacion breve del portafolio */}
        {presentacion ? (
          <section aria-labelledby="presentacion" className="mt-10">
            <h2 id="presentacion" className="font-serif text-2xl font-semibold text-texto">
              {presentacion.titulo}
            </h2>
            <p className="mt-3 text-[0.975rem] leading-relaxed text-texto-suave">
              {presentacion.bloques.find((b) => b.tipo === 'parrafo')?.texto}
            </p>
            <Link
              to="/portafolio/presentacion"
              className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold"
            >
              Leer la presentación completa
              <Icono nombre="flecha-derecha" tamano={16} />
            </Link>
          </section>
        ) : null}

        {/* Accesos rapidos a los apartados */}
        <section aria-labelledby="apartados" className="mt-12">
          <h2 id="apartados" className="font-serif text-2xl font-semibold text-texto">
            Accesos rápidos
          </h2>
          <p className="mt-1 text-sm text-texto-suave">
            Los once apartados oficiales, en el orden establecido por la guía de DASDIE.
          </p>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {apartados.map((s) => (
              <li key={s.slug}>
                <Link
                  to={'/portafolio/' + s.slug}
                  className="tarjeta flex h-full gap-3 p-4 no-underline transition-colors hover:border-acento"
                >
                  <span
                    aria-hidden="true"
                    className="grid size-10 shrink-0 place-items-center rounded-lg bg-acento-suave text-acento"
                  >
                    <Icono nombre={s.icono} tamano={20} />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-serif text-base font-semibold text-texto">
                      {s.numero}. {s.titulo}
                    </span>
                    <span className="mt-1 block text-sm text-texto-suave">{s.resumen}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* Estado del expediente */}
        <section
          aria-labelledby="estado"
          className="mt-12 rounded-xl border border-borde bg-superficie-2 p-5"
        >
          <h2 id="estado" className="font-serif text-xl font-semibold text-texto">
            Estado del expediente de evidencias
          </h2>
          <p className="mt-2 text-sm text-texto-suave">
            {evidencias.length} códigos definidos, de los cuales {pendientes} están pendientes de
            elaborar, seleccionar o incorporar. El Centro de evidencias muestra la ficha de cada uno
            con su estado y su nivel de visibilidad.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link to="/evidencias" className="boton boton-primario">
              <Icono nombre="carpeta" tamano={18} />
              Abrir el Centro de evidencias
            </Link>
            <Link to="/descargas" className="boton boton-secundario">
              <Icono nombre="descargar" tamano={18} />
              Descargar o imprimir
            </Link>
          </div>
        </section>
      </div>
    </>
  )
}
