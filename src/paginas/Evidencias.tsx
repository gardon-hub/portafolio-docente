import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AvisoHistorico, AvisoMatriz, AvisoPrivacidad } from '../componentes/AvisoHistorico'
import { Icono } from '../componentes/Icono'
import { TarjetaEvidencia } from '../componentes/TarjetaEvidencia'
import {
  aniosEvidencia,
  apartados,
  categoriasEvidencia,
  datosEvidencias,
  evidenciasOrdenadas,
  perfil,
  recurso,
  tiposEvidencia,
} from '../datos/contenido'
import { useMetadatos } from '../ganchos/useMetadatos'
import { normalizar } from '../lib/busqueda'
import type { EstadoEvidencia } from '../tipos'

const POR_TANDA = 8

// Solo se ofrecen los estados que alguna evidencia usa: un filtro que siempre
// devuelve cero resultados confunde mas de lo que ayuda.
const ORDEN_ESTADOS: EstadoEvidencia[] = ['historico', 'vigente', 'pendiente', 'restringido']
const ESTADOS = ORDEN_ESTADOS.filter((e) => evidenciasOrdenadas.some((x) => x.estado === e))

interface Filtros {
  q: string
  apartado: string
  categoria: string
  tipo: string
  anio: string
  estado: string
}

function Selector({
  etiqueta,
  valor,
  opciones,
  alCambiar,
}: {
  etiqueta: string
  valor: string
  opciones: { valor: string; texto: string }[]
  alCambiar: (v: string) => void
}) {
  const id = useId()
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-xs font-semibold text-texto-suave">
        {etiqueta}
      </label>
      <select
        id={id}
        className="campo"
        value={valor}
        onChange={(e) => alCambiar(e.currentTarget.value)}
      >
        <option value="">Todas</option>
        {opciones.map((o) => (
          <option key={o.valor} value={o.valor}>
            {o.texto}
          </option>
        ))}
      </select>
    </div>
  )
}

