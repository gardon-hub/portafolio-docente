import { useEffect } from 'react'
import { perfil } from '../datos/contenido'

const BASE = perfil.tituloPortafolio + ' ' + perfil.anio + ' | ' + perfil.nombre

function fijarMeta(selector: string, atributo: 'name' | 'property', clave: string, valor: string) {
  let etiqueta = document.head.querySelector<HTMLMetaElement>(selector)
  if (!etiqueta) {
    etiqueta = document.createElement('meta')
    etiqueta.setAttribute(atributo, clave)
    document.head.appendChild(etiqueta)
  }
  etiqueta.setAttribute('content', valor)
}

/**
 * Ajusta titulo y descripcion en cada pantalla. La navegacion del sitio no recarga
 * la pagina, asi que estas etiquetas hay que actualizarlas a mano.
 */
export function useMetadatos(titulo: string | null, descripcion: string) {
  useEffect(() => {
    const completo = titulo ? titulo + ' | ' + BASE : BASE
    document.title = completo
    fijarMeta('meta[name="description"]', 'name', 'description', descripcion)
    fijarMeta('meta[property="og:title"]', 'property', 'og:title', completo)
    fijarMeta('meta[property="og:description"]', 'property', 'og:description', descripcion)
    fijarMeta('meta[name="twitter:title"]', 'name', 'twitter:title', completo)
    fijarMeta('meta[name="twitter:description"]', 'name', 'twitter:description', descripcion)
  }, [titulo, descripcion])
}
