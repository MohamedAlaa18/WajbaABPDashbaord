import { Injectable } from '@angular/core';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Injectable({
  providedIn: 'root',
})
export class ExportService {
  constructor() { }

  /**
   * Exports table data to a CSV file.
   * @param tableData - Array of data objects to export.
   * @param columns - Column fields and their display names in the format { field: string, header: string }[].
   * @param fileName - Name of the output file.
   */
  exportTableToCsv(tableData: any[], columns: { field: string; header: string }[], fileName: string): void {
    const headerRow = columns.map(col => col.header).join(','); // Header row with column names
    const dataRows = tableData.map(item =>
      columns
        .map(col => {
          const value = item[col.field];
          if (Array.isArray(value)) {
            return value
              .map(element =>
                typeof element === 'object' && element !== null
                  ? element.name ?? Object.values(element).join(' ')
                  : element
              )
              .join(', ');
          }
          return this.escapeCsvValue(value);
        })
        .join(',')
    );

    const csvContent = [headerRow, ...dataRows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `${fileName}.csv`);
  }

  /**
   * Escapes special characters in a CSV value.
   * @param value - The value to escape.
   * @returns Escaped value as a string.
   */
  private escapeCsvValue(value: any): string {
    if (value === null || value === undefined) {
      return '';
    }
    const stringValue = String(value);
    if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
      return `"${stringValue.replace(/"/g, '""')}"`; // Escape double quotes
    }
    return stringValue;
  }

  /**
   * Exports table data to a PDF file (same as before).
   */
  exportTableToPdf(tableData: any[], columns: { field: string; header: string }[], fileName: string): void {
    const doc = new jsPDF();
    const headers = [columns.map(col => col.header)];
    const body = tableData.map(item =>
      columns.map(col => {
        const value = item[col.field];
        if (Array.isArray(value)) {
          return value
            .map(element =>
              typeof element === 'object' && element !== null
                ? element.name ?? Object.values(element).join(' ')
                : element
            )
            .join(', ');
        }
        return value;
      })
    );

    autoTable(doc, {
      head: headers,
      body: body,
      startY: 10,
      theme: 'grid',
    });

    doc.save(`${fileName}.pdf`);
  }
}
