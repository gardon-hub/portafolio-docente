interface Props {
  titulo?: string
  nota?: string
  columnas: string[]
  filas: string[][]
}

/**
 * En pantallas anchas se dibuja como tabla. En telefono cada fila se convierte en
 * una ficha con la cabecera repetida delante de cada dato, que es lo unico que
 * evita el desbordamiento horizontal sin recortar texto.
 */
export function TablaResponsiva({ titulo, nota, columnas, filas }: Props) {
  return (
    <figure className="my-6">
      {titulo ? (
        <figcaption className="mb-3 font-serif text-lg font-semibold text-texto">
          {titulo}
        </figcaption>
      ) : null}

      {/* Telefono: fichas apiladas */}
      <div className="space-y-3 sm:hidden">
        {filas.map((fila, i) => (
          <div key={i} className="tarjeta p-4">
            <dl className="space-y-2">
              {fila.map((celda, j) => (
                <div key={j}>
                  <dt className="text-xs font-semibold tracking-wide text-texto-tenue uppercase">
                    {columnas[j]}
                  </dt>
                  <dd className="text-sm text-texto">{celda}</dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>

      {/* Tableta y escritorio: tabla con desplazamiento propio si hace falta */}
      <div className="hidden overflow-x-auto rounded-xl border border-borde sm:block">
        <table className="w-full min-w-[34rem] text-left text-sm">
          <thead className="bg-superficie-2">
            <tr>
              {columnas.map((c) => (
                <th
                  key={c}
                  scope="col"
                  className="border-b border-borde px-4 py-3 font-semibold text-texto"
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filas.map((fila, i) => (
              <tr key={i} className="odd:bg-superficie even:bg-superficie-2/60">
                {fila.map((celda, j) => (
                  <td
                    key={j}
                    className={
                      'border-b border-borde px-4 py-3 align-top ' +
                      (j === 0 ? 'font-medium text-texto' : 'text-texto-suave')
                    }
                  >
                    {celda}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {nota ? <p className="mt-2 text-xs text-texto-tenue">{nota}</p> : null}
    </figure>
  )
}
