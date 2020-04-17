import { Injectable } from '@angular/core';
import { Canvas } from 'src/app/model/canvas';

@Injectable()
export class CanvasService {

  public readonly canvas: Canvas;

  constructor() {
    this.canvas = new Canvas();
  }

}