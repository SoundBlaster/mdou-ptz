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
function parseStats() {
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

function upload(value) {
  const date = new Date()
  const day = date.getDate()
  const month = date.getMonth()
  const year = date.getFullYear()
  const format = day*1000000 + month*10000 + year
  return db.collection('stats').doc(`${format}`).set({ value })
    .then(function() {
      console.log(`Document ${format} successfully written!`)
    })
    .catch(function(error) {
      console.error('Error writing document: ', error)
    })
}

parseStats()
  .then(data => JSON.stringify(data))
  .then(upload)
  .catch(e => {
    console.log('error:', e)
  })
