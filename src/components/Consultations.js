import React, { useState, useEffect } from "react";
import "./Consultations.css";
import { firestore } from "../db/firebase";

const Consultations = ({ currentUser }) => {
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("name"); // Default sıralama: İsme göre
  const [filterBy, setFilterBy] = useState(""); // Filtreleme
  
  useEffect(() => {
    const fetchConsultations = async () => {
      try {
        const docRef = firestore.collection("doctors").doc(currentUser.uid);
        const docSnapshot = await docRef.get();
        const doctorData = docSnapshot.data();

        
        if (!doctorData || !doctorData.appointments) {
          console.log("Veriler boş veya appointments eksik");
          setConsultations([]);
          setLoading(false);
          return;
        }
        console.log("Appointments uzunluğu:", doctorData.appointments.length);

     
        
        const appointments = doctorData.appointments;
        
        const consultationsData = appointments.map((appointment) => ({
          id: appointment.id,
          patientName: appointment.name || "Bilgi yok",
          date: appointment.start ? appointment.start.toDate() : new Date(),
          notes: appointment.notes || "Açıklama yok",
        }));

        

        // Sıralama ve filtreleme işlemleri burada yapılır
        let sortedAndFilteredConsultations = [...consultationsData];
        if (sortBy === "name") {
          sortedAndFilteredConsultations.sort((a, b) =>
            a.patientName.localeCompare(b.patientName)
          );
        } else if (sortBy === "date") {
          sortedAndFilteredConsultations.sort((a, b) => a.date - b.date);
        }
        if (filterBy) {
          sortedAndFilteredConsultations = sortedAndFilteredConsultations.filter(
            (consultation) =>
              consultation.patientName.toLowerCase().includes(filterBy.toLowerCase())
          );
        }
        console.log('Sıralama ve filtreleme sonrası randevular:', sortedAndFilteredConsultations);
        setConsultations(sortedAndFilteredConsultations);
        setLoading(false);
      } catch (error) {
        console.error("Görüşmeler alınırken hata oluştu:", error);
      }
    };

    fetchConsultations();
  }, [currentUser, sortBy, filterBy]);
  
  
  

  if (loading) {
    return (
      <div className="consultations-container">
        <p className="loading-message">Veriler yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="consultations-container">
      <h1 className="consultations-title">Görüşmeler</h1>
      <div className="filter-section">
        <label htmlFor="sortBy">Sırala: </label>
        <select
          id="sortBy"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="name">İsme Göre</option>
          <option value="date">Tarihe Göre</option>
        </select>
        <input
          type="text"
          placeholder="İsimle Filtrele"
          value={filterBy}
          onChange={(e) => setFilterBy(e.target.value)}
        />
      </div>
      <div className="consultations-list">
        {consultations.length === 0 ? (
          <p>Henüz görüşme kaydınız bulunmamaktadır.</p>
        ) : (
          consultations.map((consultation) => (
            <div key={consultation.id} className="consultation-item">
              <p>Danışan: {consultation.patientName}</p>
              <p>Tarih: {consultation.date.toLocaleDateString()}</p>
              <p>Açıklama: {consultation.notes}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Consultations;
