import { Notification } from '@big-whale-labs/botcaster'
import { ThreadModel } from '../models/Thread'
import fetchThread from './fetchThread'
import publishCast from './publishCast'
import textToImage from './textToImage'
import uploadImage from './uploadImage'

function delay(s: number) {
  return new Promise((resolve) => setTimeout(resolve, s * 1000))
}

export default async function (
  notification: Notification,
  bearerToken: string
) {
  try {
    if (notification.type !== 'cast-mention') {
      return
    }
    const mentionText = notification.content.cast?.text
    if (!mentionText) {
      return
    }
    const title = /(?<=@essay).*$/.exec(mentionText)?.[0]?.trim()
    if (!notification.content.cast?.hash) {
      return
    }
    const dbThread = await ThreadModel.findOne({
      merkleRoot: notification.content.cast.hash,
    })
    if (dbThread) {
      return
    }
    if (notification?.actor?.username === 'essay') {
      return
    }
    if (
      notification.content.cast.timestamp <
      Date.now() - 1000 * 60 * 60 * 24
    ) {
      return
    }
    await ThreadModel.create({
      merkleRoot: notification.content.cast.hash,
    })
    if (!notification.content.cast?.threadHash) {
      return
    }
    const thread = await fetchThread(
      notification.content.cast.threadHash,
      notification.content.cast.hash,
      bearerToken
    )
    if (!thread.length || !thread[0].author) {
      return publishCast(
        "Hi there 🙏 this doesn't look like a thread so I can't quite turn it into a screenshot essay. Try replying with @essay to a thread!",
        notification.content.cast.hash
      )
    }
    const imageBuffer = textToImage(
      thread.map((t) => t.text).join('\n\n'),
      thread[0].author,
      title
    )
    let text = `screenshotessay\n${await uploadImage(imageBuffer)}`
    let tries = 0
    while (text.includes('function')) {
      if (tries > 4) {
        return publishCast(
          "@borodutch I'm so sorry, tried to upload essay 5 times and failed, please try again later",
          notification.content.cast.hash
        )
      }
      await delay(1)
      console.log(`Retrying #${tries}...`)
      text = `screenshotessay\n${await uploadImage(imageBuffer)}`
      tries++
    }
    await publishCast(text, notification.content.cast.hash)
    console.log('Published', text, notification.content.cast.hash)
  } catch (error) {
    console.log(error instanceof Error ? error.message : error)
    if (notification.content.cast?.hash) {
      await publishCast(
        "@borodutch something went wrong here, I'm so sorry",
        notification.content.cast.hash
      )
    }
  }
}
