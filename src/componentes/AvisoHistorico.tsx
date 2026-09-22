import { datosEvidencias } from '../datos/contenido'
import { Icono } from './Icono'

/** Nota exigida por la matriz: lo historico acredita, pero no sustituye lo vigente. */
export function AvisoHistorico() {
  return (
    <aside className="my-6 flex gap-3 rounded-xl border border-azul-borde bg-azul-suave p-4">
      <span className="mt-0.5 shrink-0 text-azul">
        <Icono nombre="reloj" tamano={20} />
      </span>
      <div className="text-sm text-texto-suave">
        <p className="font-semibold text-texto">Sobre las evidencias históricas</p>
        <p className="mt-1">{datosEvidencias.notaHistorica}</p>
      </div>
    </aside>
  )
}

export function AvisoPrivacidad() {
  return (
    <aside className="my-6 flex gap-3 rounded-xl border border-ambar-borde bg-ambar-suave p-4">
      <span className="mt-0.5 shrink-0 text-ambar">
        <Icono nombre="candado" tamano={20} />
      </span>
      <div className="text-sm text-texto-suave">
        <p className="font-semibold text-texto">Evidencias restringidas</p>
        <p className="mt-1">{datosEvidencias.notaPrivacidad}</p>
      </div>
    </aside>
  )
}

export function AvisoMatriz() {
  return (
    <aside className="my-6 flex gap-3 rounded-xl border border-borde bg-superficie-2 p-4">
      <span className="mt-0.5 shrink-0 text-texto-tenue">
        <Icono nombre="info" tamano={20} />
      </span>
      <div className="text-sm text-texto-suave">
        <p className="font-semibold text-texto">Diferencias entre la matriz y los apartados</p>
        <p className="mt-1">{datosEvidencias.notaMatriz}</p>
      </div>
    </aside>
  )
}
