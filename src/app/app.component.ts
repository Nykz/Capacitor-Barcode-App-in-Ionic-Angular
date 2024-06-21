import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add, bagHandleOutline, barcodeOutline, cartOutline, checkmarkCircle, closeOutline, listOutline, remove, scanOutline } from 'ionicons/icons';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  constructor() {
    this.addAllIcons();
  }

  addAllIcons() {
    addIcons({
      cartOutline,
      scanOutline,
      listOutline,
      checkmarkCircle,
      bagHandleOutline,
      barcodeOutline,
      closeOutline,
      remove,
      add
    });
  }
}
