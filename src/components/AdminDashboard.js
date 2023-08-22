import React, { useState, useEffect } from "react";
import "./AdminDashboard.css";
import firebase from "../db/firebase";

const AdminDashboard = ({ currentUser }) => {
  const [newDoctorEmail, setNewDoctorEmail] = useState("");
  const [newDoctorPassword, setNewDoctorPassword] = useState("");
  const [newDoctorName, setNewDoctorName] = useState("");
  const [newDoctorAge, setNewDoctorAge] = useState("");
  const [newDoctorGender, setNewDoctorGender] = useState("Erkek");
  const [newDoctorSchool, setNewDoctorSchool] = useState("");
  const [doctorsList, setDoctorsList] = useState([]);
  const [totalDoctors, setTotalDoctors] = useState(0);
  const [totalPatients, setTotalPatients] = useState(0);
  const [message, setMessage] = useState("");
  const [universities, setUniversities] = useState([]);
  const [showAddDoctorModal, setShowAddDoctorModal] = useState(false);

  useEffect(() => {
    // Firestore'dan doktorların listesini ve toplam sayıları al
    const fetchDoctors = async () => {
      try {
        const doctorsRef = firebase.firestore().collection("doctors");
        const snapshot = await doctorsRef.get();

        const doctorsData = snapshot.docs.map((doc) => doc.data());
        setDoctorsList(doctorsData);

        setTotalDoctors(doctorsData.length);

        let totalPatientsCount = 0;
        doctorsData.forEach((doctor) => {
          totalPatientsCount += doctor.patients.length;
        });
        setTotalPatients(totalPatientsCount);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };

    fetchDoctors();
  }, []);

  const handleAddDoctor = async () => {
    try {
      // Firebase Auth ile yeni doktor eklemek için kullanıcı oluştur
      const userCredential = await firebase.auth().createUserWithEmailAndPassword(newDoctorEmail, newDoctorPassword);
      const newDoctorUid = userCredential.user.uid;

      // Firestore'da yeni doktoru eklemek için veri oluştur
      const doctorData = {
        uid: newDoctorUid,
        eposta: newDoctorEmail,
        password: newDoctorPassword,
        name: newDoctorName,
        age: newDoctorAge,
        gender: newDoctorGender,
        school: newDoctorSchool,
        patients: [], // Doktorun hastaları için boş bir dizi
        meals: [], // Doktorun yemek listeleri için boş bir dizi
        appointments: [], // Doktorun randevuları için boş bir dizi
      };
      handleAddUniversity();
      // Firestore'da 'doctors' koleksiyonuna yeni doktoru ekle
      const doctorsRef = firebase.firestore().collection("doctors");
      await doctorsRef.doc(newDoctorUid).set(doctorData);

      setMessage("Yeni doktor başarıyla eklendi.");
      setShowAddDoctorModal(false);
    } catch (error) {
      console.error("Error adding doctor:", error);
      setMessage("Doktor eklenirken bir hata oluştu.");
    }
  };

  const handleAddUniversity = () => {
    if (newDoctorSchool.trim() === "") {
      setMessage("Üniversite adı boş bırakılamaz.");
    } else {
      setUniversities([...universities, newDoctorSchool.trim()]);
      setNewDoctorSchool("");
      setMessage("Üniversite başarıyla eklendi.");
    }
  };

  return (
    <div className="admin-dashboard-container">
      <div>
        <h2>Toplam Çalışan Doktor Sayısı: {totalDoctors}</h2>
        <h2>Toplam Hasta Sayısı: {totalPatients}</h2>
        <h2>Toplam Doktorların Bulunduğu Liste Sayısı: {doctorsList.length}</h2>
      </div>
      
      <button onClick={() => setShowAddDoctorModal(true)}>Yeni Doktor Ekle</button>
      {showAddDoctorModal && (
        <div className="modal-container active">
          <div className="doctor-container">
            <span className="form-close" onClick={() => setShowAddDoctorModal(false)}>
              &times;
            </span>
            <div className="add-doctor">
              <label>E-posta:</label>
              <input  type="email" value={newDoctorEmail} onChange={(e) => setNewDoctorEmail(e.target.value)} />
            </div>
            <div className="add-doctor">
              <label>Şifre:</label>
              <input type="password" value={newDoctorPassword} onChange={(e) => setNewDoctorPassword(e.target.value)} />
            </div>
            <div className="add-doctor">
              <label>İsim:</label>
              <input type="text" value={newDoctorName} onChange={(e) => setNewDoctorName(e.target.value)} />
            </div>
            <div className="add-doctor">
              <label>Yaş:</label>
              <input type="number" value={newDoctorAge} onChange={(e) => setNewDoctorAge(e.target.value)} />
            </div>
            <div className="add-doctor">
              <label>Cinsiyet:</label>
              <select value={newDoctorGender} onChange={(e) => setNewDoctorGender(e.target.value)}>
                <option value="Erkek">Erkek</option>
                <option value="Kadın">Kadın</option>
              </select>
            </div>
            <div className="add-doctor">
              <label>Mezun Olduğu Okul:</label>
              <input type="text" value={newDoctorSchool} onChange={(e) => setNewDoctorSchool(e.target.value)} placeholder="Üniversite adı giriniz" />
            </div>
            <div className="form-buttons">
              <button onClick={handleAddDoctor}>Doktor Ekle</button>
            </div>
          </div>
        </div>
      )}
      {message && <div className="message">{message}</div>}
    </div>
  );
};

export default AdminDashboard;
