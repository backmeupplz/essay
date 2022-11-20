import axios from 'axios'
import env from '@/helpers/env'

export default async function (merkleRoot: string) {
  const url = `https://api.farcaster.xyz/indexer/threads/${merkleRoot}?viewer_address=${env.FARCASTER_ADDRESS}&version=2&ia=software`
  const {
    data: { result },
  } = await axios<{
    result: {
      merkleRoot: string
      body?: { username?: string; data?: { text?: string } }
    }[]
  }>(url)
  let foundMention = false
  return result
    .map((r) => {
      if (r.merkleRoot === merkleRoot) {
        foundMention = true
      }
      return foundMention
        ? { text: '', author: '' }
        : { text: r?.body?.data?.text, author: r.body?.username }
    })
    .filter((v) => !!v.text && !!v.author)
}
