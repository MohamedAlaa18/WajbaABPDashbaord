import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Base64Service {

  constructor() { }

  // Helper method to convert a File to Base64
  convertToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        const base64Content = base64String.split(',')[1]; // Remove the 'data:image/...;' part
        resolve(base64Content); // Resolve with the base64 string without the MIME type
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file); // Read file as Data URL
    });
  }
}
