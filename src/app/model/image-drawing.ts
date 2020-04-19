import { Movable } from 'src/app/model/movable';
import { Drawing } from 'src/app/model/drawing';
import { ColorDrawingFilter } from 'src/app/model/drawing-filter';
import { ICommand } from 'src/app/model/command';

export class ImageDrawingChangeInvertCommand implements ICommand {
  constructor(public readonly drawing: ImageDrawing,
    public readonly invertX: boolean, public readonly invertY: boolean) {}

  public execute(): ICommand {
    const inverse = new ImageDrawingChangeInvertCommand(
      this.drawing, this.invertX, this.invertY);
    const invertX = this.invertX || this.invertX;
    const invertY = this.invertY || this.invertY;
    this.drawing.invertX = invertX;
    this.drawing.invertY = invertY;
    return inverse;
  }
}

export class ImageDrawing extends Drawing {

  static readonly type = 'ImageDrawing';

  public readonly movable = new Movable();

  private invertX_: boolean = false;
  public get invertX() { return this.invertX_; }
  public set invertX(v: boolean) {
    this.invertX_ = !!v;
    this.onDidDirty.emit();
  }
  private invertY_: boolean = false;
  public get invertY() { return this.invertY_; }
  public set invertY(v: boolean) {
    this.invertY_ = !!v;
    this.onDidDirty.emit();
  }

  constructor(
    public readonly img: HTMLImageElement) {
    super(ImageDrawing.type, `Image`);
    this.name = `Image ${this.id}`;
    this.movable.w = img.width;
    this.movable.h = img.height;
    this.movable.onDidChangeSize.subscribe(() => this.onDidDirty.emit());
  }

}