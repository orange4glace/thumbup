import { Component, Input, Inject, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { TextDrawing, TextDrawingChangeTextCommand, TextDrawingChangeSizeCommand, TextDrawingChangeColorCommand, TextDrawingChangeFontCommand } from 'src/app/model/text-drawing';
import { ICommandService } from 'src/app/service/command.service';
import { CanvasAddStackElementCommand } from 'src/app/model/canvas';

@Component({
  selector: 'text-drawing-control',
  templateUrl: './text-drawing-control.component.html',
  styleUrls: ['./text-drawing-control.component.scss']
})
export class TextDrawingControlComponent implements OnInit, OnDestroy {

  private subs_: Subscription[] = [];

  @Input() drawing: TextDrawing;

  public text: string;
  public onChangeText(text: string) {
    const drawing = this.drawing;
    this.commandService_.dispatch(
      new TextDrawingChangeTextCommand(drawing, text));
  }

  public size: number;
  public onChangeSize(size: number) {
    const drawing = this.drawing;
    this.commandService_.dispatch(
      new TextDrawingChangeSizeCommand(drawing, size));
  }

  private color_: string;
  public get color() { return this.color_; }
  public set color(v: string) {
    this.commandService_.dispatch(
      new TextDrawingChangeColorCommand(this.drawing, v));
  }
  onColorChange() {
    this.commandService_.dispatch(
      new CanvasAddStackElementCommand());
  }

  public font: string;
  public onChangeFont(font: string) {
    const drawing = this.drawing;
    this.commandService_.dispatch(
      new TextDrawingChangeFontCommand(drawing, font));
    this.commandService_.dispatch(
      new CanvasAddStackElementCommand());
  }

  constructor(
    @Inject(ICommandService) private readonly commandService_: ICommandService) {
    
  }

  ngOnInit() {
    this.text = this.drawing.text;
    this.size = this.drawing.size;
    this.font = this.drawing.font;
    this.color_ = this.drawing.color;
    this.subs_.push(this.drawing.onDidChangeText.subscribe(() => {
      this.text = this.drawing.text;
      this.size = this.drawing.size;
      this.color_ = this.drawing.color;
      this.font = this.drawing.font;
    }));
  }

  ngOnDestroy() {
    this.subs_.forEach(sub => sub.unsubscribe());
  }

  onBlur() {
    this.commandService_.dispatch(
      new CanvasAddStackElementCommand());
  }

}