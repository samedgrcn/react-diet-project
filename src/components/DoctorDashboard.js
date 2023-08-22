import React, { useState, useEffect } from "react";
import "./DoctorDashboard.css";
import firebase from "../db/firebase";

const DoctorDashboard = ({ currentUser }) => {
  const [dashboardData, setDashboardData] = useState({
    totalPatients: 0,
    totalAppointments: 0,
    totalMeals: 0,
    totalMeetings: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      return; // currentUser yoksa işlem yapma
    }

    const fetchDoctorData = async () => {
      try {
        const doctorRef = firebase.firestore().collection("doctors").doc(currentUser.uid);
        const doctorData = await doctorRef.get();

        if (doctorData.exists) {
          

          const patientsSnapshot = await firebase.firestore().collection("doctors").doc(currentUser.id).collection("patients").get();
          const totalPatients = patientsSnapshot.size;

          const appointmentsSnapshot = await firebase.firestore().collection("doctors").doc(currentUser.id).collection("appointments").get();
          const totalAppointments = appointmentsSnapshot.docs.filter((doc) =>
            isToday(doc.data().start.toDate())
          ).length;

          // Yemek sayısını direkt olarak yüklenmiş yemeklerin toplam sayısı olarak al
          const mealsSnapshot = await firebase.firestore().collection("doctors").doc(currentUser.id).collection("meals").get();
          const totalMeals = mealsSnapshot.size;

          
          const meetingsSnapshot = await firebase.firestore().collection("doctors").doc(currentUser.id).collection("appointments").get();
          const totalMeetings = meetingsSnapshot.size;

          setDashboardData({
            totalPatients,
            totalAppointments,
            totalMeals,
            totalMeetings,
          });

          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching doctor data:", error);
      }
    };

    fetchDoctorData();
  }, [currentUser]);

  const isToday = (date) => {
    const today = new Date();
    const targetDate = date;

    return (
      today.getDate() === targetDate.getDate() &&
      today.getMonth() === targetDate.getMonth() &&
      today.getFullYear() === targetDate.getFullYear()
    );
  };

  return (
    <div className="doctor-dashboard-container">
      <h2>Doktor Dashboard</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="dashboard-stats">
          <div className="dashboard-card dashboard-card1">
            <h3>Danışan Sayısı</h3>
            <span>{dashboardData.totalPatients}</span>
          </div>
          <div className="dashboard-card dashboard-card2">
            <h3>Bugünkü Randevu Sayısı</h3>
            <span>{dashboardData.totalAppointments}</span>
          </div>
          <div className="dashboard-card dashboard-card3">
            <h3>Toplam Yemek Sayısı</h3>
            <span>{dashboardData.totalMeals}</span>
          </div>
          <div className="dashboard-card dashboard-card4">
            <h3>Görüşme Sayısı</h3>
            <span>{dashboardData.totalMeetings}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;
