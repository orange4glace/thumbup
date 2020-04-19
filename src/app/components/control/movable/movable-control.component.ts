import { Component, Inject, Input, OnInit, OnDestroy, OnChanges, SimpleChange, SimpleChanges } from '@angular/core';
import { ICommandService } from 'src/app/service/command.service';
import { Subscription } from 'rxjs';
import { Movable, MovableTranslateCommand, MovableResizeCommand } from 'src/app/model/movable';
import { CanvasAddStackElementCommand } from 'src/app/model/canvas';

@Component({
  selector: 'movable-control',
  templateUrl: './movable-control.component.html',
  styleUrls: ['./movable-control.component.scss']
})
export class MovableControlComponent implements OnInit, OnDestroy, OnChanges {

  private subs_: Subscription[] = [];

  @Input() movable: Movable;

  public x: number;
  public y: number;
  public onChangePosition(x: number, y: number) {
    const movable = this.movable;
    const ww = (x === undefined ? movable.x : x); 
    const hh = (y === undefined ? movable.y : y); 
    this.commandService_.dispatch(
      new MovableTranslateCommand(movable, ww, hh));
    this.commandService_.dispatch(
      new CanvasAddStackElementCommand());
  }

  public w: number;
  public h: number;
  public onChangeSize(w: number, h: number) {
    const movable = this.movable;
    const ww = (w === undefined ? movable.w : w); 
    const hh = (h === undefined ? movable.h : h); 
    this.commandService_.dispatch(
      new MovableResizeCommand(movable, ww, hh));
    this.commandService_.dispatch(
      new CanvasAddStackElementCommand());
  }

  public r: number;
  public onDidChangeRotation(r: number) {
    // const movable = this.movable;
    // const rr = (r === undefined ? movable.r : r); 
    // this.commandService_.dispatch(
    //   new MovableResizeCommand(movable, ww, hh));
  }


  constructor(
    @Inject(ICommandService) private readonly commandService_: ICommandService) {

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.movable) {
      this.subs_.forEach(sub => sub.unsubscribe());
      this.subs_ = [];

      const movable = this.movable;
      this.x = movable.x;
      this.y = movable.y;
      this.w = movable.w;
      this.h = movable.h;
      this.r = movable.r;
      this.subs_.push(movable.onDidChange.subscribe(() => {
        this.x = movable.x;
        this.y = movable.y;
        this.w = movable.w;
        this.h = movable.h;
        this.r = movable.r;
      }));
    }
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.subs_.forEach(sub => sub.unsubscribe());
  }

}