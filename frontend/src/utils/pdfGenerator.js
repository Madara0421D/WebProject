// frontend/src/utils/pdfGenerator.js

import jsPDF from 'jspdf';

export const generatePDF = (data, title) => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text(title, 10, 10);

    let yPosition = 20;
    data.forEach(item => {
        doc.text(JSON.stringify(item), 10, yPosition);
        yPosition += 10;
    });

    doc.save(`${title}.pdf`);
};
