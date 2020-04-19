import { Component, Input, ChangeDetectionStrategy, ViewChild, ElementRef, AfterViewInit, OnInit, OnDestroy, ComponentRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { throttleTime } from 'rxjs/operators';
import { TextDrawing } from 'src/app/model/text-drawing';
import { IDrawingComponent } from 'src/app/components/drawing/drawing.component';
import { MovableComponent } from 'src/app/components/movable/movable.component';
import { ImageFilter } from 'src/app/util/image-filter';

@Component({
  selector: 'text-drawing',
  template: `
    <movable #movable [movable]="drawing.movable">
      <canvas #canvas></canvas>
    </movable>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TextDrawingComponent implements IDrawingComponent, AfterViewInit, OnDestroy {

  @ViewChild('canvas') canvasRef_: ElementRef<HTMLCanvasElement>;
  @ViewChild('movable') movableComponent: MovableComponent;
  private cvs_: HTMLCanvasElement;
  private ctx_: CanvasRenderingContext2D;

  @Input() drawing: TextDrawing;

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
    this.subs_.push(this.drawing.onDidChangeText.pipe(
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
    const drawing = this.drawing;
    const movable = this.drawing.movable;
    ctx.font = `${Math.abs(drawing.size)}px ${drawing.font}`;
    ctx.fillStyle = this.drawing.color;
    ctx.textBaseline = 'middle';
    ctx.fillText(drawing.text, 0, movable.h / 2);
    const filter = this.drawing.filter;
    filter && filter.apply(ctx);
  }

}