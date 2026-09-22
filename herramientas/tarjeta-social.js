/*
 * Genera de nuevo public/imagenes/tarjeta-social.jpg, la imagen de 1200 x 630
 * que se ve al compartir el enlace en WhatsApp, Facebook o LinkedIn.
 *
 * Hay que rehacerla cuando cambien el año del portafolio, el nombre, el cargo o
 * la fotografía: la tarjeta es una imagen fija y no se actualiza sola.
 *
 * CÓMO USARLO
 *   1. Arranque el sitio:            npm run dev
 *   2. Abra http://localhost:5178 en el navegador.
 *   3. Pulse F12 y vaya a la pestaña «Console» (Consola).
 *   4. Pegue TODO este archivo y pulse Intro.
 *   5. El navegador descarga «tarjeta-social.jpg». Muévalo a public/imagenes/,
 *      reemplazando el que había, y publique con: npm run publicar
 *
 * Los textos se leen de content/profile.json, así que basta con actualizar ese
 * archivo antes de volver a generarla.
 */
;(async () => {
  const perfil = (await (await fetch('/content/profile.json').catch(() => null))?.json?.()) ?? null

  // Si el JSON no se puede leer desde el navegador, se usan estos valores.
  const datos = perfil ?? {
    institucion: 'Universidad Nacional de Agricultura',
    tituloPortafolio: 'Portafolio Docente',
    anio: '2026',
    lemaPortafolio: 'Trayectoria, práctica pedagógica, innovación y compromiso institucional',
    nombre: 'Gustavo Alonso Ardón',
    cargo: 'Profesor-investigador',
    cargoSecundario: 'Coordinador del CIAA',
    unidadAcademica: 'Facultad de Medicina Veterinaria y Zootecnia',
    fotografia: { archivo: 'perfil.png' },
  }

  const A = 1200
  const H = 630
  const c = document.createElement('canvas')
  c.width = A
  c.height = H
  const x = c.getContext('2d')

  const g = x.createLinearGradient(0, 0, A, H)
  g.addColorStop(0, '#17422c')
  g.addColorStop(1, '#0f2c1e')
  x.fillStyle = g
  x.fillRect(0, 0, A, H)

  x.fillStyle = '#77bd93'
  x.fillRect(0, 0, A, 8)

  const redondeado = (x0, y0, w, h, r) => {
    x.beginPath()
    x.moveTo(x0 + r, y0)
    x.arcTo(x0 + w, y0, x0 + w, y0 + h, r)
    x.arcTo(x0 + w, y0 + h, x0, y0 + h, r)
    x.arcTo(x0, y0 + h, x0, y0, r)
    x.arcTo(x0, y0, x0 + w, y0, r)
    x.closePath()
  }

  const envolver = (texto, maxAncho) => {
    const lineas = []
    let linea = ''
    for (const p of texto.split(' ')) {
      const prueba = linea ? linea + ' ' + p : p
      if (x.measureText(prueba).width > maxAncho && linea) {
        lineas.push(linea)
        linea = p
      } else linea = prueba
    }
    if (linea) lineas.push(linea)
    return lineas
  }

  // Fotografía a la derecha, recortada como object-cover.
  const img = new Image()
  img.src = '/imagenes/' + datos.fotografia.archivo
  await img.decode()
  const fx = 792
  const fy = 96
  const fw = 344
  const fh = 424
  x.save()
  redondeado(fx, fy, fw, fh, 22)
  x.clip()
  const escala = Math.max(fw / img.naturalWidth, fh / img.naturalHeight)
  const dw = img.naturalWidth * escala
  const dh = img.naturalHeight * escala
  x.drawImage(img, fx + (fw - dw) / 2, fy + (fh - dh) / 2, dw, dh)
  x.restore()
  redondeado(fx, fy, fw, fh, 22)
  x.strokeStyle = 'rgba(170,215,187,0.45)'
  x.lineWidth = 2
  x.stroke()

  const iz = 76
  let y = 150
  x.textBaseline = 'alphabetic'

  x.letterSpacing = '3px'
  x.font = '600 21px "Segoe UI", system-ui, sans-serif'
  x.fillStyle = '#aad7bb'
  x.fillText(datos.institucion.toUpperCase(), iz, y)
  x.letterSpacing = '0px'

  y += 78
  x.font = 'bold 72px Georgia, "Palatino Linotype", serif'
  x.fillStyle = '#ffffff'
  x.fillText(datos.tituloPortafolio, iz, y)
  y += 76
  x.fillText(datos.anio, iz, y)

  y += 46
  x.font = '25px "Segoe UI", system-ui, sans-serif'
  x.fillStyle = '#d5ebdd'
  for (const l of envolver(datos.lemaPortafolio, 640)) {
    x.fillText(l, iz, y)
    y += 34
  }

  y += 26
  x.fillStyle = '#77bd93'
  x.fillRect(iz, y - 4, 78, 4)

  y += 54
  x.font = 'bold 38px Georgia, "Palatino Linotype", serif'
  x.fillStyle = '#ffffff'
  x.fillText(datos.nombre, iz, y)

  y += 36
  x.font = '22px "Segoe UI", system-ui, sans-serif'
  x.fillStyle = '#aad7bb'
  for (const l of envolver(datos.cargo + ' · ' + datos.cargoSecundario, 660)) {
    x.fillText(l, iz, y)
    y += 29
  }
  y -= 29

  y += 30
  x.fillStyle = '#8fb8a0'
  x.font = '20px "Segoe UI", system-ui, sans-serif'
  x.fillText(datos.unidadAcademica, iz, y)

  c.toBlob(
    (blob) => {
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'tarjeta-social.jpg'
      a.click()
      setTimeout(() => URL.revokeObjectURL(url), 10000)
      console.log('Tarjeta generada: ' + Math.round(blob.size / 1024) + ' kB, 1200 x 630')
    },
    'image/jpeg',
    0.86,
  )
})()
