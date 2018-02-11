import firebase from 'firebase-admin/lib/index'
import serviceAccount from './serviceAccountKey.json'

export default {
  credential: firebase.credential.cert(serviceAccount),
  apiKey: 'AIzaSyBHseZFrp9TIx5h3CUn93sxx2TfDlwZbac',
  authDomain: 'mdou-ptz.firebaseapp.com',
  databaseURL: 'https://mdou-ptz.firebaseio.com',
  projectId: 'mdou-ptz',
  storageBucket: 'mdou-ptz.appspot.com',
  messagingSenderId: '385856270254'
}
