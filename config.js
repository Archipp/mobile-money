import firebase from 'firebase/compat/app'
import { getDatabase } from 'firebase/database'

const firebaseConfig = {
    apiKey: "AIzaSyAgDQk3lWrcD5XsqtSzryEDgESmJblNF5M",
    databaseURL: "https://mobile-money-10718-default-rtdb.firebaseio.com",
  };
  
  const app = firebase.initializeApp(firebaseConfig);
  
  const db = getDatabase(app);

  export { db };