import { Component } from '@angular/core';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  parsedData: string | null = null;

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        const csvData = reader.result as string;
        this.parsedData = this.parseCsv(csvData);
      };

      reader.readAsText(file, 'ISO-8859-1');
    }
  }

  parseCsv(csv: string): string {
    const lines = csv.split('\n');
    const result = lines
      .map((line) => {
        const [pfandnummer, description, darlehen] = line.split(';');
        if (pfandnummer && description && darlehen) {
          return `${pfandnummer}\t${description}\t${parseFloat(
            darlehen.trim()
          ).toFixed(6)}`;
        }
        return null;
      })
      .filter((line) => line !== null)
      .join('\n');

    return result;
  }

  downloadTxtFile(): void {
    if (this.parsedData) {
      const windows1252EncodedData = this.encodeToWindows1252(this.parsedData);
      const blob = new Blob([windows1252EncodedData], {
        type: 'text/plain;charset=windows-1252',
      });
      saveAs(blob, 'output_ansi.txt');
    }
  }

  encodeToWindows1252(input: string): Uint8Array {
    const byteArray = new Uint8Array(input.length);
    for (let i = 0; i < input.length; i++) {
      const charCode = input.charCodeAt(i);
      byteArray[i] = charCode < 256 ? charCode : 63;
    }
    return byteArray;
  }
}
