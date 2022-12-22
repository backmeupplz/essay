import env from './env'
import imgur from 'imgur'

const client = new (imgur as any).ImgurClient({
  clientId: env.IMGUR_CLIENT_ID,
  clientSecret: env.IMGUR_CLIENT_SECRET,
  refreshToken: env.IMGUR_REFRESH_TOKEN,
})

export default async function (image: Buffer) {
  const { data } = await client.upload({
    image,
    type: 'stream',
  })
  console.log(data)
  return data.link
}
