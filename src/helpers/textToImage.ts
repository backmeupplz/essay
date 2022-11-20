import { UltimateTextToImage, VerticalImage } from 'ultimate-text-to-image'

export default function (text: string, title?: string) {
  const textToImage = new UltimateTextToImage(text, {
    width: 1524,
    fontFamily: 'Arial',
    fontColor: '#373530',
    fontSize: 32,
    valign: 'middle',
  })
  const verticalImage = new VerticalImage(
    title
      ? [
          new UltimateTextToImage(title, {
            width: 1524,
            fontFamily: 'Arial',
            fontColor: '#373530',
            fontSize: 64,
            fontWeight: 'bold',
            valign: 'middle',
            marginBottom: 40,
          }),
          textToImage,
        ]
      : [textToImage],
    {
      margin: 35,
      backgroundColor: '#ffffff',
    }
  )
  return verticalImage.render().toBuffer()
}
