import ImgurClient from 'imgur'
import env from '@/helpers/env'

const client = new ImgurClient({
  clientId: env.IMGUR_CLIENT_ID,
  clientSecret: env.IMGUR_CLIENT_SECRET,
  refreshToken: env.IMGUR_REFRESH_TOKEN,
})

export default async function (image: Buffer) {
  const {
    data: { link },
  } = await client.upload({
    image,
    type: 'stream',
  })
  return link
}
