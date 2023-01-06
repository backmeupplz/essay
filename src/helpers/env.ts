import * as dotenv from 'dotenv'
import { cleanEnv, str } from 'envalid'
import { cwd } from 'process'
import { resolve } from 'path'

dotenv.config({ path: resolve(cwd(), '.env') })

// eslint-disable-next-line node/no-process-env
export default cleanEnv(process.env, {
  FARCASTER_MNEMONIC: str(),
  IMGUR_CLIENT_ID: str(),
  IMGUR_CLIENT_SECRET: str(),
  IMGUR_REFRESH_TOKEN: str(),
  MONGO: str(),
})
