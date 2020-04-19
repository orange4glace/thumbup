import { Component } from '@angular/core';
import { Movable } from 'src/app/model/movable';
import { CanvasService } from 'src/app/service/canvas.service';
import { ICommandService, CanvasCommandService } from 'src/app/service/command.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [{
      provide: ICommandService,
      useClass: CanvasCommandService
    }
  ]
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
