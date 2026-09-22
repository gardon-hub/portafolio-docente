import { useEffect, useMemo, useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Icono } from '../componentes/Icono'
import { Insignia } from '../componentes/Insignia'
import { perfil } from '../datos/contenido'
import { useMetadatos } from '../ganchos/useMetadatos'
import { buscar } from '../lib/busqueda'

const ICONO_CLASE: Record<string, string> = {
  apartado: 'libro',
  evidencia: 'carpeta',
  proyecto: 'chispa',
}

export function Buscar() {
  useMetadatos(
    'Buscador',
    'Busque apartados, evidencias y proyectos dentro del portafolio docente ' + perfil.anio + '.',
  )

  const [params, setParams] = useSearchParams()
  const consulta = params.get('q') ?? ''
  const entrada = useRef<HTMLInputElement>(null)

  useEffect(() => {
    entrada.current?.focus()
  }, [])

  const resultados = useMemo(() => buscar(consulta), [consulta])

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="font-serif text-3xl font-bold text-texto sm:text-4xl">
        Buscar en el portafolio
      </h1>
      <p className="mt-3 text-[0.975rem] text-texto-suave">
        Busca dentro del texto de los apartados, de las fichas de evidencia y de los proyectos de
        innovación. Acepta términos con o sin tilde.
      </p>

      <div className="mt-6">
        <label htmlFor="consulta" className="mb-1 block text-xs font-semibold text-texto-suave">
          Término de búsqueda
        </label>
        <div className="flex gap-2">
          <input
            ref={entrada}
            id="consulta"
            type="search"
            className="campo"
            placeholder="Por ejemplo: rúbrica, incubación, E6.4, Lunes de Huevito"
            value={consulta}
            onChange={(e) => {
              const v = e.currentTarget.value
              const siguiente = new URLSearchParams()
              if (v) siguiente.set('q', v)
              setParams(siguiente, { replace: true })
            }}
          />
        </div>
      </div>

      <p aria-live="polite" className="mt-5 text-sm text-texto-suave">
        {consulta.trim() === ''
          ? 'Escriba un término para comenzar.'
          : resultados.length === 0
            ? 'Sin resultados para «' + consulta + '».'
            : resultados.length + (resultados.length === 1 ? ' resultado' : ' resultados') + '.'}
      </p>

      <ul className="mt-4 space-y-3">
        {resultados.map((r) => (
          <li key={r.clase + r.ruta + (r.codigo ?? '')}>
            <Link
              to={r.ruta}
              className="tarjeta flex gap-3 p-4 no-underline transition-colors hover:border-acento"
            >
              <span
                aria-hidden="true"
                className="grid size-9 shrink-0 place-items-center rounded-lg bg-acento-suave text-acento"
              >
                <Icono nombre={ICONO_CLASE[r.clase] ?? 'info'} tamano={18} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-center gap-2">
                  {r.codigo ? (
                    <span className="rounded bg-acento px-1.5 py-0.5 font-mono text-xs font-bold text-sobre-acento">
                      {r.codigo}
                    </span>
                  ) : null}
                  <span className="font-serif text-base font-semibold text-texto">{r.titulo}</span>
                </span>
                <span className="mt-1 block text-sm text-texto-suave">{r.cuerpo}</span>
                <span className="mt-2 inline-block">
                  <Insignia tono="neutro">{r.subtitulo}</Insignia>
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
