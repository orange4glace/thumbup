import { Movable } from 'src/app/model/movable';
import { EventEmitter } from '@angular/core';
import { Drawing } from 'src/app/model/drawing';

export class ImageDrawing extends Drawing {

  static readonly type = 'ImageDrawing';

  public readonly onDidDirty = new EventEmitter<void>();

  public readonly movable = new Movable();

  constructor(
    public readonly img: HTMLImageElement) {
    super(ImageDrawing.type);
    this.movable.w = img.width;
    this.movable.h = img.height;
    console.log(this.movable.w, this.movable.h, img.width, img.height);
    this.movable.onDidChangeSize.subscribe(() => this.onDidDirty.emit());
  }

}