import { Movable } from 'src/app/model/movable';
import { Drawing } from 'src/app/model/drawing';
import { ColorDrawingFilter } from 'src/app/model/drawing-filter';

export class ImageDrawing extends Drawing {

  static readonly type = 'ImageDrawing';

  public readonly movable = new Movable();

  constructor(
    public readonly img: HTMLImageElement) {
    super(ImageDrawing.type, `Image`);
    this.name = `Image ${this.id}`;
    this.movable.w = img.width;
    this.movable.h = img.height;
    this.movable.onDidChangeSize.subscribe(() => this.onDidDirty.emit());
  }

}