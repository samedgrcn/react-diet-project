// Appointments.js
import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "moment/locale/tr";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./Appointments.css";
import { firestore } from "../db/firebase";
import AddAppointment from "./AddAppointment";

const Appointments = ({currentUser}) => {
  moment.locale("tr");
  const localizer = momentLocalizer(moment);

  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [updatedEvent, setUpdatedEvent] = useState({
    title: "",
    name: "",
    notes: "",
  });
  const [selectedDay, setSelectedDay] = useState(null); // Yeni state
  

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const doctorRef = firestore.collection("doctors").doc(currentUser.uid);
        const doctorSnapshot = await doctorRef.get();
        const doctorData = doctorSnapshot.data();
  
        const fetchedAppointments = doctorData.appointments.map((event) => ({
          id: event.id,
          start: event.start.toDate(),
          end: event.end.toDate(),
          title: event.title,
          name: event.name,
          notes: event.notes,
        }));
  
        setEvents(fetchedAppointments);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };
  
    fetchAppointments();
  }, [currentUser, events]);
  
  

  const handleAddAppointment = async (newAppointment) => {
    try {
      const doctorRef = firestore.collection("doctors").doc(currentUser.uid);
      const doctorSnapshot = await doctorRef.get();
      const doctorData = doctorSnapshot.data();
  
      const updatedAppointments = [...doctorData.appointments, newAppointment];
      await doctorRef.update({ appointments: updatedAppointments });
  
      // Güncellenmiş randevuları tekrar Firestore'dan alın ve ayarlayın
      const updatedDoctorSnapshot = await doctorRef.get();
      const updatedDoctorData = updatedDoctorSnapshot.data();
      const updatedAppointmentsFromFirestore = updatedDoctorData.appointments;
      setEvents(updatedAppointmentsFromFirestore);
  
      setShowAddModal(false);
    } catch (error) {
      console.error("Error adding appointment:", error);
    }
  };
  
  
  const handleUpdateAppointment = async () => {
    try {
      if (!selectedEvent) {
        throw new Error("Güncellenecek etkinlik seçili değil.");
      }
  
      // Firestore doküman referansını alın
      const doctorRef = firestore.collection("doctors").doc(currentUser.uid);
  
      // Firestore dokümanını alın
      const doctorSnapshot = await doctorRef.get();
      const doctorData = doctorSnapshot.data();
  
      // Seçili etkinlik
      const selectedAppointmentIndex = doctorData.appointments.findIndex(
        (event) => event.id === selectedEvent.id
      );
  
      if (selectedAppointmentIndex === -1) {
        throw new Error("Seçili etkinlik bulunamadı.");
      }
  
      const updatedAppointments = [...doctorData.appointments];
      updatedAppointments[selectedAppointmentIndex] = {
        ...updatedAppointments[selectedAppointmentIndex],
        title: updatedEvent.title,
        name: updatedEvent.name,
        notes: updatedEvent.notes,
      };
  
      // Firestore'da randevuları güncelleyin
      await doctorRef.update({ appointments: updatedAppointments });
  
      // State'deki randevu listesini güncelleyin
      setEvents(updatedAppointments);
      setShowAddModal(false);
  
      // Seçili randevunun detaylarını güncelleyin
      setSelectedEvent({
        ...selectedEvent,
        title: updatedEvent.title,
        name: updatedEvent.name,
        notes: updatedEvent.notes,
      });
  
      // Güncelleme işlemi tamamlandığında updatedEvent'i sıfırlayın
      setUpdatedEvent({
        title: "",
        name: "",
        notes: "",
      });
    } catch (error) {
      console.error("Randevu güncelleme hatası:", error);
    }
  };
  
  
const handleDeleteAppointment = async (appointmentId) => {
  try {
    const doctorRef = firestore.collection("doctors").doc(currentUser.uid);

    // Firestore dokümanını alın
    const doctorSnapshot = await doctorRef.get();
    const doctorData = doctorSnapshot.data();

    // Sadece seçili eventi bulup sil
    const updatedAppointments = doctorData.appointments.filter(
      (event) => event.id !== appointmentId
    );

    await doctorRef.update({ appointments: updatedAppointments });

    // Seçili eventi state'den ve takvimden sil
    setEvents((prevEvents) =>
      prevEvents.map((event) =>
        event.id === appointmentId ? null : event
      )
    );
    setSelectedEvent(null); // Eğer silinen event seçiliyse, seçili eventi temizle
  } catch (error) {
    console.error("Error deleting appointment:", error);
  }
};

  return (
    <div className="appointments-container">
      
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        views={["month", "week", "day"]}
        selectable
        onSelectSlot={(slotInfo) => {
          setSelectedEvent({
            start: slotInfo.start,
            end: slotInfo.end,
            title: "",
            name: "",
            notes: "",
          });
          setSelectedDay(slotInfo.start); // Seçilen günün tarihini sakla
          setShowAddModal(true);
        }}
        onSelectEvent={(event) => setSelectedEvent(event)}
      />
      {showAddModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowAddModal(false)}>
              &times;
            </span>
            <AddAppointment
              onClose={() => setShowAddModal(false)}
              onAppointmentAdded={handleAddAppointment}
              onAppointmentUpdated={handleUpdateAppointment}
              selectedEvent={selectedEvent}
              selectedDay={selectedDay} // Seçilen günün tarihini iletiyoruz
            />
          </div>
        </div>
      )}
      {selectedEvent && (
        <div className="appointment-details">
          <span className="close-details" onClick={() => setSelectedEvent(null)}>
            &times;
          </span>
          <h2>Randevu Detayları</h2>
          <p>Başlık: {updatedEvent ? updatedEvent.title : selectedEvent.title}</p>
          <p>Danışan Adı Soyadı: {updatedEvent ? updatedEvent.name : selectedEvent.name}</p>
          <p>Açıklama: {updatedEvent ? updatedEvent.notes : selectedEvent.notes}</p>
          <button className="button-delete" onClick={() => handleDeleteAppointment(selectedEvent.id)}>Sil</button>
          {updatedEvent ? (
            <>
              <div className="update-form">
                <input
                  type="text"
                  placeholder="Başlık"
                  value={updatedEvent.title}
                  onChange={(e) =>
                    setUpdatedEvent({ ...updatedEvent, title: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="Adı Soyadı"
                  value={updatedEvent.name}
                  onChange={(e) =>
                    setUpdatedEvent({ ...updatedEvent, name: e.target.value })
                  }
                />
                <textarea
                  placeholder="Açıklama"
                  value={updatedEvent.notes}
                  onChange={(e) =>
                    setUpdatedEvent({ ...updatedEvent, notes: e.target.value })
                  }
                />
              </div>
              <button className="button-update" onClick={handleUpdateAppointment}>Güncelle</button>
              <button className="button-cancel" onClick={() => setUpdatedEvent(null)}>İptal</button>
            </>
          ) : (
            <button className="button-update" onClick={() => setUpdatedEvent(selectedEvent)}>Güncelle</button>
          )}
        </div>
      )}
    </div>
  );
};

export default Appointments;
