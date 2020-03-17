import { move, expandGlob, path } from './deps.ts'

const baseDir = Deno.args[0] || Deno.cwd()
const globStr = path.join(baseDir, '**', 'index.js')

console.log(globStr)

for await (const el of expandGlob(globStr)) {
  const index = el.filename
  const mod = index.replace(/index.js$/, 'mod.js')
  let tsfile
  try {
    await move(index, mod)
    console.log(`${index}=>mod.js`)
  } catch (e) {
    console.error(e)
  }
}
