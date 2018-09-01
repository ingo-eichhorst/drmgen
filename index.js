#! /usr/bin/env node

'use strict'

const lib = require('./lib')
const program = require('commander')
const fs = require('fs')
const version = JSON.parse(fs.readFileSync('./package.json')).version

/**
 * perform an action (read or delete) on a nested property
 *
 * @param {object} object - the object with nested properties
 * @param {string} path - dot seperated path to the nested property
 *                        example: "prop1.prop2.prop3"
 */
function nestedKeyAction (action, object, path) {
  const objectCopy = JSON.parse(JSON.stringify(object))
  const parts = path.split('.')

  let nestedValue
  parts.reduce((acc, key, index) => {
    if (index === parts.length - 1) {
      nestedValue = acc[key]
      if (action === 'delete') delete acc[key]
      return true
    }
    return acc[key]
  }, objectCopy)

  if (action === 'delete') return objectCopy
  else return nestedValue
}

if (require.main === module) {
  program
    .version(version, '-v, --version')
    .option(
      '-f, --format [value]',
      'output format [multiline,json,oneline] (default:json)'
    )
    .option('-s, --swap', 'include swapped if set (default:false)')
    .option(
      '-e, --encoding [value]',
      'output endodings one or more of [uuid, hex, base64] (default:all)'
    )
    .option(
      '-i, --ids [value]',
      'included id types [key, id, iv] (default:all)'
    )
    .parse(process.argv)

  let keySet = lib.generateFullSet()
  if (!program.swap) {
    delete keySet.keyFlipped
    delete keySet.initializationVectorFlipped
    delete keySet.idFlipped
  }
  if (program.ids) {
    for (let entry in keySet) {
      if (!program.ids.includes(entry.replace('Flipped', ''))) {
        delete keySet[entry]
      }
    }
  }
  if (program.encoding) {
    for (let entry in keySet) {
      for (let key in keySet[entry]) {
        if (!program.encoding.includes(key)) {
          keySet = nestedKeyAction('delete', keySet, `${entry}.${key}`)
        }
      }
    }
  }

  let output = ''
  if (program.format === 'multiline' || program.format === 'oneline') {
    for (let entry in keySet) {
      for (let key in keySet[entry]) {
        if (program.format === 'oneline') {
          output += `${nestedKeyAction('read', keySet, entry + '.' + key)} `
        }
        if (program.format === 'multiline') {
          output += `${entry}-${key} ${nestedKeyAction(
            'read',
            keySet,
            entry + '.' + key
          )}\n`
        }
      }
    }
  } else output = keySet

  console.log(output)
} else {
  module.exports = lib
}
