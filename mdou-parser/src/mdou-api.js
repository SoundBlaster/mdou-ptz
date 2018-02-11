import firebase from 'firebase-admin'
import * as firestore from 'firebase/firestore'
import config from './config'

firebase.initializeApp(config)
const db = firebase.firestore()

export const DAYS = 'days'
export const QUERY = 'query'
export const CONTENT = 'content'

export default class API {
  /**
   * Load query and days collections from the remote database
   * @return {Array<*>}
   */
  loadStore = () => {
    const actions = [
      this._loadQuery(),
      this._loadDays(),
    ]
    return Promise.all(actions)
  }

  /**
   * Write operation
   * @param {string} collectionName - Collection name in Firebase storage. See: DAYS, QUERY, CONTENT.
   * @param {string} value
   * @param {number} docName - String with date in format YYYYMMDDHHmm
   */
  upload = (collectionName, value, docName) =>
    db.collection(collectionName)
      .doc(`${docName}`)
      .set({ value })
      .then(() => ({ value, docName }))
      .catch(error => ({ value, docName, error }))

  _handleLoadingError = error => {
    alert('Error occurred:' + error.message)
  }

  _reverseDataForKey = key => data => ({ [key]: data.reverse() })

  _mapDocs = (handler = doc => doc.data()) =>
    snapshot => snapshot.docs.map(doc => ({ date: doc.id, value: handler(doc) }))

  _loadQuery = () => {
    if (!db) return
    return db.collection(QUERY)
      .get()
      .then(this._mapDocs())
      .then(
        this._reverseDataForKey(QUERY),
        this._handleLoadingError
      )
  }

  _loadDays = () => {
    if (!db) return
    return db.collection(DAYS)
      .get()
      .then(this._mapDocs(doc => JSON.parse(doc.data().value)))
      .then(
        this._reverseDataForKey(CONTENT),
        this._handleLoadingError
      )
  }
}
