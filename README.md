# EFF Diceware Passphrase

Forked from Emil Bay’s excellent module of the same name.

This is a single-file ESM version of Emil’s excellent module that also removes the sodium-native dependency. Instead, it employs a bring-your-own-crypto approach where you pass a reference to Node’s default crypto module when using the module under Node and it automatically detects and uses the Web Crypto API when running in the browser.

## Examples

### Node.js

```js
import crypto from 'crypto'
import EFFDicewarePassphrase from './index.js'

const generate = new EFFDicewarePassphrase(crypto)
const passphrase1 = generate.words(8)
const passphrase2 = generate.entropy(100)

console.log('8 words:', passphrase1.join(' '))
console.log('100 bits of entropy:', passphrase2.join(' '))
```

### Browser

```html
<!doctype html>
<html lang='en'>
<head>
  <meta charset='UTF-8'>
  <meta name='viewport' content='width=device-width, initial-scale=1.0'>
  <title>EFF Diceware Passphrase</title>
</head>
<body>
  <h1>EFF Diceware Passphrase Example</h1>
  <ul>
    <li><strong>8 words:</strong> <span id='passphrase1'></span></li>
    <li><strong>100 bits of entropy:</strong> <span id='passphrase2'></span></li>
  </ul>
  <script type="module">
    import EFFDicewarePassphrase from './index.js'

    const generate = new EFFDicewarePassphrase()
    const passphrase1 = generate.words(8)
    const passphrase2 = generate.entropy(100)

    document.getElementById('passphrase1').innerText = passphrase1.join(' ')
    document.getElementById('passphrase2').innerText = passphrase2.join(' ')
  </script>
</body>
</html>
```
