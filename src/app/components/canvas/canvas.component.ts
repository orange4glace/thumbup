import { Component, ComponentFactoryResolver, Input } from '@angular/core';
import { Canvas } from 'src/app/model/canvas';

@Component({
  selector: 'canvas-component',
  templateUrl: './canvas.component.html'
})
export class CanvasComponent {

  @Input()
  canvas: Canvas;

  constructor() {
    
  }

}