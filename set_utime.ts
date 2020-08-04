import { parse } from './deps.ts'

const filePaths = parse(Deno.args)._

for (const filePath of filePaths) {
  Deno.utimeSync(`${filePath}`, new Date('2020-05-13'), new Date('2020-05-13'))
}
