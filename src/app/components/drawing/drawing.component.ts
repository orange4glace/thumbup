import { Drawing } from 'src/app/model/drawing';
import { MovableComponent } from 'src/app/components/movable/movable.component';
import { ComponentRef } from '@angular/core';

export interface IDrawingComponent {

  readonly drawing: Drawing;
  readonly movableComponent: MovableComponent;

  render(ctx: CanvasRenderingContext2D): void;

}