#!/usr/bin/env node

import * as path from 'path'
import * as fs from 'fs'
import yargs from 'yargs/yargs'
import {hideBin} from 'yargs/helpers'
import {parse} from 'comment-json'
const {convertSdl} = require('../')

const argv = yargs(hideBin(process.argv))
  .option('opt', {
    alias: 'o',
    type: 'string',
    describe: 'options',
    demandOption: false,
  })
  // .option('sdl', {
  //   alias: 's',
  //   type: 'string',
  //   describe: 'sdl path',
  //   demandOption: true,
  // })
  // .option('dest', {
  //   alias: 'd',
  //   type: 'string',
  //   describe: 'dest path',
  //   demandOption: true,
  // })
  .help()
  .version()
  .parseSync()

// 0. options
// - dest: 어디로 출력 할 것인가?
// - one folder 에 다 출력 할 것인가?
// - Fragment | Mutation | Query folder에 출력 할 것인가?

try {
  const optFile = argv.opt ? argv.opt : './stg.json'
  const options = parse(fs.readFileSync(optFile).toString())
  // 1. load sdl
  const resolvedPath = path.resolve(options.schema)
  const schema = fs.readFileSync(resolvedPath, 'utf8')
  // 2. gen graphql
  convertSdl(schema, options)
} catch (error) {
  console.log(error)
  console.log('make ./stg.json')
}

// if (argv.sdl && argv.dest) {
//   // 1. load sdl
//   const resolvedPath = path.resolve(argv.sdl || '')
//   const inputSdl = fs.readFileSync(resolvedPath, 'utf8')

//   // 2. destination
//   const dest = argv.dest

//   // 3. gen graphql
//   convertSdl(inputSdl, {dest})
// }
