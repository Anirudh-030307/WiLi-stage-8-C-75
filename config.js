import firebase from 'firebase';
require('@firebase/firestore')
var firebaseConfig = {
    apiKey: "AIzaSyB06BDbEtfywZI--PvHIbteCIYr2D7GOa0",
    authDomain: "survey-caeff.firebaseapp.com",
    databaseURL: "https://survey-caeff.firebaseio.com",
    projectId: "survey-caeff",
    storageBucket: "survey-caeff.appspot.com",
    messagingSenderId: "660196026285",
    appId: "1:660196026285:web:d50057eae65c4afdaea324"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
export default firebase.firestore()