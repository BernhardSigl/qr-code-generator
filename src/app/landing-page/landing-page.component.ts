import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

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
  // ${this.inputFieldText}
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
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = (event: Event) => {
      canvas.width = img.width;
      canvas.height = img.height;
      context?.drawImage(img, 0, 0);
      const url = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = url;
      a.download = `qr_code_${this.inputFieldText}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    };
    img.src = this.qrCodeImg.nativeElement.src;
    if (this.qrCodeImg.nativeElement.complete) {
      img.onload(new Event('load'));
    }
  }
  
  async clear() {
    const input = this.qrCodeInputField.nativeElement;
    input.value = 'Example';
    await this.generate();
    input.value = '';
    this.inputFieldText = '';
  }
}
