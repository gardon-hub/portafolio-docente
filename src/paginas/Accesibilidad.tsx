import { perfil } from '../datos/contenido'
import { useMetadatos } from '../ganchos/useMetadatos'

const MEDIDAS = [
  {
    titulo: 'Navegación con teclado',
    texto:
      'Todo el sitio se recorre con Tab y Mayús+Tab. El primer tabulador de cada página ofrece el enlace «Ir al contenido», que salta el menú. El menú de teléfono se cierra con la tecla Escape.',
  },
  {
    titulo: 'Foco siempre visible',
    texto:
      'El elemento enfocado se marca con un contorno de tres píxeles en verde institucional, en modo claro y en modo oscuro.',
  },
  {
    titulo: 'Contraste',
    texto:
      'Los colores de texto sobre fondo se eligieron para superar la relación 4.5:1 que pide la norma WCAG 2.1 en nivel AA, y se comprobaron en los dos modos.',
  },
  {
    titulo: 'Objetivos táctiles amplios',
    texto:
      'Botones, enlaces de menú y campos miden al menos 44 píxeles de alto, la medida recomendada para usar el sitio con el pulgar.',
  },
  {
    titulo: 'Jerarquía de encabezados',
    texto:
      'Cada página tiene un único h1, y los encabezados descienden sin saltarse niveles, de modo que un lector de pantalla puede navegar por la estructura.',
  },
  {
    titulo: 'Texto alternativo',
    texto:
      'Las imágenes llevan descripción. Los iconos son decorativos y se ocultan a los lectores de pantalla; el significado va siempre en el texto que los acompaña.',
  },
  {
    titulo: 'Movimiento reducido',
    texto:
      'Si el sistema pide reducir el movimiento, las animaciones y el desplazamiento suave se desactivan.',
  },
  {
    titulo: 'Modo claro y oscuro',
    texto:
      'El sitio respeta la preferencia del sistema y permite fijar el modo a mano. La elección se recuerda en el navegador.',
  },
  {
    titulo: 'Texto que se puede agrandar',
    texto:
      'Los tamaños van en unidades relativas: ampliar la letra del navegador hasta el 200 % no rompe el diseño ni corta contenido.',
  },
  {
    titulo: 'Cambios anunciados',
    texto:
      'El número de resultados del buscador y del centro de evidencias se anuncia a los lectores de pantalla cuando cambia.',
  },
]

export function Accesibilidad() {
  useMetadatos(
    'Accesibilidad',
    'Medidas de accesibilidad aplicadas al portafolio docente ' +
      perfil.anio +
      ' de ' +
      perfil.nombre +
      '.',
  )

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="font-serif text-3xl font-bold text-texto sm:text-4xl">Accesibilidad</h1>
      <p className="mt-3 text-[0.975rem] text-texto-suave">
        Este portafolio busca poder consultarse con teclado, con lector de pantalla, con la letra
        ampliada y desde un teléfono con conexión lenta. Estas son las medidas aplicadas.
      </p>

      <ul className="mt-8 space-y-3">
        {MEDIDAS.map((m) => (
          <li key={m.titulo} className="tarjeta p-4">
            <h2 className="font-serif text-base font-semibold text-texto">{m.titulo}</h2>
            <p className="mt-1.5 text-sm text-texto-suave">{m.texto}</p>
          </li>
        ))}
      </ul>

      <section className="mt-10 rounded-xl border border-borde bg-superficie-2 p-5">
        <h2 className="font-serif text-lg font-semibold text-texto">Limitaciones conocidas</h2>
        <p className="mt-2 text-sm text-texto-suave">
          Los documentos anexos que se incorporen en el futuro son archivos externos: su
          accesibilidad depende de cómo se generen. Se recomienda adjuntar PDF con texto
          seleccionable, no imágenes escaneadas, para que puedan leerse con lector de pantalla.
        </p>
      </section>
    </div>
  )
}
