import { Injectable } from '@angular/core';
import { Canvas } from 'src/app/model/canvas';
import { Subscription } from 'rxjs';
import { Drawing } from 'src/app/model/drawing';

@Injectable()
export class CanvasService {

  public readonly canvas: Canvas;

  private subs_: Subscription[] = [];

  private focusedDrawing_: Drawing;
  public focusedDrawing() { return this.focusedDrawing_; }

  constructor() {
    this.canvas = new Canvas();
  }

}