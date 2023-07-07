import axios from 'axios'

interface Cast {
  hash: string
  parentHash?: string
  author: { username?: string }
  text?: string
}

export default async function (
  threadHash: string,
  endHash: string,
  bearerToken: string
) {
  const url = `https://api.warpcast.com/v2/all-casts-in-thread?threadHash=${threadHash}`
  console.log('Fetching thread', url)
  const {
    data: { result, next },
  } = await axios<{
    result: {
      casts: Cast[]
    }
    next?: {
      cursor?: string
    }
  }>(url, {
    headers: {
      accept: 'application/json',
      authorization: `Bearer ${bearerToken}`,
      'Accept-Encoding': 'gzip,deflate,compress',
    },
  })
  const fetchedCasts = result.casts
  let cursor = next?.cursor
  while (cursor) {
    const {
      data: { result, next },
    } = await axios<{
      result: {
        casts: Cast[]
      }
      next?: {
        cursor?: string
      }
    }>(`${url}&cursor=${cursor}`, {
      headers: {
        accept: 'application/json',
        authorization: `Bearer ${bearerToken}`,
        'Accept-Encoding': 'gzip,deflate,compress',
      },
    })
    fetchedCasts.push(...result.casts)
    cursor = next?.cursor
  }

  let originalCast: Cast | undefined
  const hashToCast = {} as { [hash: string]: Cast }
  for (const cast of fetchedCasts) {
    if (cast.hash === endHash) {
      originalCast = cast
    }
    hashToCast[cast.hash] = cast
  }
  if (!originalCast || !originalCast.parentHash) {
    return []
  }
  let currentParentHash: string | undefined = originalCast.parentHash
  const resultingCasts = [] as Cast[]
  do {
    const currentCast: Cast = hashToCast[currentParentHash]
    if (!currentCast) {
      return []
    }
    resultingCasts.unshift(currentCast)
    currentParentHash = currentCast.parentHash
  } while (currentParentHash)
  return resultingCasts.map((c) => ({
    text: c.text,
    author: c.author.username,
  }))
}
