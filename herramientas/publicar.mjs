/**
 * Publica el contenido de `dist/` en la rama `gh-pages` del repositorio.
 *
 *   npm run publicar
 *
 * Se hace asi, y no con GitHub Actions, porque el token de `gh` de esta maquina
 * no tiene el permiso `workflow` y no puede subir archivos a .github/workflows/.
 * El README explica como cambiar a publicacion automatica si algun dia se concede
 * ese permiso.
 *
 * `dist/` esta en .gitignore, asi que el repositorio de trabajo que se crea dentro
 * es invisible para el repositorio principal.
 */
import { execFileSync } from 'node:child_process'
import { existsSync, rmSync } from 'node:fs'
import { resolve } from 'node:path'

const raiz = resolve(import.meta.dirname, '..')
const dist = resolve(raiz, 'dist')

function git(args, cwd) {
  return execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] })
}

if (!existsSync(resolve(dist, 'index.html'))) {
  console.error('No hay nada compilado en dist/. Ejecute antes: npm run build')
  process.exit(1)
}

let remoto
try {
  remoto = git(['remote', 'get-url', 'origin'], raiz).trim()
} catch {
  console.error('Este proyecto no tiene un remoto «origin». Cree el repositorio antes de publicar.')
  process.exit(1)
}

const nombre = git(['config', 'user.name'], raiz).trim()
const correo = git(['config', 'user.email'], raiz).trim()
const revision = git(['rev-parse', '--short', 'HEAD'], raiz).trim()

// Repositorio desechable dentro de dist/: cada publicacion reemplaza la rama entera,
// que es lo correcto para un sitio compilado (no interesa su historial).
rmSync(resolve(dist, '.git'), { recursive: true, force: true })
git(['init', '-q', '-b', 'gh-pages'], dist)
git(['config', 'user.name', nombre], dist)
git(['config', 'user.email', correo], dist)
git(['add', '-A'], dist)
git(['commit', '-q', '-m', 'Publicar sitio compilado (' + revision + ')'], dist)
git(['push', '-q', '--force', remoto, 'gh-pages'], dist)
rmSync(resolve(dist, '.git'), { recursive: true, force: true })

console.log('Publicado en la rama gh-pages de ' + remoto)
console.log('El sitio tarda uno o dos minutos en actualizarse.')
