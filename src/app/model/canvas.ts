import { Drawing } from 'src/app/model/drawing';

export class Canvas {

  private drawings_: Array<Drawing> = [];
  public get drawings(): ReadonlyArray<Drawing> {
    return this.drawings_; }

  constructor() {

  }

  public addDrawing(drawing: Drawing) {
    this.drawings_.push(drawing);
  }

}