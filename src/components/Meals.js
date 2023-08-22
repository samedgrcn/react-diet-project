// Meals.js
import React, { useState, useEffect } from "react";
import firebase, { firestore, storage } from "../db/firebase";
import "./Meals.css";

const Meals = ({ currentUser }) => {
  const [meals, setMeals] = useState([]);
  const [mealName, setMealName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedMeal, setSelectedMeal] = useState(null); // Seçilen yemek listesini tutmak için state

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const docRef = firestore.collection("doctors").doc(currentUser.uid);
        const doc = await docRef.get();
       
        if (doc.exists) {
          const fetchedMeals = doc.data().meals || [];
          setMeals(fetchedMeals);
        }
      } catch (error) {
        console.error("Error fetching meals:", error);
      }
    };

    fetchMeals();
  }, [currentUser]);

  const handleAddMeal = async () => {
    try {
      const meal = { name: mealName, pdfUrl: "" };
      const docRef = firestore.collection("doctors").doc(currentUser.uid);

      await docRef.update({
        meals: firebase.firestore.FieldValue.arrayUnion(meal)
      });

      if (selectedFile) {
        const storageRef = storage.ref(`doctors/meals/${meal.id}`);
        await storageRef.put(selectedFile);
        const pdfUrl = await storageRef.getDownloadURL();

        await docRef.update({
          meals: firebase.firestore.FieldValue.arrayRemove(meal)
        });

        meal.pdfUrl = pdfUrl;

        await docRef.update({
          meals: firebase.firestore.FieldValue.arrayUnion(meal)
        });
      }

      setMealName("");
      setSelectedFile(null);
    } catch (error) {
      console.error("Error adding meal:", error);
    }
  };

  const handleUpdateMeal = async () => {
    try {
      const meal = { name: mealName, pdfUrl: selectedMeal.pdfUrl };
      await firestore.collection("meals").doc(selectedMeal.id).update(meal);

      if (selectedFile) {
        const storageRef = storage.ref(`meals/${selectedMeal.id}`);
        await storageRef.put(selectedFile);
        const pdfUrl = await storageRef.getDownloadURL();
        await firestore.collection("meals").doc(selectedMeal.id).update({ pdfUrl });
      }

      setSelectedMeal("");
      setMealName("");
      setSelectedFile("");
    } catch (error) {
      console.error("Error updating meal:", error);
    }
  };

  const handleDeleteMeal = async (mealId) => {
    try {
      await firestore.collection("doctors/meals").doc(mealId).delete();

      const storageRef = storage.ref(`doctors/meals/${mealId}`);
      await storageRef.delete();

      setMeals((prevMeals) => prevMeals.filter((meal) => meal.id !== mealId));
    } catch (error) {
      console.error("Error deleting meal:", error);
    }
  };

  const handleSelectMeal = (meal) => {
    setSelectedMeal(meal);
    setMealName(meal.name);
    setSelectedFile();
  };

  const handleDownloadPDF = async (meal) => {
    try {
      const response = await fetch(meal.pdfUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${meal.name}.pdf`;
      a.click();
    } catch (error) {
      console.error("Error downloading PDF:", error);
    }
  };

  return (
    <div className="meals-container">
      <h1>Yemek Listeleri</h1>
      <div className="meals-form">
        {selectedMeal ? (
          <div className="edit-form">
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setSelectedFile(e.target.files[0])}
              className={selectedFile ? "selected" : ""}
            />

            <span className="select-list">Seçili Liste: {selectedMeal.name}</span>
            <button onClick={handleUpdateMeal}>Güncelle</button>
            <button onClick={() => setSelectedMeal(null)}>İptal</button>
          </div>
        ) : (
          <div className="add-form">
            <input
              type="text"
              value={mealName}
              onChange={(e) => setMealName(e.target.value)}
              placeholder="Yemek Listesi Adı"
            />
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setSelectedFile(e.target.files[0])}
              className={selectedFile ? "selected" : ""}
            />
            <button onClick={handleAddMeal}>Ekle</button>
          </div>
        )}
      </div>
      <ul className="meals-list">
        {meals.map((meal) => (
          <li
            key={meal.id}
            className={`meals-list-item ${selectedMeal?.id === meal.id ? "selected" : ""}`}
            onClick={() => handleSelectMeal(meal)}
          >
            <span>{meal.name}</span>
            <div>
              <button onClick={() => handleDownloadPDF(meal)}>İndir</button>
              <button onClick={() => handleDeleteMeal(meal.id)}>Sil</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Meals;
