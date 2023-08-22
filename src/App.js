import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import firebaseConfig from './db/firebase'


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
    // Firebase Auth'ta oturum durumunu dinle
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      setCurrentUser(user);
    });

    // Component unmount olduğunda dinlemeyi kapat
    return () => unsubscribe();
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
          
          <Route exact path="/admin-dashboard" element={currentUser ? <AdminDashboard currentUser={currentUser} /> : <Navigate to="/" />} />
           
          
          <Route exact path="/doctor-dashboard" element={<DoctorDashboard currentUser={currentUser} />}/>
            
          
          <Route exact path="/appointments" element= {currentUser ? <Appointments currentUser={currentUser} /> : <Navigate to="/" />}/>
           
          
          <Route exact path="/meals" element={currentUser ? <Meals currentUser={currentUser} /> : <Navigate to="/" />}/>
            
          
          <Route exact path="/consultations" element={currentUser ? <Consultations currentUser={currentUser} /> : <Navigate to="/" />}/>
            
          
          <Route exact path="/accounting" element={currentUser ? <Accounting currentUser={currentUser} /> : <Navigate to="/" />}/>
            
          
          <Route exact path="/clients" element={currentUser ? <Clients currentUser={currentUser} /> : <Navigate to="/" />}/>
          
          
          <Route exact path="/account-settings" element={currentUser ? <AccountSettings currentUser={currentUser} /> : <Navigate to="/" />}/>
          
          
          <Route exact path="/profile" element={currentUser ? <ProfileSettings currentUser={currentUser} /> : <Navigate to="/" />}/>
        </Routes>
      </div>
    </Router>
  );
};

export default App;
