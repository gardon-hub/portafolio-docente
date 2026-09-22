import { Link } from 'react-router-dom'
import { Icono } from '../componentes/Icono'
import { Insignia } from '../componentes/Insignia'
import { datosEvidencias, evidencias, perfil } from '../datos/contenido'
import { useMetadatos } from '../ganchos/useMetadatos'

const NO_SE_PUBLICA = [
  'Números de identidad.',
  'Direcciones particulares.',
  'Teléfonos personales.',
  'Correos privados.',
  'Información judicial.',
  'Documentos familiares.',
  'Calificaciones o datos identificables de estudiantes.',
  'Listas de asistencia con información privada.',
  'Firmas, sellos o datos personales que no sean necesarios para demostrar la evidencia.',
  'Cualquier documento excluido del portafolio principal.',
]

export function Privacidad() {
  useMetadatos(
    'Privacidad y protección de datos',
    'Reglas de visibilidad de las evidencias y auditoría de datos personales aplicada antes de publicar el portafolio docente ' +
      perfil.anio +
      '.',
  )

  const restringidas = evidencias.filter((e) => e.visibility === 'restricted')
  const conAdvertencia = evidencias.filter((e) => e.advertenciaPrivacidad)

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="font-serif text-3xl font-bold text-texto sm:text-4xl">
        Privacidad y protección de datos
      </h1>
      <p className="mt-3 text-[0.975rem] text-texto-suave">
        El portafolio hace públicos los logros del docente, no los datos personales de nadie. Antes
        de publicar cualquier archivo se revisa qué contiene y a quién identifica.
      </p>

      <section aria-labelledby="no-publica" className="mt-8">
        <h2 id="no-publica" className="font-serif text-xl font-semibold text-texto">
          Lo que este sitio no publica
        </h2>
        <ul className="mt-3 space-y-2">
          {NO_SE_PUBLICA.map((item) => (
            <li key={item} className="flex gap-3 text-sm text-texto-suave">
              <span aria-hidden="true" className="mt-0.5 shrink-0 text-ambar">
                <Icono nombre="candado" tamano={16} />
              </span>
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="niveles" className="mt-10">
        <h2 id="niveles" className="font-serif text-xl font-semibold text-texto">
          Los tres niveles de visibilidad
        </h2>
        <dl className="mt-3 space-y-3">
          {(['public', 'restricted', 'private'] as const).map((v) => (
            <div key={v} className="tarjeta p-4">
              <dt className="flex items-center gap-2">
                <Insignia
                  tono={v === 'public' ? 'acento' : v === 'restricted' ? 'ambar' : 'neutro'}
                  icono={v === 'public' ? 'ojo' : 'candado'}
                >
                  {datosEvidencias.visibilidades[v].etiqueta}
                </Insignia>
                <code className="font-mono text-xs text-texto-tenue">{v}</code>
              </dt>
              <dd className="mt-2 text-sm text-texto-suave">
                {datosEvidencias.visibilidades[v].descripcion}
              </dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 text-sm text-texto-suave">
          Un archivo marcado como <code className="font-mono text-xs">private</code> no se copia a
          la carpeta pública del proyecto: ocultar solo el enlace no protege nada, porque la
          dirección del archivo seguiría siendo accesible.
        </p>
      </section>

      <section aria-labelledby="auditoria" className="mt-10">
        <h2 id="auditoria" className="font-serif text-xl font-semibold text-texto">
          Auditoría aplicada a esta versión
        </h2>
        <ul className="mt-3 space-y-3 text-sm text-texto-suave">
          <li className="tarjeta p-4">
            <p className="font-semibold text-texto">Correo personal retirado de la hoja de vida</p>
            <p className="mt-1">{perfil.contacto.notaCorreo}</p>
          </li>
          <li className="tarjeta p-4">
            <p className="font-semibold text-texto">
              {restringidas.length} de {evidencias.length} evidencias quedan restringidas
            </p>
            <p className="mt-1">
              Todas las procedentes del expediente histórico de enero de 2020, más las que contienen
              datos de estudiantes, de menores de edad o de terceros. Se publica su ficha, nunca el
              archivo.
            </p>
            <Link
              to="/evidencias?estado=historico"
              className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold"
            >
              Ver las evidencias históricas
              <Icono nombre="flecha-derecha" tamano={15} />
            </Link>
          </li>
          <li className="tarjeta p-4">
            <p className="font-semibold text-texto">
              {conAdvertencia.length} evidencias llevan una advertencia previa
            </p>
            <p className="mt-1">
              Indican qué hay que borrar o agregar antes de adjuntar el archivo: nombres de
              estudiantes, calificaciones, listados nominales o capturas con datos visibles.
            </p>
          </li>
          <li className="tarjeta p-4">
            <p className="font-semibold text-texto">Sin rastreo ni recolección de datos</p>
            <p className="mt-1">
              El sitio no usa analítica, cookies de terceros ni formularios. Lo único que guarda en
              el navegador es la preferencia de modo claro u oscuro.
            </p>
          </li>
        </ul>
      </section>

      <section aria-labelledby="fotos" className="mt-10">
        <h2 id="fotos" className="font-serif text-xl font-semibold text-texto">
          Fotografías de personas
        </h2>
        <p className="mt-3 text-sm text-texto-suave">
          Las imágenes de la actividad Lunes de Huevito muestran a menores de edad. No se publican
          sin autorización expresa de madres, padres o tutores y del centro educativo, y los
          listados de beneficiarios se presentan siempre con cifras agregadas.
        </p>
      </section>
    </div>
  )
}
