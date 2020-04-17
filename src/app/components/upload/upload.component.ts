import { Component } from '@angular/core';
import { CanvasService } from 'src/app/service/canvas.service';
import { ImageDrawing } from 'src/app/model/image-drawing';

@Component({
  selector: 'upload',
  template: `
    <input type="file" (change)="onChange($event)">
  `
})
export class UploadComponent {

  constructor(
    private readonly canvasService_: CanvasService) {

  }

  public onChange(e: any) {
    const file: File = e.target.files[0];
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      const image = new Image();
      image.src = reader.result as string;
      image.onload = () => {
        const imageDrawing = new ImageDrawing(image);
        this.canvasService_.canvas.addDrawing(imageDrawing);
      }
    })
    reader.readAsDataURL(file);
  }

}