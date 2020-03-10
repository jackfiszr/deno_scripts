import { move, expandGlob, path } from './deps.ts'

const baseDir = Deno.args[0] || Deno.cwd()
const globStr = path.join(baseDir, '**', '*.js')

console.log(globStr)

for await (const el of expandGlob(globStr)) {
  const jsfile = el.filename
  let tsfile
  if (el.info.name === 'index.js') {
    tsfile = jsfile.replace(/index.js$/, 'mod.ts')
  } else {
    tsfile = jsfile.replace(/.js$/, '.ts')
  }
  try {
    await move(jsfile, tsfile)
    console.log(`${jsfile}=>ts`)
  } catch (e) {
    console.error(e)
  }
}

