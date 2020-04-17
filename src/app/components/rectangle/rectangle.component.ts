import { Component, Input } from '@angular/core';
import { Rectangle } from 'src/app/model/rectangle';

@Component({
  selector: 'rectangle',
  templateUrl: './rectangle.component.html'
})
export class RectangleComponent {

  @Input() rectangle: Rectangle;

}