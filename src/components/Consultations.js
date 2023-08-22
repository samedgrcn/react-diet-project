import React, { useState, useEffect } from "react";
import "./Consultations.css";
import firebase from "../db/firebase";

const Consultations = ({ currentUser }) => {
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("name"); // Default sıralama: İsme göre
  const [filterBy, setFilterBy] = useState(""); // Filtreleme

  useEffect(() => {
    const fetchConsultations = async () => {
      try {
        const snapshot = await firebase.firestore().collection("doctors").doc(currentUser.id).collection("appointments").get();

        const consultationsData = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            patientName: data.name, // Randevu sayfasındaki "name" alanı
            date: data.start.toDate(), // Firebase'den alınan tarihi uygun formata çevirme
            notes: data.notes,
          };
        });

        // İsme göre sıralama
        if (sortBy === "name") {
          consultationsData.sort((a, b) =>
            a.patientName.localeCompare(b.patientName)
          );
        }
        // Tarihe göre sıralama
        else if (sortBy === "date") {
          consultationsData.sort((a, b) => a.date - b.date);
        }

        // Filtreleme
        const filteredConsultations = consultationsData.filter((consultation) =>
          consultation.patientName.toLowerCase().includes(filterBy.toLowerCase())
        );

        setConsultations(filteredConsultations);
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
