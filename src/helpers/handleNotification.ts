import { Notification } from '@big-whale-labs/botcaster'
import { ThreadModel } from '@/models/Thread'
import fetchThread from '@/helpers/fetchThread'
import publishCast from '@/helpers/publishCast'
import textToImage from '@/helpers/textToImage'
import uploadImage from '@/helpers/uploadImage'

export default async function (notification: Notification) {
  try {
    if (notification.type !== 'cast-mention') {
      return
    }
    const mentionText = notification.cast?.text
    if (!mentionText) {
      return
    }
    const title = /(?<=@essay).*$/.exec(mentionText)?.[0]?.trim()
    if (!notification.cast?.merkleRoot) {
      return
    }
    const dbThread = await ThreadModel.findOne({
      merkleRoot: notification.cast.merkleRoot,
    })
    if (dbThread) {
      return
    }
    await ThreadModel.create({
      merkleRoot: notification.cast.merkleRoot,
    })
    const thread = await fetchThread(notification.cast?.merkleRoot)
    if (!thread.length) {
      return
    }
    const imageBuffer = textToImage(thread.join('\n\n'), title)
    const link = await uploadImage(imageBuffer)
    const text = `screenshotessay\n${link}`
    await publishCast(text, notification.cast.merkleRoot)
    console.log('Published', text, notification.cast.merkleRoot)
  } catch (error) {
    console.log(error instanceof Error ? error.message : error)
    if (notification.cast?.merkleRoot) {
      await publishCast(
        "@borodutch something went wrong here, I'm so sorry",
        notification.cast.merkleRoot
      )
    }
  }
}
