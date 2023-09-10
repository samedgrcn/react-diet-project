import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import firebaseConfig, { auth } from './db/firebase'
import { onAuthStateChanged } from "firebase/auth";

import Navbar from "./components/Navbar";
import AdminDashboard from "./components/AdminDashboard";
import DoctorDashboard from "./components/DoctorDashboard";
import Appointments from "./components/Appointments";
import Meals from "./components/Meals";
import Consultations from "./components/Consultations";
import Accounting from "./components/Accounting";
import UserPage from "./components/UserPage";
import Clients from "./components/PatientList"
import AccountSettings from "./components/AccountSettings"
import ProfileSettings from "./components/ProfileSettings"




if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}

const App = () => {
  
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
       setCurrentUser(user) // Kullanıcı oturumu açtıysa yapılacak işlemler
      } else {
        setCurrentUser("")// Kullanıcı oturumu kapattıysa yapılacak işlemler
      }
    });
  
    return () => {
      unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    try {
      await firebase.auth().signOut();
      window.location.reload();
      console.log("Oturum kapatıldı.")
    } catch (error) {
      console.error("Oturum kapatılırken hata oluştu:", error);
    }
  };

  

  return (
    <Router>
      <div className="app-container">
        <Navbar currentUser={currentUser} handleLogout={handleLogout} />

        <Routes>
        
        

          <Route exact path="/" element={<UserPage/>}/>  
          
          <Route exact path="/admin-dashboard" element={<AdminDashboard currentUser={currentUser} />} />
           
          
          <Route exact path="/doctor-dashboard" element={<DoctorDashboard currentUser={currentUser} />}/>
            
          
          <Route exact path="/appointments" element= {<Appointments currentUser={currentUser} />}/>
           
          
          <Route exact path="/meals" element={<Meals currentUser={currentUser} />}/>
            
          
          <Route exact path="/consultations" element={<Consultations currentUser={currentUser} />}/>
            
          
          <Route exact path="/accounting" element={<Accounting currentUser={currentUser} />}/>
            
          
          <Route exact path="/clients" element={ <Clients currentUser={currentUser} />}/>
          
          
          <Route exact path="/account-settings" element={<AccountSettings currentUser={currentUser} />}/>
          
          
          <Route exact path="/profile" element={<ProfileSettings currentUser={currentUser} />}/>
        </Routes>
      </div>
    </Router>
  );
};

export default App;