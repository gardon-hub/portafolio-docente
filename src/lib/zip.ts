/**
 * Escritor de ZIP sin compresion (metodo "store"). Un .docx es un ZIP con XML
 * dentro, y esto evita traer una libreria de 300 kB a una pagina que debe abrir
 * rapido con conexion movil lenta.
 */

const TABLA_CRC = (() => {
  const tabla = new Uint32Array(256)
  for (let i = 0; i < 256; i++) {
    let c = i
    for (let j = 0; j < 8; j++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    tabla[i] = c >>> 0
  }
  return tabla
})()

function crc32(datos: Uint8Array): number {
  let c = 0xffffffff
  for (let i = 0; i < datos.length; i++) c = TABLA_CRC[(c ^ datos[i]) & 0xff] ^ (c >>> 8)
  return (c ^ 0xffffffff) >>> 0
}

export interface EntradaZip {
  nombre: string
  contenido: string
}

/** Fecha y hora en el formato MS-DOS que exige la cabecera del ZIP. */
function fechaDos(d: Date): { hora: number; fecha: number } {
  return {
    hora: (d.getHours() << 11) | (d.getMinutes() << 5) | (Math.floor(d.getSeconds() / 2) & 0x1f),
    fecha: ((d.getFullYear() - 1980) << 9) | ((d.getMonth() + 1) << 5) | d.getDate(),
  }
}

export function crearZip(entradas: EntradaZip[]): Blob {
  const codificador = new TextEncoder()
  const { hora, fecha } = fechaDos(new Date())
  const locales: Uint8Array<ArrayBuffer>[] = []
  const centrales: Uint8Array<ArrayBuffer>[] = []
  let desplazamiento = 0

  for (const entrada of entradas) {
    // Copiar a un Uint8Array propio deja claro que respalda un ArrayBuffer normal.
    const nombre = new Uint8Array(codificador.encode(entrada.nombre))
    const datos = new Uint8Array(codificador.encode(entrada.contenido))
    const crc = crc32(datos)

    const cabecera = new Uint8Array(30 + nombre.length)
    const vc = new DataView(cabecera.buffer)
    vc.setUint32(0, 0x04034b50, true) // firma de cabecera local
    vc.setUint16(4, 20, true) // version necesaria
    vc.setUint16(6, 0x0800, true) // nombres en UTF-8
    vc.setUint16(8, 0, true) // metodo: sin compresion
    vc.setUint16(10, hora, true)
    vc.setUint16(12, fecha, true)
    vc.setUint32(14, crc, true)
    vc.setUint32(18, datos.length, true)
    vc.setUint32(22, datos.length, true)
    vc.setUint16(26, nombre.length, true)
    vc.setUint16(28, 0, true)
    cabecera.set(nombre, 30)

    locales.push(cabecera, datos)

    const central = new Uint8Array(46 + nombre.length)
    const vd = new DataView(central.buffer)
    vd.setUint32(0, 0x02014b50, true) // firma del directorio central
    vd.setUint16(4, 20, true)
    vd.setUint16(6, 20, true)
    vd.setUint16(8, 0x0800, true)
    vd.setUint16(10, 0, true)
    vd.setUint16(12, hora, true)
    vd.setUint16(14, fecha, true)
    vd.setUint32(16, crc, true)
    vd.setUint32(20, datos.length, true)
    vd.setUint32(24, datos.length, true)
    vd.setUint16(28, nombre.length, true)
    vd.setUint32(42, desplazamiento, true)
    central.set(nombre, 46)
    centrales.push(central)

    desplazamiento += cabecera.length + datos.length
  }

  const tamanoCentral = centrales.reduce((n, c) => n + c.length, 0)
  const fin = new Uint8Array(22)
  const vf = new DataView(fin.buffer)
  vf.setUint32(0, 0x06054b50, true) // fin del directorio central
  vf.setUint16(8, entradas.length, true)
  vf.setUint16(10, entradas.length, true)
  vf.setUint32(12, tamanoCentral, true)
  vf.setUint32(16, desplazamiento, true)

  return new Blob([...locales, ...centrales, fin], { type: 'application/zip' })
}

/** Escapa el texto que va dentro de un nodo XML. */
export function escaparXml(texto: string): string {
  return texto
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
