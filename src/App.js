import React, { useRef, useState} from 'react';
import './App.css';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  apiKey: "AIzaSyB8rzlnyNxY13kYeo32Jip2BZX16coW4x4",
  authDomain: "chatbox-c3c9a.firebaseapp.com",
  projectId: "chatbox-c3c9a",
  storageBucket: "chatbox-c3c9a.appspot.com",
  messagingSenderId: "15550922823",
  appId: "1:15550922823:web:4c35be471cf0b44d147162",
  measurementId: "G-7N8BKTW5EP"
})

const auth= firebase.auth();
const firestore= firebase.firestore();

function App() {
  const [user] = useAuthState(auth);
  
  
  return (
    <div className="App">
      <header >
      <h1>⚛️🔥💬</h1>
        <SignOut />
      </header>
      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>
    </div>
  );
}

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider)
  }

  return (
    <button className="sign-in" onClick={signInWithGoogle}>Sign in with Google</button>
  )
}

function SignOut() {
  return auth.currentUser && (

    <button className="sign-out" onClick={() => auth.signOut()}>Sign Out</button>
  )
}

function ChatRoom() {
  const dummy=useRef();

  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);

  const [messages] = useCollectionData(query, {idField: 'id'});

  const [ formValue, setFormValue ] = useState('');

  const sendMessage = async (e) => {
    e.preventDefault();

    const {uid } = auth.currentUser;
    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoUrl: 'https://api.imgflip.com/get_memes'
    });
    setFormValue('');

    dummy.current.scrollIntoView({ behavior: 'smooth'});
  }

  return (
    <>
    <main>
      {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}

      <div ref={dummy}></div>
    </main>

    <form onSubmit={sendMessage}>
      <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="say something"/>

      <button type="submit">🕊️</button>
    </form>
    </>
  )
}

function ChatMessage(props){
  const {text, uid, photoUrl} = props.message;
  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (
    <div className={`message ${messageClass}`}>
      <img src= {photoUrl || 'https://api.imgflip.com/get_memes'} />
      <p>{text}</p>
    </div>
  )
}

export default App;
