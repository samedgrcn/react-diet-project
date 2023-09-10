import React from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";



const generatePDF = (patient) => {
  const doc = new jsPDF();
    
  // Tabloyu oluşturmak için kullanacağınız verileri hazırlayın
  const tableData = [
    ["Hasta Adi", patient.name],
    ["TC Numarasi", patient.tcNumber],
    ["Telefon Numarasi", patient.phoneNumber],
    ["Email", patient.email],
    ["Dogum Gunu", patient.birthDate],
    ["Boyu", patient.height],
    ["Kilosu", patient.weight],
    ["Vucut Yag Orani", patient.bodyFatPercentage],
    ["Vucut Kitle Endeksi", patient.bmi],
    ["Cinsiyeti", patient.gender],
    ["Hedef Kilosu", patient.targetWeight],
  ];
// Tablo stilleri
const styles = {
  fontSize: 12, // Tablo için yazı boyutunu ayarlayın
  tableWidth: "auto", // Tablo genişliğini otomatik olarak ayarlayın
  cellPadding: 5, // Hücre içi boşluğu ayarlayın
  startY: 20, // Tablonun başlangıç yüksekliğini ayarlayın
};

doc.autoTable({
  head: tableData.slice(0, 1),
  body: tableData.slice(1),
  theme: "grid",
  styles,
});

  // PDF dosyasını indirme
  doc.save(`${patient.name}_detay.pdf`);
};

const PDFButton = ({ patient }) => {
    const handleDownloadPDF = async (event) => {
      event.stopPropagation();
      generatePDF(patient);
      };

  return (
    <div>
      <button onClick={handleDownloadPDF}>PDF olarak indir</button>
    </div>
  );
};

export default PDFButton;
