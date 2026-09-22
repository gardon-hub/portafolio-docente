import { Link } from 'react-router-dom'
import { apartados, perfil, recurso } from '../datos/contenido'

export function PieDePagina() {
  return (
    <footer className="mt-16 border-t border-borde bg-superficie-2">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2 lg:col-span-1">
          <p className="font-serif text-base font-semibold text-texto">{perfil.creditos.linea1}</p>
          <p className="mt-1 text-sm text-texto-suave">{perfil.creditos.linea2}</p>
          <p className="text-sm text-texto-suave">{perfil.creditos.linea3}</p>
          <p className="mt-3 text-xs text-texto-tenue">{perfil.guiaReferencia}</p>
        </div>

        <nav aria-label="Apartados del portafolio">
          <h2 className="text-xs font-semibold tracking-wide text-texto-tenue uppercase">
            Apartados
          </h2>
          <ul className="mt-2 space-y-0.5 text-sm">
            {apartados.slice(0, 6).map((s) => (
              <li key={s.slug}>
                <Link
                  to={'/portafolio/' + s.slug}
                  className="-my-1 block py-2 no-underline hover:underline"
                >
                  {s.numero}. {s.titulo}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Más apartados">
          <h2 className="text-xs font-semibold tracking-wide text-texto-tenue uppercase">&nbsp;</h2>
          <ul className="mt-2 space-y-0.5 text-sm">
            {apartados.slice(6).map((s) => (
              <li key={s.slug}>
                <Link
                  to={'/portafolio/' + s.slug}
                  className="-my-1 block py-2 no-underline hover:underline"
                >
                  {s.numero}. {s.titulo}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Enlaces del sitio">
          <h2 className="text-xs font-semibold tracking-wide text-texto-tenue uppercase">Sitio</h2>
          <ul className="mt-2 space-y-0.5 text-sm">
            <li>
              <Link to="/evidencias" className="-my-1 block py-2 no-underline hover:underline">
                Centro de evidencias
              </Link>
            </li>
            <li>
              <Link to="/anexo" className="-my-1 block py-2 no-underline hover:underline">
                Anexo documental
              </Link>
            </li>
            <li>
              <Link to="/buscar" className="-my-1 block py-2 no-underline hover:underline">
                Buscador
              </Link>
            </li>
            <li>
              <Link to="/descargas" className="-my-1 block py-2 no-underline hover:underline">
                Descargas e impresión
              </Link>
            </li>
            {/* Enlace directo al archivo, junto a la pagina que lo explica: desde el
                pie se llega al PDF sin pasar por ninguna pantalla intermedia. */}
            {perfil.pdfCompleto?.archivo ? (
              <li>
                <a
                  href={recurso('documentos/' + perfil.pdfCompleto.archivo)}
                  download
                  className="-my-1 block py-2 no-underline hover:underline"
                >
                  Portafolio completo en PDF
                  <span className="block text-xs text-texto-tenue">
                    {perfil.pdfCompleto.paginas} páginas · {perfil.pdfCompleto.actualizado}
                  </span>
                </a>
              </li>
            ) : null}
            <li>
              <Link to="/privacidad" className="-my-1 block py-2 no-underline hover:underline">
                Privacidad y protección de datos
              </Link>
            </li>
            <li>
              <Link to="/accesibilidad" className="-my-1 block py-2 no-underline hover:underline">
                Accesibilidad
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      <div className="border-t border-borde">
        <p className="mx-auto max-w-6xl px-4 py-4 text-xs text-texto-tenue">
          {perfil.version}. Contenido tomado del documento «{perfil.documentoFuente.titulo}».
        </p>
      </div>
    </footer>
  )
}
