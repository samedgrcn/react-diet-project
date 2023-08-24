import React, { useState } from "react";
import "./AddAppointment.css"; // CSS dosyanızı eklemeyi unutmayın

const AddAppointment = ({ onClose, onAppointmentAdded, selectedDay }) => {

  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");

  function generateUniqueId() {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const length = 10; // Dizedeki karakter sayısı
    let id = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      id += chars[randomIndex];
    }
    return id;
  }
  

  const handleSaveAppointment = () => {
    if (title.trim() === "") {
      alert("Randevu başlığı boş olamaz.");
      return;
    }

    if (!selectedDay) {
      alert("Lütfen bir gün seçin.");
      return;
    }

    const newAppointment = {
      id: generateUniqueId(),
      start: selectedDay,
      end: selectedDay,
      title: title,
      name: name,
      notes: notes,
    };
    
    onAppointmentAdded(newAppointment);
    setName("")
    setTitle("");
    setNotes("");
  };


  return (
    <div className="add-appointment-container">
      <h2>Yeni Randevu Ekle</h2>
      <div className="input-container">
        <label>Başlık:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className="input-container">
        <label>Danışan Adı Soyadı:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="input-container">
        <label>Açıklama:</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>
      <div className="button-container">
        <button className="button-save" onClick={handleSaveAppointment}>Kaydet</button>
        <button className="button-close" onClick={onClose}>Kapat</button>
      </div>
    </div>
  );
};

export default AddAppointment;
