import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { log } from 'console';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatInputModule, MatFormFieldModule],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss',
})
export class LandingPageComponent {
  @ViewChild('qrCodeInputField') qrCodeInputField!: ElementRef;
  @ViewChild('generateBtn') generateBtn!: ElementRef;
  @ViewChild('clearBtn') clearBtn!: ElementRef;
  @ViewChild('qrCodeImg') qrCodeImg!: ElementRef;
  @ViewChild('overallBox') overallBox!: ElementRef;

  inputFieldText: string = '';

  generate(): Promise<void> {
    return new Promise<void>((resolve) => {
    const input = this.qrCodeInputField.nativeElement;
    const img = this.qrCodeImg.nativeElement;

    this.inputFieldText = input.value;

    if (this.inputFieldText === '') {
      console.log('Field is empty');
    } else {
      const code_url = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${this.inputFieldText}`;
      img.src = code_url;
      resolve();
    }
  });
  }

  async downloadQR() {
    await this.generate();
    const tempImg = new Image();
    tempImg.crossOrigin = 'Anonymous';
    tempImg.src = this.qrCodeImg.nativeElement.src;

    tempImg.onload = () => {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      if (context) {
        canvas.width = tempImg.width;
        canvas.height = tempImg.height;

        context.drawImage(tempImg, 0, 0, tempImg.width, tempImg.height);

        const imageData = context.getImageData(
          0,
          0,
          canvas.width,
          canvas.height
        );
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
          const red = data[i];
          const green = data[i + 1];
          const blue = data[i + 2];
          if (red === 255 && green === 255 && blue === 255) {
            data[i + 3] = 0;
          }
        }

        context.putImageData(imageData, 0, 0);
        const link = document.createElement('a');
        link.download = `qr_code_${this.inputFieldText}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      }
    };
  }

  async clear() {
    const input = this.qrCodeInputField.nativeElement;
    input.value = 'Example';
    await this.generate();
    input.value = '';
    this.inputFieldText = '';
  }
}