export function Evidencias() {
  useMetadatos(
    'Centro de evidencias',
    'Matriz de evidencias del portafolio docente ' +
      perfil.anio +
      ': ' +
      evidenciasOrdenadas.length +
      ' códigos con su estado, categoría y nivel de visibilidad.',
  )

  const [params, setParams] = useSearchParams()
  const filtros: Filtros = {
    q: params.get('q') ?? '',
    apartado: params.get('apartado') ?? '',
    categoria: params.get('categoria') ?? '',
    tipo: params.get('tipo') ?? '',
    anio: params.get('anio') ?? '',
    estado: params.get('estado') ?? '',
  }

  const actualizar = (clave: keyof Filtros, valor: string) => {
    const siguiente = new URLSearchParams(params)
    if (valor) siguiente.set(clave, valor)
    else siguiente.delete(clave)
    setParams(siguiente, { replace: true })
  }

  const resultados = useMemo(() => {
    const consulta = normalizar(filtros.q).split(/\s+/).filter(Boolean)
    return evidenciasOrdenadas.filter((e) => {
      if (filtros.apartado && String(e.apartado) !== filtros.apartado) return false
      if (filtros.categoria && e.categoria !== filtros.categoria) return false
      if (filtros.tipo && e.tipo !== filtros.tipo) return false
      if (filtros.anio && e.anio !== filtros.anio) return false
      if (filtros.estado && e.estado !== filtros.estado) return false
      if (consulta.length > 0) {
        const texto = normalizar(
          [e.codigo, e.titulo, e.descripcion, e.categoria, e.tipo, e.periodo, e.estadoTexto].join(
            ' ',
          ),
        )
        if (!consulta.every((t) => texto.includes(t))) return false
      }
      return true
    })
  }, [filtros.q, filtros.apartado, filtros.categoria, filtros.tipo, filtros.anio, filtros.estado])

  // Carga progresiva: nunca se dibujan las 42 fichas de golpe.
  const [visibles, setVisibles] = useState(POR_TANDA)
  const centinela = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setVisibles(POR_TANDA)
  }, [resultados])

  useEffect(() => {
    const nodo = centinela.current
    if (!nodo || visibles >= resultados.length) return
    const observador = new IntersectionObserver(
      (entradas) => {
        if (entradas[0]?.isIntersecting) {
          setVisibles((n) => Math.min(n + POR_TANDA, resultados.length))
        }
      },
      { rootMargin: '300px' },
    )
    observador.observe(nodo)
    return () => observador.disconnect()
  }, [visibles, resultados.length])

  const hayFiltros = Object.values(filtros).some(Boolean)

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <header>
        <p className="text-xs font-semibold tracking-[0.18em] text-acento uppercase">
          Apartado 11 · {perfil.periodo}
        </p>
        <h1 className="mt-2 font-serif text-3xl font-bold text-texto sm:text-4xl">
          Centro de evidencias
        </h1>
        <p className="mt-3 text-[0.975rem] text-texto-suave">
          {evidenciasOrdenadas.length} códigos ordenados según la matriz del portafolio. Cada ficha
          indica el apartado al que pertenece, su estado documental y si su archivo puede
          publicarse.
        </p>
      </header>

      {/* El PDF trae la matriz, no los archivos: conviene decirlo aquí mismo para
          que nadie lo descargue creyendo que se lleva el expediente completo. */}
      {perfil.pdfCompleto?.archivo ? (
        <aside className="tarjeta mt-6 flex flex-wrap items-center justify-between gap-4 p-4 no-imprimir sm:flex-nowrap sm:p-5">
          <div className="flex min-w-0 gap-3">
            <span className="mt-0.5 shrink-0 text-texto-tenue">
              <Icono nombre="documento" tamano={20} />
            </span>
            <div className="text-sm text-texto-suave">
              <p className="font-semibold text-texto">Esta matriz también está en el PDF</p>
              <p className="mt-1">
                El portafolio completo incluye la ficha de los {evidenciasOrdenadas.length} códigos,
                pero no los archivos adjuntos: esos se abren desde cada ficha de esta página.
              </p>
            </div>
          </div>
          <a
            href={recurso('documentos/' + perfil.pdfCompleto.archivo)}
            download
            className="boton boton-secundario shrink-0"
          >
            <Icono nombre="descargar" tamano={16} />
            Descargar el PDF ({perfil.pdfCompleto.paginas} páginas)
          </a>
        </aside>
      ) : null}

      <AvisoHistorico />
      <AvisoPrivacidad />

      {/* Buscador y filtros */}
      <section aria-labelledby="filtros" className="tarjeta mt-6 p-4 sm:p-5 no-imprimir">
        <h2 id="filtros" className="flex items-center gap-2 font-serif text-lg font-semibold">
          <Icono nombre="filtro" tamano={18} />
          Buscar y filtrar
        </h2>

        <div className="mt-4">
          <label
            htmlFor="buscar-evidencias"
            className="mb-1 block text-xs font-semibold text-texto-suave"
          >
            Buscar por código, título o descripción
          </label>
          <input
            id="buscar-evidencias"
            type="search"
            className="campo"
            placeholder="Por ejemplo: E6.4, rúbrica, congreso"
            value={filtros.q}
            onChange={(e) => actualizar('q', e.currentTarget.value)}
          />
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Selector
            etiqueta="Apartado"
            valor={filtros.apartado}
            alCambiar={(v) => actualizar('apartado', v)}
            opciones={apartados
              .filter((s) => s.numero <= 10)
              .map((s) => ({ valor: String(s.numero), texto: s.numero + '. ' + s.titulo }))}
          />
          <Selector
            etiqueta="Categoría"
            valor={filtros.categoria}
            alCambiar={(v) => actualizar('categoria', v)}
            opciones={categoriasEvidencia.map((c) => ({ valor: c, texto: c }))}
          />
          <Selector
            etiqueta="Tipo de evidencia"
            valor={filtros.tipo}
            alCambiar={(v) => actualizar('tipo', v)}
            opciones={tiposEvidencia.map((t) => ({ valor: t, texto: t }))}
          />
          <Selector
            etiqueta="Año"
            valor={filtros.anio}
            alCambiar={(v) => actualizar('anio', v)}
            opciones={aniosEvidencia.map((a) => ({
              valor: a,
              texto: a === '2020' ? '2020 (expediente histórico)' : a,
            }))}
          />
          <Selector
            etiqueta="Estado"
            valor={filtros.estado}
            alCambiar={(v) => actualizar('estado', v)}
            opciones={ESTADOS.map((e) => ({
              valor: e,
              texto: datosEvidencias.estados[e].etiqueta,
            }))}
          />
          <div className="flex items-end">
            <button
              type="button"
              className="boton boton-secundario w-full"
              onClick={() => setParams(new URLSearchParams(), { replace: true })}
              disabled={!hayFiltros}
            >
              <Icono nombre="cerrar" tamano={16} />
              Limpiar filtros
            </button>
          </div>
        </div>
      </section>

      <p aria-live="polite" className="mt-6 text-sm text-texto-suave">
        {resultados.length === 0
          ? 'Ninguna evidencia coincide con los filtros aplicados.'
          : 'Mostrando ' +
            Math.min(visibles, resultados.length) +
            ' de ' +
            resultados.length +
            (resultados.length === 1 ? ' evidencia' : ' evidencias') +
            '.'}
      </p>

      {resultados.length === 0 ? (
        <div className="tarjeta mt-4 p-8 text-center">
          <p className="text-sm text-texto-suave">
            Pruebe con otro término o quite alguno de los filtros.
          </p>
        </div>
      ) : (
        <>
          <ul className="mt-4 space-y-4">
            {resultados.slice(0, visibles).map((e) => (
              <li key={e.codigo}>
                <TarjetaEvidencia evidencia={e} />
              </li>
            ))}
          </ul>

          {visibles < resultados.length ? (
            <div ref={centinela} className="mt-6 text-center no-imprimir">
              <button
                type="button"
                className="boton boton-secundario"
                onClick={() => setVisibles((n) => Math.min(n + POR_TANDA, resultados.length))}
              >
                Cargar más evidencias
              </button>
            </div>
          ) : null}
        </>
      )}

      <AvisoMatriz />
    </div>
  )
}
