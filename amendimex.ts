import { expandGlob, path, readFileStr, writeFileStr } from './deps.ts'

const baseDir = Deno.args[0] || Deno.cwd()
const globStr = path.join(baseDir, '*', '*', 'mod.js')

console.log(globStr)

for await (const el of expandGlob(globStr)) {
  const filepath = el.filename
  console.log('FILE: ', filepath)
  const modTxt = await readFileStr(filepath)
  const modArr = modTxt.trim().split('\n').splice(2)
  const mods = modArr.map(str => str.split(' ')[1])
  const imports = modArr.join('\n')
  const exports = mods.join(',\n  ')
  const result = imports + '\n\nexport {\n  ' + exports + '\n};\n'
  console.log(result)
  await writeFileStr(filepath, result)
}
