import { Component } from '@angular/core';
import { Movable } from 'src/app/model/movable';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'thumb-up';

  public movable = new Movable();
}
