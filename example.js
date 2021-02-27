// Node.js example
import crypto from 'crypto'
import EFFDicewarePassphrase from './index.js'

const generate = new EFFDicewarePassphrase(crypto)
const passphrase1 = generate.words(8)
const passphrase2 = generate.entropy(100)

console.log('8 words:', passphrase1.join(' '))
console.log('100 bits of entropy:', passphrase2.join(' '))
