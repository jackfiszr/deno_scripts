import { expandGlob, path, readFileStr, writeFileStr, fmt } from './deps.ts'

const baseDir = Deno.args[0] || Deno.cwd()
const globStr = path.join(baseDir, '*', 'mod.ts')

console.log(globStr)

for await (const el of expandGlob(globStr)) {
  const filepath = el.filename
  console.log(fmt.yellow('FILE: ' + filepath))
  const modTxt = await readFileStr(filepath)
  const result = modTxt.replace(' = {};', ': {\n  [key: string]: any;\n} = {};')
  console.log(result)
  await writeFileStr(filepath, result)
}
