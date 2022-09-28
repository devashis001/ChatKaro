import React, { useRef, useState } from 'react';
import './App.css';

//import firebase from 'firebase/app'; //older version
import firebase from 'firebase/compat/app'; //v9

//to use auth
//import 'firebase/auth'; //older version
import 'firebase/compat/auth'; //v9

//to use firestore
//import 'firebase/firestore'; //Older Version
import 'firebase/compat/firestore'; //v9
import 'firebase/analytics';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  // your config
  apiKey: "AIzaSyDNTUdftUk0dpVwfcJgZS-fkGr2KI_UpYk",
  authDomain: "react-chatapp-b87aa.firebaseapp.com",
  projectId: "react-chatapp-b87aa",
  databaseURL :"https:/react-chatapp-b87aa.firebaseio.com",
  storageBucket: "react-chatapp-b87aa.appspot.com",
  messagingSenderId: "100794556588",
  appId: "1:100794556588:web:03ec1d522946d19ec13f09",
  measurementId: "G-8S10VJEWE9"
})

const auth = firebase.auth();
const firestore = firebase.firestore();



function App() {

  const [user] = useAuthState(auth);
   const [FontSize, setFontSize] = useState(25);
 

  return (
    <div className="App">
      <header>
        <h1>⚛️ WELCOME TO CHATKARO 💬</h1>
        <SignOut />
      </header>
      <section>
        {user ? <ChatRoom /> : <SignIn />}
        
      </section>
       <footer style={{fontSize: `${FontSize}px`} }>
         <span style={{fontWeight: 'bold',textAlign: "center" ,color: "white"}} >
            This app is created by Devashis Gupta
      </span>
      </footer>
     
    </div>
  );
}

function SignIn() {

  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }
const [fontSize, setFontSize] = useState(30);
  return (
    <>
      <button className="sign-in" onClick={signInWithGoogle}>Sign in with Google</button>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
       <p style={{fontSize: `${fontSize}px`} }>
      <span style={{fontWeight: 'bold'}} >
            We believe in CHATKARO is more than just an app
      </span>
   </p>
       </>
    
  )

}

function SignOut() {
  return auth.currentUser && (
    <button className="sign-out" onClick={() => auth.signOut()}>Sign Out</button>
  )
}


function ChatRoom() {
  const dummy = useRef();
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);

  const [messages] = useCollectionData(query, { idField: 'id' });

  const [formValue, setFormValue] = useState('');


  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })

    setFormValue('');
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  }

  return (<>
    <main>

      {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}

      <span ref={dummy}></span>

    </main>

    <form onSubmit={sendMessage}>

      <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="say something nice" />

      <button type="submit" disabled={!formValue}>SEND🕊️</button>

    </form>
  </>)
}


function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (<>
    <div className={`message ${messageClass}`}>
      <img src={photoURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'} alt="" />
      <p>{text}</p>
    </div>
  </>)
}


export default App;