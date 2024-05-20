import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
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

      reader.readAsText(file);
    }
  }

  parseCsv(csv: string): string {
    const lines = csv.split('\n');
    const result = lines
      .map((line) => {
        const [pfandnummer, description, darlehen] = line.split(';');
        if (pfandnummer && description && darlehen) {
          return `${pfandnummer}\t${description}\t${parseFloat(
            darlehen
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
      const blob = new Blob([this.parsedData], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'output.txt';
      a.click();
      window.URL.revokeObjectURL(url);
    }
  }
}
