'use strict'

const uuid = require('uuid/v4')

/**
 * Bit flip (swap) a uuid or hex id
 *
 * @param {string} id - as uuid or hex string
 * @returns {string} swapped uuid
 */
function swapId (id) {
  const isUuid = id.includes('-')
  const hex = id.replace(/[^0-9a-f]/ig, '')

  const hexFlipped = hex.slice(6, 8) + hex.slice(4, 6) +
                     hex.slice(2, 4) + hex.slice(0, 2) +
                     hex.slice(10, 12) + hex.slice(8, 10) +
                     hex.slice(14, 16) + hex.slice(12, 14) +
                     hex.slice(16)

  const uuidFlipped = hexFlipped.substring(0, 8) + '-' +
                      hexFlipped.substring(8, 12) + '-' +
                      hexFlipped.substring(12, 16) + '-' +
                      hexFlipped.substring(16, 20) + '-' +
                      hexFlipped.substring(20, 32)

  return isUuid ? uuidFlipped : hexFlipped
}

/**
 * Generate UUID
 *
 * @returns {string} uuid
 */
function generateUuid () {
  return uuid()
}

/**
 * Converting a UUID to a base64 string
 * @author: Mark Seecof & arootbeer @ https://stackoverflow.com/questions/6095115/javascript-convert-guid-in-string-format-into-base64?answertab=active#tab-top]
 *
 * @param {string} uuid - a uuid or guid
 * @returns {string} base64 string
 */
function uuidToBase64 (uuid) {
  const hexList = '0123456789abcdef'
  const b64List = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'

  let id = uuid.replace(/[^0-9a-f]/ig, '').toLowerCase()
  if (id.length !== 32) return ''

  id += '0'

  let a, p, q
  let r = ''
  let count = 0
  while (count < 33) {
    a = (hexList.indexOf(id.charAt(count++)) << 8) |
        (hexList.indexOf(id.charAt(count++)) << 4) |
        (hexList.indexOf(id.charAt(count++)))

    p = a >> 6
    q = a & 63

    r += b64List.charAt(p) + b64List.charAt(q)
  }
  r += '=='

  return r
}

/**
 * Convert a UUID to another format
 *
 * @param {string} uuid
 * @param {string} encoding
 * @returns {string} coverted id
 */
function convertUuid (uuid, encoding) {
  const pattern = /[a-f0-9]{8}-?[a-f0-9]{4}-?[a-f0-9]{4}-?[a-f0-9]{4}-?[a-f0-9]{12}/i
  if (!pattern.test(uuid)) throw new Error(`Provided uuid ${uuid} is not valid. See: RFC4122 for details.`)

  if (encoding === 'uuid') return uuid
  else if (encoding === 'hex') return uuid.replace(/[^0-9a-f]/ig, '').toLowerCase()
  else if (encoding === 'base64') {
    return uuidToBase64(uuid)
  } else throw new Error('Selected output encoding is not supported')
}

/**
 * Generate a full set of ids and keys in all possible formats
 *
 * @returns {object} full set of unflipped and flipped uuid in differend formats
 */
function generateFullSet () {
  const id = generateUuid()
  const swappedId = swapId(id)
  const key = generateUuid()
  const swappedKey = swapId(key)
  const iv = generateUuid()
  const swappedIv = swapId(iv)

  return {
    id: {
      uuid: id,
      hex: convertUuid(id, 'hex'),
      base64: convertUuid(id, 'base64')
    },
    idFlipped: {
      uuid: swappedId,
      hex: convertUuid(swappedId, 'hex'),
      base64: convertUuid(swappedId, 'base64')
    },
    key: {
      uuid: key,
      hex: convertUuid(key, 'hex'),
      base64: convertUuid(key, 'base64')
    },
    keyFlipped: {
      uuid: swappedKey,
      hex: convertUuid(swappedKey, 'hex'),
      base64: convertUuid(swappedKey, 'base64')
    },
    initializationVector: {
      uuid: iv,
      hex: convertUuid(iv, 'hex'),
      base64: convertUuid(iv, 'base64')
    },
    initializationVectorFlipped: {
      uuid: swappedIv,
      hex: convertUuid(swappedIv, 'hex'),
      base64: convertUuid(swappedIv, 'base64')
    }
  }
}

module.exports = {
  convertUuid,
  generateFullSet,
  generateUuid,
  swapId,
  uuidToBase64
}
