import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose'

@modelOptions({
  schemaOptions: { timestamps: true },
})
export class Thread {
  @prop({ index: true, required: true })
  merkleRoot!: string
}

export const ThreadModel = getModelForClass(Thread)
