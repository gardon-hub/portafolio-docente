import type { ReactNode } from 'react'
import { Icono } from './Icono'
import type { EstadoEvidencia, Visibilidad } from '../tipos'

type Tono = 'neutro' | 'acento' | 'azul' | 'ambar'

const TONOS: Record<Tono, string> = {
  neutro: 'bg-superficie-2 text-texto-suave border-borde',
  acento: 'bg-acento-suave text-acento border-acento-borde',
  azul: 'bg-azul-suave text-azul border-azul-borde',
  ambar: 'bg-ambar-suave text-ambar border-ambar-borde',
}

interface Props {
  tono?: Tono
  icono?: string
  children: ReactNode
  titulo?: string
}

export function Insignia({ tono = 'neutro', icono, children, titulo }: Props) {
  return (
    <span
      title={titulo}
      className={
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ' +
        TONOS[tono]
      }
    >
      {icono ? <Icono nombre={icono} tamano={13} /> : null}
      {children}
    </span>
  )
}

const TONO_ESTADO: Record<EstadoEvidencia, { tono: Tono; icono: string }> = {
  historico: { tono: 'azul', icono: 'reloj' },
  vigente: { tono: 'acento', icono: 'verificado' },
  pendiente: { tono: 'ambar', icono: 'alerta' },
  restringido: { tono: 'neutro', icono: 'candado' },
}

export function InsigniaEstado({
  estado,
  etiqueta,
  descripcion,
}: {
  estado: EstadoEvidencia
  etiqueta: string
  descripcion?: string
}) {
  const { tono, icono } = TONO_ESTADO[estado]
  return (
    <Insignia tono={tono} icono={icono} titulo={descripcion}>
      {etiqueta}
    </Insignia>
  )
}

const TONO_VISIBILIDAD: Record<Visibilidad, { tono: Tono; icono: string }> = {
  public: { tono: 'acento', icono: 'ojo' },
  restricted: { tono: 'ambar', icono: 'candado' },
  private: { tono: 'neutro', icono: 'candado' },
}

export function InsigniaVisibilidad({
  visibilidad,
  etiqueta,
  descripcion,
}: {
  visibilidad: Visibilidad
  etiqueta: string
  descripcion?: string
}) {
  const { tono, icono } = TONO_VISIBILIDAD[visibilidad]
  return (
    <Insignia tono={tono} icono={icono} titulo={descripcion}>
      {etiqueta}
    </Insignia>
  )
}
