import { Movable } from 'src/app/model/movable';
import { EventEmitter } from '@angular/core';

export class ImageFig {

  public readonly onDidDirty = new EventEmitter<void>();

  public readonly movable = new Movable();

  constructor(
    public readonly img: HTMLImageElement) {
    this.movable.onDidChangeSize.subscribe(() => this.onDidDirty.emit());
  }

}