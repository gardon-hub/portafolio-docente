/**
 * Iconografia unica del sitio: trazos SVG de 24 px que heredan el color del texto.
 * Van dibujados a mano para no depender de una libreria externa ni de una fuente
 * de iconos que habria que descargar en conexiones lentas.
 */
const TRAZOS: Record<string, string> = {
  libro:
    'M4 4.5A1.5 1.5 0 0 1 5.5 3H19v15H5.5A1.5 1.5 0 0 0 4 19.5zM4 19.5A1.5 1.5 0 0 0 5.5 21H19v-3',
  identidad:
    'M4 5h16v14H4zM8.5 12.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4m-2.6 4c.3-1.6 1.4-2.5 2.6-2.5s2.3.9 2.6 2.5M14 10h4M14 13.5h3',
  brujula: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18m3.2-12.2-2 4.4-4.4 2 2-4.4z',
  aula: 'M3 5h18v11H3zM8 20h8M12 16v4M7 12l2.5-3 2 2.2L14.5 8l2.5 4',
  regla: 'M4 8h16v8H4zM7.5 8v3M10.5 8v2M13.5 8v3M16.5 8v2',
  chispa:
    'M12 3v3.5M12 17.5V21M3 12h3.5M17.5 12H21M5.6 5.6l2.5 2.5M15.9 15.9l2.5 2.5M18.4 5.6l-2.5 2.5M8.1 15.9l-2.5 2.5M12 9.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5',
  microscopio:
    'M9 17h9M6 21h13M11 5.5 8 9l3 2 3-3.5zM12.5 11.5A5 5 0 0 1 15 17M9.5 4.2l1.6-1.4 2.4 2.6-1.6 1.5',
  manos: 'M3 12.5 6.5 9l3 2.5 2-1.5 3 2.2M14.5 12.2 18 9l3 3.5M6.5 9V6M18 9V6M4 21h16',
  engranaje:
    'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6M10.6 3h2.8l.4 2.3 2 1.2 2.2-.9 1.4 2.4-1.8 1.5v2.3l1.8 1.5-1.4 2.4-2.2-.9-2 1.2-.4 2.3h-2.8l-.4-2.3-2-1.2-2.2.9-1.4-2.4 1.8-1.5v-2.3L3 8l1.4-2.4 2.2.9 2-1.2z',
  escalera: 'M4 20h4v-5H4zM10 20h4V11h-4zM16 20h4V6h-4z',
  espejo:
    'M12 3a5 5 0 0 1 5 5c0 2.4-1.7 3.7-2.5 5H9.5C8.7 11.7 7 10.4 7 8a5 5 0 0 1 5-5M9.5 16h5M10.5 19h3',
  carpeta:
    'M3 6.5A1.5 1.5 0 0 1 4.5 5h4l2 2.5h7A1.5 1.5 0 0 1 19 9v8.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 3 17.5z',
  buscar: 'M10.5 17a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13M15.5 15.5 20 20',
  menu: 'M4 7h16M4 12h16M4 17h16',
  cerrar: 'M6 6l12 12M18 6 6 18',
  sol: 'M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4',
  luna: 'M20 14.2A8.2 8.2 0 0 1 9.8 4 8.2 8.2 0 1 0 20 14.2',
  'flecha-arriba': 'M12 19V6M6 11.5 12 5.5l6 6',
  'flecha-derecha': 'M5 12h13M13 6.5l5.5 5.5-5.5 5.5',
  'flecha-izquierda': 'M19 12H6M11 17.5 5.5 12 11 6.5',
  descargar: 'M12 4v10M7.5 10.5 12 15l4.5-4.5M4.5 19h15',
  imprimir:
    'M7 9V4h10v5M7 18H5.5A1.5 1.5 0 0 1 4 16.5v-5A1.5 1.5 0 0 1 5.5 10h13a1.5 1.5 0 0 1 1.5 1.5v5a1.5 1.5 0 0 1-1.5 1.5H17M7 14h10v6H7z',
  documento: 'M6 3h7l5 5v13H6zM13 3v5h5',
  candado: 'M7 11h10v9H7zM9.5 11V8a2.5 2.5 0 0 1 5 0v3',
  reloj: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18M12 7.5V12l3 2',
  filtro: 'M4 6h16l-6 7v6l-4-2v-4z',
  externo:
    'M14 4h6v6M20 4l-8.5 8.5M18 14v5.5A1.5 1.5 0 0 1 16.5 21h-11A1.5 1.5 0 0 1 4 19.5v-11A1.5 1.5 0 0 1 5.5 7H11',
  alerta: 'M12 4 2.5 20h19zM12 10v4.5M12 17.2v.1',
  verificado: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18M8.2 12.2l2.6 2.6 5-5.4',
  ojo: 'M2.5 12S6 6.5 12 6.5 21.5 12 21.5 12 18 17.5 12 17.5 2.5 12 2.5 12M12 14.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5',
  etiqueta: 'M4 4h7l9 9-7 7-9-9zM8 8v.1',
  mapa: 'M3 6.5 9 4l6 2.5L21 4v13.5L15 20l-6-2.5L3 20zM9 4v13.5M15 6.5V20',
  info: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18M12 11v5.5M12 7.8v.1',
  'mas-menos': 'M12 6v12M6 12h12',
}

interface Props {
  nombre: string
  tamano?: number
  className?: string
}

export function Icono({ nombre, tamano = 20, className }: Props) {
  const trazo = TRAZOS[nombre] ?? TRAZOS.info
  return (
    <svg
      width={tamano}
      height={tamano}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path d={trazo} />
    </svg>
  )
}
