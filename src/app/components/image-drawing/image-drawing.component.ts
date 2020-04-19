import { Component, Input, ChangeDetectionStrategy, ViewChild, ElementRef, AfterViewInit, OnInit, OnDestroy, ComponentRef } from '@angular/core';
import { ImageDrawing } from 'src/app/model/image-drawing';
import { Subscription } from 'rxjs';
import { throttleTime } from 'rxjs/operators';
import { IDrawingComponent } from 'src/app/components/drawing/drawing.component';
import { MovableComponent } from 'src/app/components/movable/movable.component';
import { ImageFilter } from 'src/app/util/image-filter';

@Component({
  selector: 'image-drawing',
  templateUrl: './image-drawing.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImageDrawingComponent implements IDrawingComponent, AfterViewInit, OnDestroy {

  @ViewChild('canvas') canvasRef_: ElementRef<HTMLCanvasElement>;
  @ViewChild('movable') movableComponent: MovableComponent;
  private cvs_: HTMLCanvasElement;
  private ctx_: CanvasRenderingContext2D;

  @Input() drawing: ImageDrawing;

  private subs_: Subscription[] = [];

  constructor() {
  }

  ngAfterViewInit() {
    this.cvs_ = this.canvasRef_.nativeElement;
    this.ctx_ = this.canvasRef_.nativeElement.getContext('2d');
    this.subs_.push(this.movableComponent.onDidUpdate.subscribe(() => {
      this.localRender();
    }));
    this.subs_.push(this.drawing.onDidDirty.pipe(
      throttleTime(16, undefined, {trailing: true})
    ).subscribe(() => { this.localRender() }));
    this.localRender();
  }

  ngOnDestroy() {
    this.subs_.forEach(sub => sub.unsubscribe());
  }

  private localRender() {
    const movable = this.drawing.movable;
    this.cvs_.width = Math.abs(movable.w);
    this.cvs_.height = Math.abs(movable.h);
    this.render(this.ctx_);
  }

  public render(ctx: CanvasRenderingContext2D) {
    const movable = this.drawing.movable;
    ctx.drawImage(this.drawing.img,
        0, 0, this.drawing.img.width, this.drawing.img.height,
        0, 0, Math.abs(movable.w), Math.abs(movable.h));
    const filter = this.drawing.filter;
    filter && filter.apply(ctx);
  }

}