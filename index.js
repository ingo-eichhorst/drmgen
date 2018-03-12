#! /usr/bin/env node

'use strict'

const lib = require('./lib')
const program = require('commander')
const fs = require('fs')
const version = JSON.parse(fs.readFileSync('./package.json')).version

if (require.main === module) {
  program
    .version(version, '-v, --version')
    .option('-f, --format [value]', 'output format [multiline,json,oneline] (default:json)')
    .option('-s, --swap', 'include swapped if set (default:false)')
    .option('-e, --encoding [value]', 'output endodings one or more of [uuid, hex, base64] (default:all)')
    .option('-i, --ids [value]', 'included id types [key, id, iv] (default:all)')
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
          delete keySet[entry][key]
        }
      }
    }
  }

  let output = ''
  if (program.format === 'multiline' || program.format === 'oneline') {
    for (let entry in keySet) {
      for (let key in keySet[entry]) {
        if (program.format === 'oneline') output += `${keySet[entry][key]} `
        if (program.format === 'multiline') output += `${entry}-${key} ${keySet[entry][key]}\n`
      }
    }
  } else output = keySet

  console.log(output)
} else {
  module.exports = lib
}
