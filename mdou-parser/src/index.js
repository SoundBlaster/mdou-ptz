import fs from './fs'
import API, { DAYS, CONTENT } from './mdou-api'
import Parser from './parser'
import isEqual from 'lodash.isequal'

const api = new API()
const parser = new Parser()

/**
 * Build a number key from received date
 * @param {Date} date
 * @return {number}
 */
const buildKey = date => {
  const day = date.getDate()
  const month = date.getMonth()
  const year = date.getFullYear()
  const hour = date.getHours()
  const minute = date.getMinutes()
  return year * 100000000 + month * 1000000 + day * 10000 + hour * 100 + minute
}

/**
 * Return now date object
 * @return {Date}
 */
const now = () => new Date()

/**
 * @param {string} value - Result of parsing as stringified JSON
 */
const uploadAsNow = value => {
  const key = buildKey(now())
  // DEBUG
  // return { docName: key, value }
  return api.upload(DAYS, value, key)
}

const logSuccess = (...args) => {
  const { docName } = args[0]
  console.log(`${nowToString()} | Document ${docName} successfully written!`)
  return args
}

const logFailure = (...args) => {
  const { error, docName } = args[0]
  console.log(`${nowToString()} | Error ${docName || ''}: ${error.message ? error.message : error}`)
  return args
}

const nowToString = () => new Date().toISOString()
/**
 * @param {*} data
 * @return {string}
 */
const stringify = data => JSON.stringify(data)

const extractContent = result => result.filter(item => item[CONTENT])[0][CONTENT][0]

/**
 * Load, parse and write value for today
 */
const createNewRecord = () =>
  api.loadStore()
    .then(extractContent)
    .then(content => {
      parser.parse()
        .then(validate(content.value))
        .then(stringify)
        .then(uploadAsNow)
        .then(logSuccess, logFailure)
    })

const log = mark => result => { console.log(nowToString(), mark, result); return result }
const logThrow = mark => exception => { console.log(nowToString(), mark, exception); throw exception }
const logError = error => { console.log(nowToString(), 'error:', error) }
const read = () => fs.readFile(fs.TMP_PATH)
const deleteFile = () => fs.deleteFile(fs.TMP_PATH).then((result) => { console.log('temp file was deleted'); return result })
const write = string => fs.writeFile(fs.TMP_PATH, string)
const validate = previous => parsed => {
  // console.log('prev', typeof previous, previous)
  // console.log('parsed', typeof parsed, parsed)
  if (!isEqual(parsed, previous && previous)) return parsed
  throw 'No changes'
}

const parseJSON = data => {
  // console.log('parseJSON data', typeof data, data)
  let doc = data && JSON.parse(data)
  if (typeof doc === 'string') {
    doc = JSON.parse(doc)
  } else if (typeof doc === 'object') {
    doc =  JSON.parse(doc.value)
  }
  // console.log('parseJSON doc', typeof doc, doc)
  return doc
}

const parse = previous =>
  parser
    .parse()
    .then(validate(previous))
    .then(stringify)
    .then(uploadAsNow)

const catchReadException = (e) => {
  if (e.code === 'ENOENT') return undefined
  return deleteFile().then(() => undefined)
}

//
// START RUNLOOP
//
read()
  .catch(catchReadException)
  .then(parseJSON)
  .then(parse)
  .then(stringify)
  .then(write)
  .then(log('written!'), logError)
