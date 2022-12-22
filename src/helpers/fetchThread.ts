import axios from 'axios'

export default async function (
  threadHash: string,
  endHash: string,
  bearerToken: string
) {
  const url = `https://api.farcaster.xyz/v2/all-casts-in-thread?threadHash=${threadHash}`
  console.log('Fetching thread', url)
  const {
    data: { result },
  } = await axios<{
    result: {
      casts: {
        hash: string
        author: { username?: string }
        text?: string
      }[]
    }
  }>(url, {
    headers: {
      accept: 'application/json',
      authorization: `Bearer ${bearerToken}`,
      'Accept-Encoding': 'gzip,deflate,compress',
    },
  })
  let foundMention = false
  return result.casts
    .map((r) => {
      if (r.hash === endHash) {
        foundMention = true
      }
      return foundMention ||
        !r.text ||
        /recast:farcaster:\/\/casts\/.+/.test(r.text)
        ? { text: '', author: '', hash: r.hash }
        : { text: r?.text, author: r?.author.username }
    })
    .filter((v) => !!v.text && !!v.author)
}
