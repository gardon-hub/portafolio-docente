import { useEffect, useState } from 'react'
import { Icono } from './Icono'

export function BotonArriba() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const alDesplazar = () => setVisible(window.scrollY > 600)
    alDesplazar()
    window.addEventListener('scroll', alDesplazar, { passive: true })
    return () => window.removeEventListener('scroll', alDesplazar)
  }, [])

  if (!visible) return null

  return (
    <button
      type="button"
      onClick={() =>
        window.scrollTo({
          top: 0,
          behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
            ? 'auto'
            : 'smooth',
        })
      }
      className="aparece boton boton-secundario fixed right-4 bottom-4 z-30 size-12 rounded-full p-0 shadow-tarjeta no-imprimir"
    >
      <Icono nombre="flecha-arriba" tamano={20} />
      <span className="sr-only">Volver arriba</span>
    </button>
  )
}
