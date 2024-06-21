import { DecimalPipe } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonButton,
  IonIcon,
  IonCard,
  IonItem,
  IonImg,
  IonLabel,
  IonText,
  IonThumbnail, IonRow, IonCol, IonList, IonModal } from '@ionic/angular/standalone';
import { QRCodeModule } from 'angularx-qrcode';
import { Subscription } from 'rxjs';
import { CartService } from 'src/app/services/cart/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
  standalone: true,
  imports: [IonModal, IonList, IonCol, IonRow, 
    IonText,
    IonLabel,
    IonImg,
    IonItem,
    IonCard,
    IonIcon,
    IonButton,
    IonBackButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonThumbnail,
    DecimalPipe,
    QRCodeModule
  ],
})
export class CartPage implements OnInit, OnDestroy {
  model: any = null;
  cartSub!: Subscription;
  currency = '₹';
  isQrPay = false;
  isToast = false;
  toastData: any = {};

  private cartService = inject(CartService);

  constructor() {}

  ngOnInit() {
    this.cartSub = this.cartService.cart.subscribe({
      next: (cart) => {
        console.log(cart);
        this.model = cart;
      },
    });
  }

  async startScan() {
    try {
      const code = await this.cartService.startScan();
      this.cartService.addItemByBarcode(code);
    } catch (e) {
      console.log(e);
    }
  }

  addQuantity(item: any) {
    this.cartService.addQuantity({ ...item, id: item?.item_id });
  }

  subtractQuantity(item: any) {
    this.cartService.subtractQuantity({ ...item, id: item?.item_id });
  }

  async pay(modal: IonModal) {
    try {
      const code = await this.cartService.startScan(0);
      console.log(code);
      if (!code) {
        this.isToast = true;
        this.toastData = {
          color: 'danger',
          message: 'Error! Please try again',
        };
        return;
      }

      this.isToast = true;
      this.toastData = {
        color: 'success',
        message: 'Payment successful',
      };
      modal.dismiss();

      // clear cart
      this.cartService.clearCart();
    } catch (e) {
      console.log(e);
    }
  }

  ngOnDestroy(): void {
    if (this.cartSub) this.cartSub.unsubscribe();
  }
}
