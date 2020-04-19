import { ImageFilter } from 'src/app/util/image-filter';
import { EventEmitter } from '@angular/core';
import { ICommand } from 'src/app/model/command';
import { ICommandService } from 'src/app/service/command.service';

export interface IDrawingFilter {

  readonly type: string;

  readonly onUpdate: EventEmitter<void>;
  apply(ctx: CanvasRenderingContext2D): void;

}

export abstract class AbstractDrawingFilter implements IDrawingFilter {

  public abstract get type(): string;
  public readonly onUpdate = new EventEmitter<void>();

  public abstract apply(ctx: CanvasRenderingContext2D): void;

}

export class BlurDrawingFilter extends AbstractDrawingFilter {

  public static readonly type = "Blur";
  readonly type = BlurDrawingFilter.type;

  public apply(ctx: CanvasRenderingContext2D) {
    const g = 1 / 9;
    ImageFilter.boxFilter(ctx, [g,g,g,g,g,g,g,g,g]);
  }

}

export class ColorDrawingFilter extends AbstractDrawingFilter {

  public static readonly type = "Color";
  readonly type = ColorDrawingFilter.type;

  private r_: number = 100;
  public get r() { return this.r_; }
  public set r(v: number) {
    this.r_ = v;
    this.onUpdate.emit();
  }
  private g_: number = 70;
  public get g() { return this.g_; }
  public set g(v: number) {
    this.g_ = v;
    this.onUpdate.emit();
  }
  private b_: number = 30;
  public get b() { return this.b_; }
  public set b(v: number) {
    this.b_ = v;
    this.onUpdate.emit();
  }
  private o_: number = 0.3;
  public get o() { return this.o_; }
  public set o(v: number) {
    this.o_ = v;
    this.onUpdate.emit();
  }

  public apply(ctx: CanvasRenderingContext2D) {
    ImageFilter.mixWithColor(ctx, this.r, this.g, this.b, this.o);
  }

}

export class ColorDawingFilterChangeCommand implements ICommand {
  constructor(public readonly filter: ColorDrawingFilter,
    public readonly r, public readonly g, public readonly b,
    public readonly o) {}

  public execute(): ICommand {
    const inverse = new ColorDawingFilterChangeCommand(
      this.filter, this.filter.r, this.filter.g, this.filter.b,
      this.filter.o);
    this.filter.r = this.r;
    this.filter.g = this.g;
    this.filter.b = this.b;
    this.filter.o = this.o;
    return inverse;
  }
}

export class GrayscaleDrawingFilter extends AbstractDrawingFilter {

  public static readonly type = "Grayscale";
  readonly type = GrayscaleDrawingFilter.type;

  public apply(ctx: CanvasRenderingContext2D) {
    ImageFilter.grayScale(ctx);
  }

}

class _FilterFactory {

  public create(type: string) {
    switch (type) {
      case BlurDrawingFilter.type:
        return new BlurDrawingFilter();
      case ColorDrawingFilter.type:
        return new ColorDrawingFilter();
      case GrayscaleDrawingFilter.type:
        return new GrayscaleDrawingFilter();
    }
    return null;
  }

}
export const FilterFactory = new _FilterFactory();