import { expandGlob, path, writeFileStr, fmt } from './deps.ts'

const baseDir = Deno.args[0] || Deno.cwd()
const globStr = path.join(baseDir, 'locale', '*.js')

console.log(globStr)

for await (const el of expandGlob(globStr)) {
  const filepath = el.filename
  const filename = el.info.name
  if (filename) {
    const locale = filename.split('.')[0]
    const result = `import { ${locale}, en } from "../lib/locales.ts";\nimport { Faker } from "../lib/mod.ts";

export const faker = new Faker({
  locales: { ${locale}, en },
  locale: "${locale}",
  localeFallback: "en",
});
`
    console.log(fmt.yellow('FILE: ' + filepath))
    await writeFileStr(filepath, result)
    console.log(result)
  }
}
