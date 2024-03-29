import React, { useState, useEffect } from "react";
import "./Accounting.css";
import firebase from "../db/firebase";


const Accounting = ({ currentUser }) => {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [receiptPdf, setReceiptPdf] = useState(null);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const snapshot = await firebase.firestore().collection("doctors").doc(currentUser.id).get();
        const doctorData = snapshot.data();

        if (doctorData && doctorData.patients) {
          setPatients(doctorData.patients);
        }
      } catch (error) {
        console.error("Hastalar alınırken hata oluştu:", error);
      }
    };

    fetchPatients();
  }, [currentUser]);

  const handleSaveReceipt = async () => {
    if (!selectedPatient || !receiptPdf) {
      alert("Lütfen hasta ve dekont seçiniz.");
      return;
    }

    try {
      const storageRef = firebase.storage().ref();
      const fileRef = storageRef.child(`receipts/${receiptPdf.name}`);
      await fileRef.put(receiptPdf);

      const updatedPatients = await Promise.all(
        patients.map(async (patient) => {
          if (patient.id === selectedPatient.id) {
            const receiptUrl = await fileRef.getDownloadURL();
            return { ...patient, receiptUrl };
          }
          return patient;
        })
      );

      await firebase.firestore().collection("doctors").doc(currentUser.id).update({
        patients: updatedPatients,
      });

      alert("Dekont başarıyla kaydedildi.");
    } catch (error) {
      console.error("Dekont kaydedilirken hata oluştu:", error);
    }
  };

  return (
    <div className="accounting-container">
      <h1 className="accounting-title">Muhasebe Bölümü</h1>
      <div className="accounting-form">
        <select onChange={(e) => setSelectedPatient(patients.find((p) => p.id === e.target.value))}>
          <option value="" disabled selected>
            Hasta Seçiniz
          </option>
          {patients.map((patient) => (
            <option key={patient.id} value={patient.id}>
              {patient.name}
            </option>
          ))}
        </select>
        {selectedPatient && (
          <>
            <h3>Dekont Yükle</h3>
            <input type="file" accept=".pdf" onChange={(e) => setReceiptPdf(e.target.files[0])} />
            <button onClick={handleSaveReceipt}>Kaydet</button>
          </>
        )}
      </div>
    </div>
  );
};

export default Accounting;
