import React, { useState, useEffect } from "react";
import "./DoctorDashboard.css";
import { firestore } from "../db/firebase";

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
        const doctorRef = firestore.collection("doctors").doc(currentUser.uid);
        const doctorData = await doctorRef.get();

        if (doctorData.exists) {
          // Doctors koleksiyonu içerisindeki appointments, patients, meals, meetings dizilerini al
          const { appointments, patients, meals } = doctorData.data();

          const totalPatients = patients.length;
          const today = new Date();

          // Randevuları bugünkü tarih ile filtreleyin
          const totalAppointments = appointments.filter((appointment) => {
            const appointmentDate = appointment.start.toDate();
            return (
              appointmentDate.getDate() === today.getDate() &&
              appointmentDate.getMonth() === today.getMonth() &&
              appointmentDate.getFullYear() === today.getFullYear()
            );
          }).length;

          const totalMeals = meals.length;
          const totalMeetings = appointments.length;

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
