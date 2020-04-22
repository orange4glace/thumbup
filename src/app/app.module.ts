import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { PortalModule } from '@angular/cdk/portal';

import { AppComponent } from './app.component';
import { MovableComponent } from 'src/app/components/movable/movable.component';
import { CanvasService } from 'src/app/service/canvas.service';
import { ImageDrawingComponent } from 'src/app/components/image-drawing/image-drawing.component';
import { CanvasComponent } from 'src/app/components/canvas/canvas.component';
import { TextDrawingComponent } from 'src/app/components/text-drawing/text-drawing.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ControlPannelComponent } from 'src/app/components/control/control-pannel.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { MatSliderModule } from '@angular/material/slider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { CanvasComponentService } from 'src/app/components/canvas/canvas.component.service';
import { MovableControlComponent } from 'src/app/components/control/movable/movable-control.component';
import { LayerControlComponent } from 'src/app/components/control/layer/layer-control.component';
import { LayerControlItemComponent } from 'src/app/components/control/layer/layer-control-item.component';
import { TextDrawingControlComponent } from 'src/app/components/control/text-drawing/text-drawing-control.component';
import { DrawingControlComponent } from 'src/app/components/control/drawing/drawing-control.component';
import { ColorFilterControlComponent } from 'src/app/components/control/filter/color-filter-control';
import { ColorPickerModule } from 'ngx-color-picker';
import { ImageDrawingControlComponent } from 'src/app/components/control/image-drawing/image-drawing-control.component';
import { KeybindingService } from 'src/app/service/keybinding.service';

@NgModule({
  declarations: [
    AppComponent,
    ControlPannelComponent,
    MovableControlComponent,
    LayerControlComponent,
    LayerControlItemComponent,
    DrawingControlComponent,
    ColorFilterControlComponent,
    TextDrawingControlComponent,
    ImageDrawingControlComponent,
    MovableComponent,
    CanvasComponent,
    ImageDrawingComponent,
    TextDrawingComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    PortalModule,

    MatFormFieldModule,
    MatButtonModule,
    MatDividerModule,
    MatCardModule,
    MatInputModule,
    MatSliderModule,
    MatSelectModule,
    MatCheckboxModule,

    ColorPickerModule
  ],
  providers: [
    KeybindingService,
    CanvasService,
    CanvasComponentService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
