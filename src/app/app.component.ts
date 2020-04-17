import { Component } from '@angular/core';
import { Movable } from 'src/app/model/movable';
import { CanvasService } from 'src/app/service/canvas.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'thumb-up';

  public movable = new Movable();

  public get canvas() {
    return this.canvasService_.canvas; }

  constructor(
    private readonly canvasService_: CanvasService) {

  }
}
