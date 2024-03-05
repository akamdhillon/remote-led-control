// AuthPage.js
import React, { useState } from "react";
import { auth } from "../firebase-config";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";

const AuthPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [failedAttempt, setFailedAttempt] = useState(false);
  const [signUpFlag, setSignUpflag] = useState(false);

  const signIn = async () => {
    console.log("Attempting to sign in");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("User signed in successfully");
    } catch (error) {
      console.error("Error signing in:", error.message);
      setFailedAttempt(true);
      setSignUpflag(false);
    }
  };
  

  const signUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      console.log("User created and signed in successfully");
      setSignUpflag(true);
      setFailedAttempt(false);
    } catch (error) {
      console.error("Error signing up:", error.message);
    }
  };

  return (
    <div className="main-block">
      <h1>Update LED Colors</h1>
      <div>
      <input
        style={{ width: '250px' }}
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <br />
      <input
        style={{ width: '250px' }}
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />

</div>
      {signUpFlag && (<p>Successfully signed up!</p>)}
      <div>
      </div>
      {failedAttempt && (<p>Credentials do not match</p>)}
      <div>
      <button onClick={signIn}>Sign In</button>
      </div>
      <div>
      <button onClick={signUp}>Sign Up</button>
      </div>
    </div>
  );
};

export default AuthPage;
