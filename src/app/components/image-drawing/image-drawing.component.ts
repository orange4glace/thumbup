import { Component, Input, ChangeDetectionStrategy, ViewChild, ElementRef, AfterViewInit, OnInit, OnDestroy } from '@angular/core';
import { ImageDrawing } from 'src/app/model/image-drawing';
import { Subscription } from 'rxjs';
import { throttleTime } from 'rxjs/operators';

@Component({
  selector: 'image-drawing',
  templateUrl: './image-drawing.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImageDrawingComponent implements AfterViewInit, OnDestroy {

  @ViewChild('canvas') canvasRef_: ElementRef<HTMLCanvasElement>;
  private cvs_: HTMLCanvasElement;
  private ctx_: CanvasRenderingContext2D;

  @Input() drawing: ImageDrawing;

  private subs_: Subscription[] = [];

  constructor() {
  }

  ngAfterViewInit() {
    this.cvs_ = this.canvasRef_.nativeElement;
    this.ctx_ = this.canvasRef_.nativeElement.getContext('2d');
    this.subs_.push(this.drawing.onDidDirty.pipe(
      throttleTime(16, undefined, {trailing: true})).subscribe(() => {
      this.render();
    }))
    this.render();
  }

  ngOnDestroy() {
    this.subs_.forEach(sub => sub.unsubscribe());
  }

  private render() {
    const movable = this.drawing.movable;
    this.cvs_.width = movable.w;
    this.cvs_.height = movable.h;
    this.ctx_.drawImage(this.drawing.img,
        0, 0, this.drawing.img.width, this.drawing.img.height,
        0, 0, movable.w, movable.h);
  }

}