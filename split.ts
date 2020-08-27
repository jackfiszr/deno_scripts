import { join, basename, ensureDirSync, PDFDocument, PDFPage, degrees } from './deps.ts'
import { log } from './utils.ts'

splitPdfEveryTwoPages('input.pdf', 'output')

async function splitPdfEveryTwoPages (sourceFilePath: string, outputDirPath: string): Promise<string[]> {
  const createdFilesPaths: string[] = []
  let sourceFile: PDFDocument
  try {
    sourceFile = await PDFDocument.load(Deno.readFileSync(sourceFilePath))
    const byteArrays: Uint8Array[] = sourceFile.getPages().map(async (_: any, i: number) => {
      if (i % 2 == 0) {
        const doc = await PDFDocument.create()
        const pages = await doc.copyPages(sourceFile, [i, i + 1])
        pages.forEach((page: PDFPage) => {
          // const { width, height } = page.getSize()
          // const rotationAngle = page.getRotation().angle
          // if (rotationAngle === 0 && width < height) {
          //   page.setRotation(degrees(90))
          // }
          doc.addPage(page)
        })
        return await doc.save()
      }
    }).filter((p: PDFPage, i: number) => i % 2 === 0)
    log({
      color: 'yellow',
      title: 'DZIELENIE',
      mainMsg: sourceFilePath,
      subMsg: `zawiera ${byteArrays.length} dokumentów CoC`
    })
    const filename = basename(sourceFilePath).replace('.pdf', '')
    await Promise.all(byteArrays).then(byteArray => {
      byteArray.forEach(async (pdfBytes, i) => {
        ensureDirSync(outputDirPath)
        const outputFilePath = join(outputDirPath, `./${filename}-${i + 1}.pdf`)
        Deno.writeFileSync(outputFilePath, pdfBytes)
        log({
          color: 'gray',
          title: 'UTWORZONO',
          mainMsg: outputFilePath
        })
        createdFilesPaths.push(outputFilePath)
      })
    })
  } catch (error) {
    log({
      color: 'red',
      title: 'DZIELENIE',
      mainMsg: sourceFilePath,
      subMsg: error 
    })
  }
  return createdFilesPaths
}
