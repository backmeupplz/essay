import axios from 'axios'
import env from '@/helpers/env'

export default async function (merkleRoot: string) {
  const url = `https://api.farcaster.xyz/indexer/threads/${merkleRoot}?viewer_address=${env.FARCASTER_ADDRESS}&version=2&ia=software`
  const {
    data: { result },
  } = await axios<{
    result: { merkleRoot: string; body?: { data?: { text?: string } } }[]
  }>(url)
  let foundMention = false
  return result
    .map((r) => {
      if (r.merkleRoot === merkleRoot) {
        foundMention = true
      }
      return foundMention ? '' : r?.body?.data?.text
    })
    .filter((v) => !!v)
}
