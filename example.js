// Node.js example
import crypto from 'crypto'
import EFFDicewarePassphrase from './index.js'

const generate = new EFFDicewarePassphrase(crypto)
const passphrase = generate.words(8)

console.log(passphrase)
