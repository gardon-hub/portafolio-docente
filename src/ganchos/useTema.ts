import { useCallback, useEffect, useState } from 'react'

export type Tema = 'claro' | 'oscuro' | 'sistema'

const CLAVE = 'portafolio-docente-tema'

function leerPreferencia(): Tema {
  try {
    const guardado = localStorage.getItem(CLAVE)
    if (guardado === 'claro' || guardado === 'oscuro' || guardado === 'sistema') return guardado
  } catch {
    // Navegacion privada o almacenamiento bloqueado: se usa la preferencia del sistema.
  }
  return 'sistema'
}

function aplicar(tema: Tema) {
  const raiz = document.documentElement
  if (tema === 'sistema') {
    raiz.removeAttribute('data-tema')
  } else {
    raiz.setAttribute('data-tema', tema)
  }
}

export function useTema() {
  const [tema, setTemaEstado] = useState<Tema>(leerPreferencia)

  useEffect(() => {
    aplicar(tema)
    try {
      localStorage.setItem(CLAVE, tema)
    } catch {
      // Sin almacenamiento la preferencia dura lo que dure la visita.
    }
  }, [tema])

  const setTema = useCallback((siguiente: Tema) => setTemaEstado(siguiente), [])

  /** Alterna entre claro y oscuro tomando como punto de partida lo que se ve. */
  const alternar = useCallback(() => {
    setTemaEstado((actual) => {
      if (actual === 'sistema') {
        const prefiereOscuro = window.matchMedia('(prefers-color-scheme: dark)').matches
        return prefiereOscuro ? 'claro' : 'oscuro'
      }
      return actual === 'oscuro' ? 'claro' : 'oscuro'
    })
  }, [])

  return { tema, setTema, alternar }
}
