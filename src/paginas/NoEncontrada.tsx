import { Link } from 'react-router-dom'
import { Icono } from '../componentes/Icono'
import { useMetadatos } from '../ganchos/useMetadatos'

export function NoEncontrada() {
  useMetadatos('Página no encontrada', 'La dirección solicitada no existe en este portafolio.')

  return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center">
      <span className="inline-flex text-texto-tenue">
        <Icono nombre="mapa" tamano={40} />
      </span>
      <h1 className="mt-4 font-serif text-3xl font-bold text-texto">Página no encontrada</h1>
      <p className="mt-3 text-[0.975rem] text-texto-suave">
        La dirección que abrió no corresponde a ningún apartado ni a ninguna evidencia de este
        portafolio. Puede que el enlace esté incompleto o que el contenido haya cambiado de sitio.
      </p>
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <Link to="/" className="boton boton-primario">
          Ir al inicio
        </Link>
        <Link to="/portafolio" className="boton boton-secundario">
          Ver el índice del portafolio
        </Link>
        <Link to="/buscar" className="boton boton-secundario">
          Buscar contenido
        </Link>
      </div>
    </div>
  )
}
