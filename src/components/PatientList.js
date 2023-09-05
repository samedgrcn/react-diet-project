import React, { useState, useEffect } from "react";
import { firestore } from "../db/firebase";
//import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import PatientFormPopup from "./PatientFormPopup";
import "./PatientList.css";

// const pdfStyles = StyleSheet.create({
//   page: {
//     flexDirection: "column",
//     backgroundColor: "#FFFFFF",
//     padding: 20,
//   },
  // ... diğer stiller
//});

// const generatePDF = (patient) => (
//   <Document>
//     <Page size="A4" style={pdfStyles.page}>
//       <View>
//         <Text>{`Hasta Adı: ${patient.name}`}</Text>
//         <Text>{`TC Numarası: ${patient.tcNumber}`}</Text>
//         {/* Diğer bilgileri de benzer şekilde ekleyin */}
//       </View>
//     </Page>
//   </Document>
// );

const PatientList = ({currentUser}) => {
  const [patients, setPatients] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updatedPatientData, setUpdatedPatientData] = useState({
    name: "",
    tcNumber: "",
    phoneNumber: "",
    email: "",
    birthDate: "",
    height: "",
    weight: "",
    bodyFatPercentage: "",
    bmi: "",
    gender: "",
    targetWeight: "",
  });
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const docRef = firestore.collection("doctors").doc(currentUser.uid);
        const snapshot = await docRef.get();
        
        if (snapshot.exists) {
          const fetchedPatients = snapshot.data().patients || [];
          setPatients(fetchedPatients);
        } else {
          console.log("No patients found for the current user.");
        }
      } catch (error) {
        console.error("Error fetching patients:", error);
      }
    };
  
    fetchPatients();
  }, [currentUser]);
  

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.tcNumber.includes(searchQuery)
  );

  const handlePatientClick = (patient) => {
    if (selectedPatient && selectedPatient.id === patient.id) {
      setSelectedPatient(null);
      setIsUpdating(false);
    } else {
      setSelectedPatient(patient);
      setIsUpdating(true);
      setUpdatedPatientData(patient);
    }
  };

  const handleUpdatePatient = async () => {
    try {
      const doctorRef = firestore.collection("doctors").doc(currentUser.uid);
      const doctorSnapshot = await doctorRef.get();
      const doctorData = doctorSnapshot.data();
  
      if (!selectedPatient) {
        return;
      }
  
      const updatedPatients = doctorData.patients.map((patient) =>
        patient.id === selectedPatient.id ? { ...patient, ...updatedPatientData } : patient
      );
  
      await doctorRef.update({ patients: updatedPatients });
  
      setPatients(updatedPatients);
      setIsUpdating(false);
      setSelectedPatient(null);
      setUpdatedPatientData({
        name: "",
        tcNumber: "",
        phoneNumber: "",
        email: "",
        birthDate: "",
        height: "",
        weight: "",
        bodyFatPercentage: "",
        bmi: "",
        gender: "",
        targetWeight: "",
      });
    } catch (error) {
      console.error("Error updating patient:", error);
    }
  };
  
  const handleDeletePatient = async (patientId) => {
    try {
      const doctorRef = firestore.collection("doctors").doc(currentUser.uid);
      const doctorSnapshot = await doctorRef.get();
      const doctorData = doctorSnapshot.data();
  
      const updatedPatients = doctorData.patients.filter((patient) => patient.id !== patientId);
  
      await doctorRef.update({ patients: updatedPatients });
  
      setPatients(updatedPatients);
      setSelectedPatient(null);
    } catch (error) {
      console.error("Error deleting patient:", error);
    }
  };
  

  const handleAddPatient = () => {
    setSelectedPatient({});
    setIsUpdating(false);
    setShowPopup(true);
  };

  const handlePopupClose = () => {
    setSelectedPatient(null);
    setShowPopup(false);
  };

  const handleAddPatientSubmit = async (newPatientData) => {
    try {
      const docRef = firestore.collection("doctors").doc(currentUser.uid);
      const patientId = docRef.id;
  
      // Ekleme işlemi yapmadan önce mevcut hastaları al
      const doctorRef = firestore.collection("doctors").doc(currentUser.uid);
      const doctorSnapshot = await doctorRef.get();
      const doctorData = doctorSnapshot.data();
      const existingPatients = doctorData.patients || [];
  
      // Yeni hastayı ekleyerek güncellenmiş hastalar dizisini oluştur
      const updatedPatients = [...existingPatients, { id: patientId, ...newPatientData }];
      await doctorRef.update({ patients: updatedPatients });
  
      const newPatient = { id: patientId, ...newPatientData };
      setPatients((prevPatients) => [...prevPatients, newPatient]);
  
      setSelectedPatient(null);
      setShowPopup(false);
    } catch (error) {
      console.error("Error adding patient:", error);
    }
  };
  
  

  

  // const handleDownloadPDF = async (patient) => {
  //   try {
  //     const pdfBlob = generatePDF(patient);
  //     const url = URL.createObjectURL(pdfBlob);

  //     const a = document.createElement("a");
  //     a.href = url;
  //     a.download = `${patient.name}_detay.pdf`;

  //     a.click();

  //     setTimeout(() => {
  //       URL.revokeObjectURL(url);
  //     }, 1000);
  //   } catch (error) {
  //     console.error("Error generating or downloading PDF:", error);
  //   }
  // };

  

  return (
    <div className="patient-list-container">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Hasta Adı veya TC Numarası ile Ara"
          value={searchQuery}
          onChange={handleSearch}
        />
        <button onClick={handleAddPatient}>Ekle</button>
      </div>
      <div className="patient-list">
        {filteredPatients.map((patient) => (
          <div
            key={patient.id}
            className={`patient-list-item ${selectedPatient?.id === patient.id ? "selected" : ""}`}
            onClick={() => handlePatientClick(patient)}
          >
            <div className={`patient-avatar ${patient.gender === "male" ? "male" : "female"}`}>
              {patient.gender === "male" ? "Bay" : "Bayan"}
            </div>
            <div className="patient-info">
              <span className="patient-name">{patient.name}</span>
              <span className="patient-tc">{patient.tcNumber}</span>
            </div>
            {selectedPatient?.id === patient.id && (
              <div className="patient-actions">
                <button onClick={() => setIsUpdating(true)}>Düzenle</button>
                <button onClick={() => handleDeletePatient(selectedPatient.id)}>Sil</button>
                {/*<button onClick={() => handleDownloadPDF(patient)}>PDF olarak indir</button>*/}
              </div>
            )}
          </div>
        ))}
      </div>
      {selectedPatient && (
        <div className="patient-details">
          {isUpdating ? (
            <div className="update-form">
              <input
                type="text"
                value={updatedPatientData.name}
                onChange={(e) => setUpdatedPatientData({ ...updatedPatientData, name: e.target.value })}
              />
              <input
                type="text"
                value={updatedPatientData.tcNumber}
                onChange={(e) => setUpdatedPatientData({ ...updatedPatientData, tcNumber: e.target.value })}
              />
              {/* Diğer bilgileri de burada düzenlenebilir inputlar şeklinde ekleyin */}
              <button onClick={handleUpdatePatient}>Güncelle</button>
            </div>
          ) : (
            <div className="patient-info">
              <h2>{selectedPatient.name}</h2>
              <p>TC Numarası: {selectedPatient.tcNumber}</p>
              <p>Telefon: {selectedPatient.phoneNumber}</p>
              <p>Eposta: {selectedPatient.email}</p>
              <p>Doğum Günü: {selectedPatient.birthDate}</p>
              <p>Boy: {selectedPatient.height}</p>
              <p>Kilo: {selectedPatient.weight}</p>
              <p>Vücut Yağ Oranı: {selectedPatient.bodyFatPercentage}</p>
              <p>BMI: {selectedPatient.bmi}</p>
              <p>Cinsiyet: {selectedPatient.gender === "male" ? "Erkek" : "Kadın"}</p>
              <p>Hedef Kilo: {selectedPatient.targetWeight}</p>
            </div>
          )}
        </div>
      )}
      {showPopup && (
        <PatientFormPopup
          patientData={updatedPatientData}
          setPatientData={setUpdatedPatientData}
          onClose={handlePopupClose}
          onSubmit={handleAddPatientSubmit}
          onFileChange={(e) => setUpdatedPatientData({ ...updatedPatientData, file: e.target.files[0] })}
        />
      )}
    </div>
  );
};

export default PatientList;
