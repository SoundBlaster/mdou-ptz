'use strict'
import fetch from 'node-fetch'
import firebase from 'firebase-admin'
import cheerio from 'cheerio'
import * as firestore from 'firebase/firestore'
import serviceAccount from './serviceAccountKey.json'
import https from 'https'

const config = {
  credential: firebase.credential.cert(serviceAccount),
  apiKey: 'AIzaSyBHseZFrp9TIx5h3CUn93sxx2TfDlwZbac',
  authDomain: 'mdou-ptz.firebaseapp.com',
  databaseURL: 'https://mdou-ptz.firebaseio.com',
  projectId: 'mdou-ptz',
  storageBucket: 'mdou-ptz.appspot.com',
  messagingSenderId: '385856270254'
}

firebase.initializeApp(config)

const db = firebase.firestore()
const parseurl = 'https://mdou.petrozavodsk-mo.ru/site/statistics'

const parseStats = () => {
  const agent = new https.Agent({
    rejectUnauthorized: false
  })
  const params = {
    method: 'GET',
    headers: {
      'Accept-Encoding': 'br, gzip, deflate',
      'Accept': 'text/html,application/xhtml+xml,application/xmlq=0.9,*/*q=0.8',
      'Accept-Language': 'ru',
    },
    agent,
  }
  return fetch(parseurl, params)
    .then(r => r.text())
    // fix HTML issue
    .then(body => body.replace('</tr> </tr>', '</tr>'))
      // parse data
    .then(body => {
        const $ = cheerio.load(body)
        const nodes = $('table[class=stat] > tbody')
        const t1 = nodes.eq(0).find('td')
        const t2 = nodes.eq(1).find('td')
        const t3 = nodes.eq(2).find('td')

        const tables = [t1, t2, t3]

        const rawdata = [[], [], []]

        tables.forEach((table, idx) => {
        table.each((i, td) => {
        if (!rawdata[idx][Math.floor(i / 2)]) rawdata[idx][Math.floor(i / 2)] = []
      rawdata[idx][Math.floor(i / 2)][i % 2] = td.firstChild && td.firstChild.data
    })
    })

    return [
      [...rawdata[0].slice(0,2)],
      [...rawdata[0].slice(3)],
      [...rawdata[1].slice(0,2)],
      [...rawdata[1].slice(3,8)],
      [...rawdata[1].slice(9)],
      [...rawdata[2].slice(0,2)],
      [...rawdata[2].slice(3,13)],
      [...rawdata[2].slice(15)]
    ]
  })
}

/**
 * @param {string} value
 */
const uploadAsToday = value => {
  const date = new Date()
  const day = date.getDate()
  const month = date.getMonth()
  const year = date.getFullYear()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const key = year * 100000000 + month * 1000000 + day * 10000 + hour * 100 + minute
  return upload('days', value, key)
}

/**
 * @param {string} collection - Collection name in Firebase storage
 * @param {string} value
 * @param {number} docName - String with date in format YYYYMMDDHHmm
 */
const upload = (collection, value, docName) => {
  return db.collection(collection).doc(`${docName}`).set({ value })
    .then(() => ({ value, docName }))
    .catch(error => ({ value, docName, error }))
}

const loadData = () => {
  return db.collection('stats')
    .get()
    .then((snapshot) => {
      const data = []
      snapshot.forEach((doc) => {
        data.push({
          date: doc.id,
          value: doc.data().value,
        })
      })
      return data
    })
}

const logData = data => {
  console.log('loaded:', data.map(({ date }) => date))
  return data
}

const fixDate = date => {
  if (date.length === 8) {
    // 01234567
    // DDMMYYYY => YYYYMMDD
    const day = date.slice(0, 2)
    const month = date.slice(2, 4)
    const year = date.slice(4,8)
    return parseInt(`${year}${month}${day}`, 10)
  }
  return date
}

const fixDates = data => {
  return data.map(({ date, value }) => ({ date: fixDate(date), value}))
}

const writeData = data => {
  const promises = data.map(({ date, value }) => upload('days', value, date))
  return Promise.all(promises)
}

// RUN
/**
 * Fix previous error in date format
 */
const fix = () => {
  loadData()
    .then(logData)
    .then(fixDates)
    .then(logData)
    .then(writeData)
    .then(result => {
      console.log('done', result)
    })
    .catch(error => {
      console.log('error', error)
    })
}

/**
 * Load, parse and write value for today
 */
parseStats()
  .then(data => JSON.stringify(data))
  .then(uploadAsToday)
  .then(({ docName }) => {
    console.log(`${new Date().toISOString()} | Document ${docName} successfully written!`)
  })
  .catch(({ error, docName }) => {
    console.error(`Error writing document ${docName}: ${error}`)
  })
