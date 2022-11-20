import 'module-alias/register'
import 'source-map-support/register'

import { startPolling } from '@big-whale-labs/botcaster'
import env from '@/helpers/env'
import handleNotification from '@/helpers/handleNotification'
import runMongo from '@/helpers/mongo'

void (async () => {
  console.log('Connecting to mongo...')
  await runMongo()
  console.log('Connected to mongo')
  console.log('Starting polling...')
  startPolling(env.FARCASTER_ADDRESS, handleNotification)
  console.log('The app started!')
})()
