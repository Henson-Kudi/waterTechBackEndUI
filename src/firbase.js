import firebase from 'firebase'
import 'firebase/storage'

const app = firebase.initializeApp({
  "projectId": "water-tech-files-storage",
  "appId": "1:904994163595:web:502709034d2777cdb93d8e",
  "storageBucket": "water-tech-files-storage.appspot.com",
  "locationId": "us-central",
  "apiKey": "AIzaSyC_hIfGIV63FdKqRRbJXZyGMeYnJquIuQ0",
  "authDomain": "water-tech-files-storage.firebaseapp.com",
  "messagingSenderId": "904994163595"
});

export {app as default}