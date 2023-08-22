// AdminLogin.js
import React, { useState } from "react";
import { adminCredentials } from "./firebaseConfig"; // firebaseConfig.js dosyasından adminCredentials'ı import edin
import firebase from "firebase/app";
import "firebase/auth";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (email === adminCredentials.email && password === adminCredentials.password) {
      try {
        await firebase.auth().signInWithEmailAndPassword(email, password);
      } catch (error) {
        setError("Login error. Please try again.");
      }
    } else {
      setError("Invalid credentials. Please check your email and password.");
    }
  };

  return (
    <div>
      <h2>Admin Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit">Login</button>
        {error && <p>{error}</p>}
      </form>
    </div>
  );
};

export default AdminLogin;
