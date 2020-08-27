import { join, PDFDocument, PDFPage } from './deps.ts'
import { log } from './utils.ts'

main()

async function main () {
  const pdfsToMerge = Array.from(Deno.readDirSync('input')).map((entry: any) => join('input', entry.name))
  if (pdfsToMerge.length > 0) {
    const pdfBytes = await mergePdfs(pdfsToMerge)
    const filename = 'merged_full.pdf'
    const filepath = join(Deno.cwd(), filename)
    Deno.writeFileSync(filepath, pdfBytes)
    log({
      color: 'green',
      title: 'SUKCES',
      mainMsg: `${pdfsToMerge.length} plików zostało połączonych w pliku ${filepath}\n`
    })
  }
}

async function mergePdfs(pdfsToMerge: string[]) {
  const mergedPdf = await PDFDocument.create()
  for (const pdfPath of pdfsToMerge) {
    const pdfBytes = Deno.readFileSync(pdfPath)
    const pdfDoc = await PDFDocument.load(pdfBytes)
    // if (pdfDoc.getPageCount() === 2) {
      const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices())
      copiedPages.forEach((page: PDFPage) => {
        mergedPdf.addPage(page)
      })
    // }
  }
  const mergedPdfFile = await mergedPdf.save()
  return mergedPdfFile
}
