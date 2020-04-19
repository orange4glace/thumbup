import { Drawing } from 'src/app/model/drawing';
import { Movable } from 'src/app/model/movable';
import { Subscription } from 'rxjs';
import { ICommand } from 'src/app/model/command';
import { EventEmitter } from '@angular/core';

export class TextDrawingChangeTextCommand implements ICommand {
  constructor(public readonly drawing: TextDrawing,
    public readonly text: string) {}

  public execute(): ICommand {
    if (this.text === this.drawing.text) return;
    const inverse = new TextDrawingChangeTextCommand(
        this.drawing, this.drawing.text);
    this.drawing.text = this.text;
    return inverse;
  }

}

export class TextDrawingChangeSizeCommand implements ICommand {
  constructor(public readonly drawing: TextDrawing,
    public readonly size: number) {}

  public execute(): ICommand {
    if (this.size === this.drawing.size) return;
    const inverse = new TextDrawingChangeSizeCommand(
        this.drawing, this.drawing.size);
    this.drawing.size = this.size;
    return inverse;
  }

}

export class TextDrawingChangeColorCommand implements ICommand {
  constructor(public readonly drawing: TextDrawing,
    public readonly color: string) {}

  public execute(): ICommand {
    if (this.color === this.drawing.color) return;
    const inverse = new TextDrawingChangeColorCommand(
        this.drawing, this.drawing.color);
    this.drawing.color = this.color;
    return inverse;
  }

}

export class TextDrawingChangeFontCommand implements ICommand {
  constructor(public readonly drawing: TextDrawing,
    public readonly font: string) {}

  public execute(): ICommand {
    if (this.font === this.drawing.font) return;
    const inverse = new TextDrawingChangeFontCommand(
        this.drawing, this.drawing.font);
    this.drawing.font = this.font;
    return inverse;
  }

}

class TextMeasure {
  private readonly cvs_ = document.createElement('canvas');
  private readonly ctx_ = this.cvs_.getContext('2d');

  public measure(font: string, size: number, text: string): TextMetrics {
    this.ctx_.font = `${size}px ${font}`;
    return this.ctx_.measureText(text);
  }
}
const Measure = new TextMeasure();

export class TextDrawing extends Drawing {

  static readonly type = 'TextDrawing';

  public readonly onDidChangeText = new EventEmitter<void>();

  public readonly movable = new Movable();

  private subs_: Subscription[] = [];

  private disableDetectMovableChange_ = false;

  private font_: string = 'Nanum Gothic';
  public get font() { return this.font_; }
  private size_: number;
  public get size() { return this.size_; }
  private text_: string;
  public get text() { return this.text_; }
  private color_: string = "#000000";
  public get color() { return this.color_; }
  public set color(v: string) {
    this.color_ = v;
    this.onDidChangeText.emit();
  }
  private scaleX_: number = 1;
  public get scaleX() { return this.scaleX_; }
  private scaleY_: number = 1;
  public get scaleY() { return this.scaleY_; }

  constructor(
    font: string, size: number, text: string) {
    super(TextDrawing.type, 'Text');
    this.name = `Text ${this.id}`;
    this.font_ = font;
    this.size_ = size;
    this.text = text;
    this.subs_.push(this.movable.onDidChangeSize.subscribe(() => {
      this.fitFontSizeToMovable();
    }));
  }

  private fitFontSizeToMovable() {
    if (this.disableDetectMovableChange_) return;
    this.size_ = Math.round(this.movable.h / 1.5);
    this.onDidChangeText.emit();
  }
  
  public set font(v: string) {
    this.font_ = v;
    this.disableDetectMovableChange_ = true;
    const metrics = Measure.measure(this.font, this.size, this.text);
    this.movable.w = metrics.width * this.scaleX;
    this.movable.h = this.size * this.scaleY * 1.5;
    this.disableDetectMovableChange_ = false;
    this.onDidChangeText.emit();
  }

  public set text(v: string) {
    this.text_ = v;
    const metrics = Measure.measure(this.font, this.size, this.text);
    this.movable.w = metrics.width * this.scaleX;
    this.movable.h = this.size * this.scaleY * 1.5;
    this.onDidChangeText.emit();
  }

  public set size(v: number) {
    if (isNaN(v)) {
      this.onDidChangeText.emit();
      return;
    }
    this.size_ = v;
    this.disableDetectMovableChange_ = true;
    const metrics = Measure.measure(this.font, this.size, this.text);
    this.movable.w = metrics.width * this.scaleX;
    this.movable.h = this.size * this.scaleY * 1.5;
    this.disableDetectMovableChange_ = false;
    this.onDidChangeText.emit();
  }


  // TODO : dispose

}