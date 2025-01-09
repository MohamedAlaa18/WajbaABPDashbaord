import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class ExportService {

  constructor() { }

  // Export table data to XLS
  exportTableToXls(tableData: any[], columns: string[], fileName: string): void {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Data');

    // Add header row
    worksheet.addRow(columns);

    // Add transformed data rows
    tableData.forEach(item => {
      const rowData = columns.map(key => {
        const value = item[key];
        if (Array.isArray(value)) {
          return value.map(element =>
            typeof element === 'object' && element !== null ? (element.name ?? Object.values(element).join(' ')) : element
          ).join(', ');
        } else {
          return value;
        }
      });
      worksheet.addRow(rowData);
    });

    // Style headers
    worksheet.getRow(1).eachCell(cell => {
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4F81BD' } };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
    });

    // Style data cells with borders
    worksheet.eachRow((row, rowIndex) => {
      row.eachCell(cell => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      });
    });

    // Write to buffer and save as file
    workbook.xlsx.writeBuffer().then(buffer => {
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, `${fileName}.xlsx`);
    });
  }

  // Export table data to PDF
  exportTableToPdf(tableData: any[], headers: string[], fileName: string): void {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [headers],
      body: tableData.map(item => headers.map(header => item[header])),
      startY: 10,
      theme: 'grid',
    });

    // Create a Blob from the PDF
    const pdfOutput = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfOutput);

    // Open the PDF in a new window and trigger print
    const newWindow = window.open(pdfUrl);
    if (newWindow) {
      newWindow.onload = () => {
        newWindow.print();
        // Optional: Close the window after printing
        newWindow.onafterprint = () => newWindow.close();
      };
    }
  }
}
