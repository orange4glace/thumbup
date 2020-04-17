import { Component, Input, ChangeDetectionStrategy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ImageFig } from 'src/app/model/image-fig';

@Component({
  selector: 'image-fig',
  templateUrl: './image-fig.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImageFigComponent implements AfterViewInit {

  @ViewChild('canvas') canvasRef_: ElementRef<HTMLCanvasElement>;
  private cvs_: HTMLCanvasElement;
  private ctx_: CanvasRenderingContext2D;

  @Input() imageFig: ImageFig;

  constructor() {

  }

  ngAfterViewInit() {
    this.cvs_ = this.canvasRef_.nativeElement;
    this.ctx_ = this.canvasRef_.nativeElement.getContext('2d');
    this.render();
  }

  private render() {
    const movable = this.imageFig.movable;
    this.cvs_.width = movable.w;
    this.cvs_.height = movable.h;
    this.ctx_.drawImage(this.imageFig.img,
        0, 0, this.imageFig.img.width, this.imageFig.img.height,
        0, 0, movable.w, movable.h);
  }

}