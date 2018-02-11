import API, { DAYS } from './mdou-api'
import Parser from './parser'

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
  console.log(`${new Date().toISOString()} | Document ${docName} successfully written!`)
  return args
}

const logFailure = (...args) => {
  const { error, docName } = args[0]
  console.error(`Error writing document ${docName}: ${error}`)
  return args
}

/**
 * @param {*} data
 * @return {string}
 */
const stringify = data => JSON.stringify(data)

/**
 * Load, parse and write value for today
 */
const createNewRecord = () =>
  parser.parse()
  .then(stringify)
  .then(uploadAsNow)
  .then(logSuccess, logFailure)

//
// START RUNLOOP
//
createNewRecord()

