////////////////////////////////////////////////////////////////////////////////
//
// EFF Diceware Passphrase module forked from Emil Bay’s
// excellent module of the same name.
//
// Differences:
//
// - ECMASCript Module.
// - Single file.
// - Class.
// - Uses Web Crypto API in browser and expects reference to default
//   crypto module under Node.js.
// - Removes sodium-native dependency.
//
// Copyright (c) 2021 Aral Balkan, Small Technology Foundation.
// For full copyright notices, please see LICENSE file.
//
////////////////////////////////////////////////////////////////////////////////

import wordlist from './wordlist.js'

const NUMBER_OF_TOKENS = wordlist.length
const ENTROPY_PER_TOKEN = Math.log(NUMBER_OF_TOKENS) / Math.log(2)
const MAX = Number.MAX_SAFE_INTEGER

export default class EFFDicewarePassphrase {
  // On Node.js, pass a reference to the standard crypto module.
  // In the browser, no argument necessary, it will automatically detect
  // and use Web Crypto API.
  constructor (crypto) {
    if (typeof window === 'object') {
      // Browser
      this.getRandomValues = window.crypto.getRandomValues.bind(window.crypto)
    } else {
      // Node.js. Expect crypto to be in an instance of the
      // default Node.js crypto module.
      this.getRandomValues = crypto.randomFillSync
    }
    this.buf = new Uint8Array(7)
  }

  words (count) {
    assert(count > 0, 'count must be positive integer')
    assert(count < NUMBER_OF_TOKENS, 'count must be less than the number of tokens')

    const idx = this.sample(count, NUMBER_OF_TOKENS)

    return this.shuffle(idx.map(function (i) {
      return wordlist[i]
    }))
  }

  entropy (minimum) {
    assert(minimum > 0, 'minimum entropy must be positive')
    assert(minimum <= NUMBER_OF_TOKENS * ENTROPY_PER_TOKEN, 'minimum entropy must be less than maximum possible entropy')

    return this.words(Math.ceil(minimum / ENTROPY_PER_TOKEN))
  }

  //
  // Private
  //

  shuffle (arr) {
    const N = arr.length
    for (let i = 0; i < N - 1; i++) {
      const j = this.uniform(N - i) + i
      const tmp = arr[i]
      arr[i] = arr[j]
      arr[j] = tmp
    }

    return arr
  }


  sample (sampleSize, populationSize) {
    assert(Number.isSafeInteger(sampleSize), 'sampleSize must be safe integer')
    assert(Number.isSafeInteger(populationSize), 'populationSize must be safe integer')
    assert(sampleSize <= populationSize, 'sampleSize can not be larger than populationSize')

    const samples = []

    let candidate = 0
    let samplesTaken = 0

    let rand
    while (samplesTaken < sampleSize) {
      rand = this.uniform(populationSize - candidate)

      if (rand >= sampleSize - samplesTaken) {
        candidate++
      } else {
        samplesTaken = samples.push(candidate++)
      }
    }

    return samples
  }


  uniform (limit) {
    assert(Number.isInteger(limit), 'limit must be integer')
    assert(limit > 0, 'limit must be larger than 0')
    assert(limit <= MAX, 'limit must be at most 2^53 - 1')

    // Edge cases:
    // 1: MAX is divisible by limit
    // 2: limit > MAX / 2
    const min = MAX - (MAX % limit)

    const buf = this.buf
    let n = 0
    do {
      this.getRandomValues(buf)
      // Returns number in [0, 2^53)
      n = ((((buf[6] & 0b00011111) << 16) | (buf[5] << 8) | (buf[4])) >>> 0) * 0x100000000 + // 21 bits, shifted left 32 bits
        (((buf[3] << 24) | (buf[2] << 16) | (buf[1] << 8) | (buf[0])) >>> 0) // 32 bits
    } while (n >= min)

    return n % limit
  }
}

class AssertionError extends Error {}
AssertionError.prototype.name = 'AssertionError'

function assert (t, m) {
  if (!t) {
    const error = new AssertionError(m)
    if (Error.captureStackTrace) Error.captureStackTrace(error, assert)
    throw error
  }
}
