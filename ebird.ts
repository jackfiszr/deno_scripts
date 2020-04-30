import { fmt, writeFileStr } from './deps.ts'

const apiUrl = 'https://ebird.org/media/catalog.json?regionCode=PE-LOR&mediaType=a&sort=rating_rank_desc&count=100'

const audioUrls =  await fetchAll(apiUrl)

await writeFileStr('audio_urls.txt', audioUrls.join('\n'))

async function fetchAll (apiUrl: string, initialCursorMark?: string): Promise<string[]> {
  const results: string[] = []
  let endpoint
  if (initialCursorMark) {
    endpoint = `${apiUrl}&initialCursorMark=${initialCursorMark}`
  } else {
    endpoint = apiUrl
  }
  console.log(fmt.yellow(endpoint))
  await fetch(endpoint).then(response => response.json()).then(data => {
    console.log(data)
    const previousCursorMark = data.searchRequestForm.initialCursorMark
    initialCursorMark = data.results.nextCursorMark
    if (previousCursorMark !== initialCursorMark) {
      const aUrls = data.results.content.map((el: any) => el.mediaUrl)
      results.concat(aUrls)
      fetchAll(apiUrl, initialCursorMark)
    }
  })
  return results
}
