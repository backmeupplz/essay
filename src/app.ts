import { startPolling } from '@big-whale-labs/botcaster'
import env from './helpers/env'
import getBearerTokenFromMnemonic from './helpers/getBearerTokenFromMnemonic'
import handleNotification from './helpers/handleNotification'
import runMongo from './helpers/mongo'

void (async () => {
  console.log('Connecting to mongo...')
  await runMongo()
  console.log('Connected to mongo')
  console.log('Starting polling...')
  const bearerToken = await getBearerTokenFromMnemonic(env.FARCASTER_MNEMONIC)
  console.log('Got bearer token', bearerToken)
  startPolling(bearerToken.secret, (notification) =>
    handleNotification(notification, bearerToken.secret)
  )
  console.log('The app started!')
})()
