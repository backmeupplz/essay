import { Notification } from '@big-whale-labs/botcaster'
import { ThreadModel } from '../models/Thread'
import fetchThread from './fetchThread'
import publishCast from './publishCast'
import textToImage from './textToImage'
import uploadImage from './uploadImage'

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
    // await ThreadModel.create({
    //   merkleRoot: notification.content.cast.hash,
    // })
    if (!notification.content.cast?.threadHash) {
      return
    }
    const thread = await fetchThread(
      notification.content.cast.threadHash,
      notification.content.cast.hash,
      bearerToken
    )
    if (!thread.length || !thread[0].author) {
      return
    }
    const imageBuffer = textToImage(
      thread.map((t) => t.text).join('\n\n'),
      thread[0].author,
      title
    )
    const link = await uploadImage(imageBuffer)
    const text = `screenshotessay\n${link}`
    // await publishCast(text, notification.content.cast.hash)
    console.log('Published', text, notification.content.cast.hash)
  } catch (error) {
    console.log(error instanceof Error ? error.message : error)
    if (notification.content.cast?.hash) {
      // await publishCast(
      //   "@borodutch something went wrong here, I'm so sorry",
      //   notification.content.cast.hash
      // )
    }
  }
}
