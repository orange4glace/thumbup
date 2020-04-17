import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { MovableComponent } from 'src/app/components/movable/movable.component';
import { UploadComponent } from 'src/app/components/upload/upload.component';
import { CanvasService } from 'src/app/service/canvas.service';
import { ImageDrawingComponent } from 'src/app/components/image-drawing/image-drawing.component';
import { CanvasComponent } from 'src/app/components/canvas/canvas.component';
import { DrawingComponent } from 'src/app/components/canvas/drawing.component';

@NgModule({
  declarations: [
    AppComponent,
    MovableComponent,
    ImageDrawingComponent,
    UploadComponent,
    CanvasComponent,
    DrawingComponent,
  ],
  imports: [
    BrowserModule
  ],
  providers: [
    CanvasService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
