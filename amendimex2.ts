import { expandGlob, path, readFileStr, writeFileStr } from './deps.ts'

const baseDir = Deno.args[0] || Deno.cwd()
const globStr = path.join(baseDir, '*', '*', 'mod.js')

console.log(globStr)

for await (const el of expandGlob(globStr)) {
  const filepath = el.filename
  console.log('FILE: ', filepath)
  const modTxt = await readFileStr(filepath)
  const lines = modTxt.trim().split('\n')
  const exportLine = lines[1]
  lines[1] = ''
  lines.push('')
  lines.push(exportLine)
  lines.push('')
  const result = lines.join('\n')
  console.log(result)
  await writeFileStr(filepath, result)
}
