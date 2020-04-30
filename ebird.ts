import { fmt, writeFileStr } from './deps.ts'

const apiUrl = 'https://ebird.org/media/catalog.json?regionCode=PE-LOR&mediaType=a&sort=rating_rank_desc&count=100'

const encoder = new TextEncoder()

await fetchAll(apiUrl)

async function fetchAll (apiUrl: string, initialCursorMark?: string): Promise<void> {
  let endpoint
  if (initialCursorMark) {
    endpoint = `${apiUrl}&initialCursorMark=${initialCursorMark}`
  } else {
    endpoint = apiUrl
  }
  console.log(fmt.yellow(endpoint))
  await fetch(endpoint, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:75.0) Gecko/20100101 Firefox/75.0'
    }
  }).then(response => response.json()).then(async data => {
    console.log(data)
    const previousCursorMark = data.searchRequestForm.initialCursorMark
    initialCursorMark = data.results.nextCursorMark
    const aUrls = data.results.content.map((el: any) => el.mediaUrl)
    const ecoded = encoder.encode(aUrls.join('\n') + '\n')
    await Deno.writeFile('audio_urls.txt', ecoded, { append: true })
    if (previousCursorMark !== initialCursorMark) {
      await fetchAll(apiUrl, initialCursorMark)
    }
  })
}
